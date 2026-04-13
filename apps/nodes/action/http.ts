import { NodeInterface } from "@weezy/workflow";
import { HttpNodeExecutionResult } from "../types";

export async function executeHttpNode(
  node: NodeInterface,
): Promise<HttpNodeExecutionResult> {
  const { method, url, headers = {}, body } = node.parameters;

  try {
    const res = await fetch(url, {
      method,
      headers: headers as Record<string, string>,
      body: body ? JSON.parse(body) : undefined,
    });

    const data = await res.json();

    return {
      id: node.id,
      timestamp: new Date().toISOString(),
      status: res.status,
      data,
    };
  } catch (error: any) {
    throw new Error(
      `HTTP request failed for node ${node.id}: ${error.message}`,
    );
  }
}
