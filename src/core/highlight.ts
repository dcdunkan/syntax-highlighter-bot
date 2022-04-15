import hljs from "../deps.ts";

// https://jasonvan.ca/posts/add-line-numbers-to-markdown-code-blocks
const applyLineNumbers = (content: string) => {
  const lines = content.trim().split("\n");
  const rows = lines.map((line, index) => {
    const lineNumber = index + 1;
    return `<tr><td class="line-number">${lineNumber}</td><td class="code-line">${line}</td></tr>`;
  });
  return `<table><tbody>${rows.join("\n")}</tbody></table>`;
};

export const highlight = (content: string, language?: string) =>
  language
    ? applyLineNumbers(hljs.highlight(content, { language }).value)
    : applyLineNumbers(hljs.highlightAuto(content).value);

export const supportsLanguage = (language: string) =>
  hljs.autoDetection(language) === undefined ? false : true;
