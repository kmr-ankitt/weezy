export type ExecutionStatus =
  | "new" // Use when the execution record has been created but not yet queued or started.
  | "running" // Use while the execution is actively performing work.
  | "success" // Use when the execution completed all work successfully.
  | "error" // Use when the execution finished with a known/handled error (failure outcome).
  | "crashed" // Use when the execution terminated unexpectedly (unhandled exception, process crash).
  | "canceled"; // Use when the execution was explicitly canceled before normal completion.
