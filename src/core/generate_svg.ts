import {
  DOMParser,
  HTMLElement,
  HTMLTableCellElement,
  parseCSS,
} from "../deps.ts";
import { escape } from "./helpers.ts";

const parseHTML = new DOMParser().parseFromString;

interface Token {
  text: string;
  color: string;
  backgroundColor?: string;
  textDecoration?: string;
  fontStyle?: string;
  fontWeight?: string;
}

interface FontSizeProperties {
  font_size: number;
  char_space: number; // length * char_space
  line_height: number; // technically not line_height.
  margin: {
    // we don't need bottom, because it is the same as the line_height.
    top: number;
    right: number;
    left: number;
  };
}

// Experiment and add yourself a few if you'd like to.
// I don't want to spend time on this since I'm fine with 12.
export const FONT_SIZE_PROPS: Record<
  number,
  FontSizeProperties
> = {
  12: { // the official one
    font_size: 12, // future use.
    line_height: 20,
    char_space: 7.2,
    margin: {
      top: 25,
      right: 8,
      left: 15,
    },
  },
};

const supported_attrs = [
  "color",
  "font-style",
  "font-weight",
  "background",
  "text-decoration",
  "background-color",
] as const;

type DeclarationName = typeof supported_attrs[number];
type Declaration = {
  [K in DeclarationName]?: string;
};

export function getDeclarations(cssString: string) {
  const colors = new Map<string, Declaration>();
  const parsed = parseCSS(cssString);

  for (const rule of parsed.stylesheet.rules) {
    const declaration: Declaration = {};

    for (const decl of rule.declarations) {
      if (decl.type !== "property" || !decl.name) continue;
      if (supported_attrs.includes(decl.name as DeclarationName)) {
        declaration[decl.name as DeclarationName] = decl.value!;
      }
    }

    for (const selector of rule.selectors) {
      colors.set(selector, declaration);
    }
  }

  return colors;
}

function styleToken(
  text: string,
  normalColor: string,
  classes: string[],
  cssDecl: Map<string, Declaration>,
) {
  const token: Token = { text, color: "" };

  for (const cls of classes) {
    const classProps = cssDecl.get(cls);
    if (!classProps) continue;

    if (classProps.color && !token.color) {
      token.color = classProps.color;
    }

    if (classProps["background-color"] && !token.backgroundColor) {
      token.backgroundColor = classProps["background-color"];
    }
    if (classProps["font-style"] && !token.fontStyle) {
      token.fontStyle = classProps["font-style"];
    }
    if (classProps["font-weight"] && !token.fontWeight) {
      token.fontWeight = classProps["font-weight"];
    }
    if (classProps["text-decoration"] && !token.textDecoration) {
      token.textDecoration = classProps["text-decoration"];
    }
  }

  if (!token.color) token.color = normalColor;
  return token;
}

function getLineTokens(
  htmlString: string,
  cssDecl: Map<string, Declaration>,
) {
  const normalColor = cssDecl.get(".hljs")?.color!;
  const doc = parseHTML(htmlString, "text/html");
  const lineEls = doc.getElementsByTagName("td") as HTMLTableCellElement[];

  const lines: Token[][] = [];

  for (const line of lineEls) {
    const children = line.childNodes as HTMLElement[];
    const lineTokens: Token[] = [];
    for (const child of children) {
      const text = child.textContent as string;
      const classList = child.classList as Set<string> | undefined;

      if (!classList) {
        lineTokens.push({ text, color: normalColor });
        continue;
      }

      const classes = Array
        .from(classList.values())
        // .filter((c) => c !== "function_") // TODO: deal with these kind of things later.
        .map((c) => `.${c}`);

      const token = styleToken(text, normalColor, classes, cssDecl);
      lineTokens.push(token);
    }

    lines.push(lineTokens);
  }

  return lines;
}

const WRAP_BOUNDARY = 650;

