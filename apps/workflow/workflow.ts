import { ExecutionStatus } from "./execution";
import { IConnection, NodeInterface, WorkflowSettings } from "./interfaces";

type WorkflowParameter = {
  id: string;
  name: string;
  nodes: NodeInterface[];
  connections: IConnection[];
  settings: WorkflowSettings;
};

/**
 * Represents a workflow as a Directed Acyclic Graph (DAG).
 *
 * Each node in the graph represents an individual task, and each directed edge
 * (connection) represents a dependency — meaning the source task must complete
 * before the target task can begin.
 */

export class Workflow {
  id: string;
  name: string;
  nodes: NodeInterface[];
  connections: IConnection[];
  settings: WorkflowSettings;
  status: ExecutionStatus;

  constructor(param: WorkflowParameter) {
    this.id = param.id;
    this.name = param.name;
    this.nodes = param.nodes;
    this.connections = param.connections;
    this.settings = param.settings;
    this.status = "pending";
  }

  setName(name: string) {
    this.name = name;
  }

  setNodes(node: NodeInterface) {
    this.nodes.push(node);
  }

  setConnection(connection: IConnection) {
    this.connections.push(connection);
  }

  setSettings(settings: WorkflowSettings) {
    this.settings = settings;
  }

  setStatus(status: ExecutionStatus) {
    this.status = status;
  }

  getNodes(): NodeInterface[] {
    return this.nodes;
  }

  getNode(id: string): NodeInterface | undefined {
    return this.nodes.find((node: NodeInterface) => node.id === id);
  }

  getConnections(): IConnection[] {
    return this.connections;
  }
}
