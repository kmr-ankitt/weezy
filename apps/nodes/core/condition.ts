import { NodeInterface } from "@weezy/workflow";

export async function executeConditionNode(
  node: NodeInterface,
  _context: Record<string, any>,
) {
  const { value1, value2, operator } = node.parameters;
  let result = false;

  switch (operator) {
    case "==":
    case "equals":
      result = value1 === value2;
      break;
    case "!=":
    case "notEquals":
      result = value1 !== value2;
      break;
    case ">":
      result = Number(value1) > Number(value2);
      break;
    case "<":
      result = Number(value1) < Number(value2);
      break;
    case ">=":
      result = Number(value1) >= Number(value2);
      break;
    case "<=":
      result = Number(value1) <= Number(value2);
      break;
    case "contains":
      result = String(value1).includes(String(value2));
      break;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }

  return {
    id: node.id,
    timestamp: new Date().toISOString(),
    result,
  };
}
