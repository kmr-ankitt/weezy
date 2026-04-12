import { IConnection, NodeInterface } from "@weezy/workflow";

/**
 * GraphMeta represents the metadata of a graph structure built from workflow nodes and connections.
 * It includes:
 * - inDegree: A map that tracks the number of incoming edges for each node.
 * - adj: An adjacency list that maps each node to its list of dependent nodes (outgoing edges).
 * - nodeMap: A map that allows quick access to node details based on their IDs.
 **/
export type GraphMeta = {
  inDegree: Map<string, number>;
  adj: Map<string, string[]>;
  nodeMap: Map<string, NodeInterface>;
};

/**
 * Builds a graph representation from the given nodes and connections.
 * The graph is represented using an adjacency list and an in-degree map for topological sorting.
 *
 * @param nodes - An array of nodes in the workflow.
 * @param connections - An array of connections representing dependencies between nodes.
 * @returns A GraphMeta object containing the in-degree map, adjacency list, and node map.
 **/
export function buildGraph(
  nodes: NodeInterface[],
  connections: IConnection[],
): GraphMeta {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();
  const nodeMap = new Map<string, NodeInterface>();

  for (const node of nodes) {
    inDegree.set(node.id, 0);
    adj.set(node.id, []);
    nodeMap.set(node.id, node);
  }

  for (const conn of connections) {
    if (conn.target) {
      adj.get(conn.source)!.push(conn.target);
      inDegree.set(conn.target, inDegree.get(conn.target)! + 1);
    }
  }

  return { inDegree, adj, nodeMap };
}
