import { IConnection, INode } from "../interfaces";

/*
 * The start node is the one that is never a target in any connection.
 */
export function findStartNode(
  nodes: INode[],
  connections: IConnection[],
): INode {
  const targets = new Set(connections.map((c) => c.target));
  const startNode = nodes.find((node) => {
    return !targets.has(node.id);
  });

  return startNode!;
}
