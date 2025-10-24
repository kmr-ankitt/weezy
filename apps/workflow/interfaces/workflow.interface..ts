export type INode = {
  id: string;
  name: string;
  type: string;
  parameters: Record<string, any>;
};

export type IConnection = {
  id: string;
  source: string;
  target: string | null;
};

export type WorkflowSettings = {
  active: boolean;
  timezone?: string;
};
