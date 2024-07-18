// Add identation to all new lines
export function ident(str: string, depth: number = 2): string {
  return str
    .split(/(\n)/g)
    .map((s, i, arr) => s == '\n' && /\s+/.test(arr[i + 1]) ?  s + " ".repeat(depth) : s)
    .join("");
}