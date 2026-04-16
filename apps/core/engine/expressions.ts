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
  console.log(`DEBUG: Evaluating expression: "${expression}"`);

  // Try simplified syntax: {{nodeId.path}} or {{nodeId}}
  const simpleMatch = expression.match(
    /^([a-zA-Z0-9_-]+)(?:\.([a-zA-Z0-9_.-]+))?$/,
  );

  // Try legacy syntax: $node["node-id"].data
  const legacyMatch = expression.match(/\$node\[["'](.*?)["']\](.*)/);

  let nodeId: string | null = null;
  let path: string | null = null;

  if (simpleMatch) {
    nodeId = simpleMatch[1];
    path = simpleMatch[2] || "";
  } else if (legacyMatch) {
    nodeId = legacyMatch[1];
    path = legacyMatch[2] || "";
    // Clean up leading dot from legacy path if present
    if (path.startsWith(".")) path = path.slice(1);
    // Legacy mapping often has '.data' at the end, let's keep it flexible
  }

  if (nodeId) {
    console.log(`DEBUG: Target nodeId: ${nodeId}, path: ${path}`);
    const nodeData = context[nodeId];

    if (nodeData === undefined) {
      return `[Error: Node ${nodeId} not found]`;
    }

    if (!path || path === "") {
      return typeof nodeData === "object"
        ? JSON.stringify(nodeData)
        : String(nodeData);
    }

    // Handle nested path access
    try {
      let value = getNestedValue(nodeData, path.split(".").filter(Boolean));

      // Fallback: If they asked for .output but it's empty, try common result keys
      if (value === undefined && path === "output") {
        value =
          nodeData.result ??
          nodeData.data ??
          nodeData.message ??
          nodeData.success;
      }

      if (value === undefined) return `[Error: Path ${path} empty]`;
      return typeof value === "object" ? JSON.stringify(value) : String(value);
    } catch (e) {
      return `[Error: Path ${path} invalid]`;
    }
  }

  return `[Unsupported expression: ${expression}]`;
}

function getNestedValue(obj: any, path: string[]): any {
  return path.reduce((prev, curr) => {
    // Standard property access (works for arrays with string index e.g. "0")
    return prev?.[curr];
  }, obj);
}
