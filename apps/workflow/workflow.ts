import { IConnection, INode, WorkflowSettings } from "./interfaces";

type WorkflowParameter = {
  id: string;
  name: string;
  nodes: INode[];
  connections: IConnection[];
  settings: WorkflowSettings;
};

export class Workflow {
  id: string;
  name: string;
  nodes: INode[];
  connections: IConnection[];
  settings: WorkflowSettings;

  constructor(param: WorkflowParameter) {
    this.id = param.id;
    this.name = param.name;
    this.nodes = param.nodes;
    this.connections = param.connections;
    this.settings = param.settings;
  }

  setName(name: string) {
    this.name = name;
  }

  setNodes(node: INode) {
    this.nodes.push(node);
  }

  setConnection(connection: IConnection) {
    this.connections.push(connection);
  }

  setSettings(settings: WorkflowSettings) {
    this.settings = settings;
  }

  getNodes(): INode[] {
    return this.nodes;
  }

  getNode(id: string): INode | undefined {
    return this.nodes.find((node: INode) => node.id === id);
  }

  getConnections(): IConnection[] {
    return this.connections;
  }
}
