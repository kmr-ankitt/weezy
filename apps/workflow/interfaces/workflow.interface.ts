export type NodeInterface = {
  id: string;
  type: string;
  parameters: Record<string, string>;
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
