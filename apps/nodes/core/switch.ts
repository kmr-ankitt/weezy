import { NodeInterface } from "@weezy/workflow";

export async function executeSwitchNode(
  node: NodeInterface,
  _context: Record<string, any>,
) {
  const { value, cases } = node.parameters;

  let matchedCase = null;
  if (Array.isArray(cases)) {
    for (const c of cases) {
      if (c === value) {
        matchedCase = c;
        break;
      }
    }
  }

  return {
    id: node.id,
    timestamp: new Date().toISOString(),
    input: value,
    matchedCase: matchedCase || "default",
  };
}
