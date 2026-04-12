import { IConnection, NodeInterface } from "../interfaces";

/*
 * The destination node is the one that is never a source in any connection.
 */
export function findDestinationNode(
  nodes: NodeInterface[],
  connections: IConnection[],
): NodeInterface {
  const sources = new Set(connections.map((c) => c.source));
  const destinationNode = nodes.find((node) => {
    return !sources.has(node.id);
  });

  return destinationNode!;
}
