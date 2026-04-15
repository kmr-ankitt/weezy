export type ExecutionContext = Record<string, any>;

export type ExecutionResult = {
  status: "Success" | "Failed";
  data?: any;
  errors?: string;
};
