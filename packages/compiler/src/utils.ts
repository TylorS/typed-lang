// Add identation to all new lines
export function ident(str: string): string {
  return str
    .split("\n")
    .map((s) => `  ${s}`)
    .join("\n");
}