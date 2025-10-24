import {
  IConnection,
  INode,
  WorkflowSettings,
} from "./interfaces/workflow.interface.";

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
}