export function makeSVG(
  htmlString: string,
  declarations: Map<string, Declaration>,
  fontSize: number,
  wrap: boolean,
  font: string,
) {
  const fontProps = FONT_SIZE_PROPS[fontSize];
  if (!fontProps) {
    throw new Error(
      `Unsupported font size: ${fontSize}. No font properties found.`,
    );
  }

  // there might be nested language things.
  // Just replacing them is not perfect solution, but it works here.
  htmlString = htmlString.replace(/(<span class="language-\w+">)/g, "");
  // this is for nesting spans as well. This hack sucks
  htmlString = htmlString.replace(
    /(<span class="(?:.*?)">)(?!<\/span)(.*?)<span/g,
    "$1$2</span><span",
  );

  const lines = getLineTokens(htmlString, declarations);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg">\n`;

  const lastLineNumber = lines.length + 1;
  const lineSectionWidth = lastLineNumber.toString().length *
    fontProps.char_space;

  // For line wrapping purposes...
  let estimatedWidth = 0;

  for (const line of lines) {
    const lineTokenLength = line
      .map((t) => t.text.length).reduce((a, b) => a + b, 0);

    const lineWidth = Math.round(
      fontProps.margin.left +
        // lineSectionWidth + fontProps.margin.left +
        // why?: we're calculating content wise, not including linewidth to reduce complexity.
        (lineTokenLength * fontProps.char_space) +
        fontProps.margin.right +
        ((fontProps.char_space + (fontProps.char_space / 4)) / 2),
      //                          ^approx. space for a dot?
    );

    if (lineWidth > estimatedWidth) {
      estimatedWidth = lineWidth;
    }
  }

  // 2 is the scale of the generated SVG
  const needsWrapping = wrap && ((estimatedWidth * 2) > (WRAP_BOUNDARY * 2));

  let longestLineLength = fontProps.margin.left;
  let y = fontProps.margin.top; // 25;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    let x = fontProps.margin.left; // 15;

    svg += `
    <text xml:space="preserve" text-rendering="geometricPrecision"
      x="${x}" y="${y}"
      font-size="${fontSize}" font-family="${font}"
      fill="${declarations.get(".hljs")?.color}" fill-opacity="0.5"
    >${
      // this has to be the the most simplest hack for this.
      lineNumber.toString().padStart(
        lastLineNumber.toString().length,
        " ",
      )}</text>`;

    x += lineSectionWidth + fontProps.margin.left;
    //                      ^ a little spacing between the content and ln.

    for (const token of line) {
      if (token.backgroundColor) {
        // TODO: implement logic. later, not needed rn.
        // Create rectangle, put it in the background of the <text>. (For .diff)
      }

      svg += `
      <text xml:space="preserve" text-rendering="geometricPrecision"
        x="${x}" y="${y}"
        font-size="${fontSize}" font-family="${font}"
        fill="${token.color}" ${getSVGAttributes(token)} `;

      let currentTokenLength = token.text.length * fontProps.char_space; // 7.2

      // IT WORKS :P
      // ik its repetition and isn't perfect. but it works, thats what Im goin for.
      while (
        needsWrapping && (x + currentTokenLength) > WRAP_BOUNDARY
      ) {
        // these tokens should be cut off at the end
        const acceptedLimit = WRAP_BOUNDARY - x;
        const acceptedEndTextPos = Math.round(
          acceptedLimit / fontProps.char_space,
        );
        const textInThatLine = token.text.slice(0, acceptedEndTextPos);
        svg += `\n    >${escape(textInThatLine)}</text>`;

        // split the rest
        const restOfTheText = token.text.substring(acceptedEndTextPos);

        const restOfTheTextPos = restOfTheText.length * fontProps.char_space;
        currentTokenLength = restOfTheTextPos;

        token.text = restOfTheText;
        x = fontProps.margin.left + lineSectionWidth + fontProps.margin.left; // yeh, twice.
        y += fontProps.line_height;

        svg += `
        <text xml:space="preserve" text-rendering="geometricPrecision"
          x="${x}" y="${y}"
          font-size="${fontSize}" font-family="${font}"
          fill="${token.color}" ${getSVGAttributes(token)} `;
      }

      svg += `\n    >${escape(token.text)}</text>`;
      x += currentTokenLength;
    }

    y += fontProps.line_height; // 20;

    if (x > longestLineLength) {
      longestLineLength = x;
    }
  }

  // The bottom and right empty spacing.
  svg += `
  <text xml:space="preserve"
        x="${
    needsWrapping
      ? WRAP_BOUNDARY + fontProps.margin.right
      : longestLineLength + fontProps.margin.right
  }"
        y="${y}"
        font-size="${fontSize}"
        font-family="${font}"
        text-rendering="geometricPrecision"
        fill="${declarations.get(".hljs")?.background}"
  >.</text>`;

  svg += `\n</svg>`;
  return svg;
}

function getSVGAttributes(token: Token) {
  const attrs = new Array<string>();

  if (token.fontStyle) {
    attrs.push(`font-style="${token.fontStyle}"`);
  }

  if (token.fontWeight) {
    const weight = parseInt(token.fontWeight);
    // normal, lighter, bold, bolder
    if (isNaN(weight)) {
      attrs.push(`font-weight="normal"`);
    } else if (weight < 300) {
      attrs.push(`font-weight="lighter"`);
    } else if (weight > 400 && weight <= 700) {
      attrs.push(`font-weight="bold"`);
    } else {
      attrs.push(`font-weight="bolder"`);
    }
  }

  if (token.textDecoration) {
    attrs.push(`text-decoration="${token.textDecoration}"`);
  }

  return attrs.join(" ");
}
