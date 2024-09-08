// Add indentation to all new lines
export function indent(str: string, depth: number = 2): string {
  return str.replace(/(\n+)/g, `$1${" ".repeat(depth)}`);
}
