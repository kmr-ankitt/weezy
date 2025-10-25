import { IConnection } from "../interfaces/workflow.interface.";

export function getNextNode(
  currentNodeId: string,
  connections: IConnection[],
): string | null {
  for (const connection of connections) {
    if (currentNodeId === connection.source && connection.target !== null) {
      return connection.target;
    }
  }
  return null;
}
