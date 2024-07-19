import { MappedDocumentGenerator } from '../../MappedDocumentGenerator.js'


export function forEachNodeNewLine<T>(
  gen: MappedDocumentGenerator,
  nodes: ReadonlyArray<T>,
  newLines: number,
  fn: (node: T, index: number) => void
) {
  if (nodes.length === 0) return;
  fn(nodes[0], 0);
  if (nodes.length === 1) {
    return;
  }

  for (let i = 1; i < nodes.length; i++) {
    gen.addNewLine(newLines);
    fn(nodes[i], i);
  }
}

export function forEachNodeSeparator<T>(
  gen: MappedDocumentGenerator,
  nodes: ReadonlyArray<T>,
  separator: string,
  fn: (node: T, index: number) => void
) {
  if (nodes.length === 0) return;

  fn(nodes[0], 0);

  if (nodes.length > 1) {
    for (let i = 1; i < nodes.length; i++) {
      gen.addText(separator);
      fn(nodes[i], i);
    }
  }
}