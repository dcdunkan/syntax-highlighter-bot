import hljs from "../deps.ts";

function tableIt(content: string) {
  const lines = content.trim().split("\n");
  const rows = lines.map((line) => `<tr><td>${line}</td></tr>`);
  return `<table><tbody>${rows.join("\n")}</tbody></table>`;
}

export function highlight(content: string, language?: string) {
  return tableIt(
    language
      ? hljs.highlight(content, { language }).value
      : hljs.highlightAuto(content).value,
  );
}

export function supportsLanguage(language: string) {
  return hljs.autoDetection(language) === undefined ? false : true;
}
