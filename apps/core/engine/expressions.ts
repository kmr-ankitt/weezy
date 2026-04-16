import { ExecutionContext } from "./types";

/**
 * Resolves expressions in a string or object.
 * Supports {{ $node["node-id"].data }} syntax.
 */
export function resolveExpressions(
  target: any,
  context: ExecutionContext,
): any {
  if (typeof target === "string") {
    return target.replace(/\{\{\s*(.*?)\s*\}\}/g, (_, expression) => {
      return evaluateExpression(expression, context);
    });
  }

  if (Array.isArray(target)) {
    return target.map((item) => resolveExpressions(item, context));
  }

  if (target !== null && typeof target === "object") {
    const resolved: any = {};
    for (const key in target) {
      resolved[key] = resolveExpressions(target[key], context);
    }
    return resolved;
  }

  return target;
}

function evaluateExpression(
  expression: string,
  context: ExecutionContext,
): string {
  // Regex to match $node["node-id"].data or $node['node-id'].data
  const nodeMatch = expression.match(/\$node\[["'](.*?)["']\]\.data(.*)/);

  if (nodeMatch) {
    const nodeId = nodeMatch[1];
    const path = nodeMatch[2]; // e.g., ".some.field"

    const nodeData = context[nodeId];

    if (nodeData === undefined) {
      return `[Error: Node ${nodeId} not found in context]`;
    }

    if (!path || path === "") {
      return typeof nodeData === "object"
        ? JSON.stringify(nodeData)
        : String(nodeData);
    }

    // Handle nested path access if any
    try {
      const value = getNestedValue(nodeData, path.split(".").filter(Boolean));
      return typeof value === "object" ? JSON.stringify(value) : String(value);
    } catch (e) {
      return `[Error: Path ${path} not found in node ${nodeId}]`;
    }
  }

  return `[Unsupported expression: ${expression}]`;
}

function getNestedValue(obj: any, path: string[]): any {
  return path.reduce((prev, curr) => {
    return prev?.[curr];
  }, obj);
}
