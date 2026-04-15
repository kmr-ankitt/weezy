# Weezy Nodes

This directory contains the execution implementations for all node types used within the Weezy workflow engine.

## Creating a New Node

To create and integrate a new node executor into the system, follow these steps:

### 1. Implement the Node Executor

Create a new TypeScript file for your node logic inside an appropriate folder (e.g., `core/` for fundamental logic, or `action/` for side-effects).

Your executor must implement the `NodeExecutor` type signature.

**Example: `apps/nodes/core/custom.ts`**

```typescript
import { NodeInterface } from "@weezy/workflow";

export async function executeCustomNode(
  node: NodeInterface,
  context: Record<string, any>,
) {
  // 1. Extract inputs from node parameters
  const { myInput } = node.parameters;

  // 2. Perform custom logic
  console.log(`Executing Custom Node ${node.id} with input:`, myInput);

  // 3. Return the execution outcome
  return {
    id: node.id,
    timestamp: new Date().toISOString(),
    status: "success",
    result: `Processed: ${myInput}`,
  };
}
```

### 2. Export the Executor

Ensure your newly created executor is exported from its directory so that it is accessible across the project.

**Example: `apps/nodes/core/index.ts`**

```typescript
// ... other exports ...
export * from "./custom";
```

### 3. Register the Node

Open `registry.ts` and add your executor to the central `nodeRegistry` registry. The `key` you configure here must match the node `type` requested by the workflow engine.

**Example: `apps/nodes/registry.ts`**

```typescript
import { executeCustomNode } from "./core";
// ... other imports

export const nodeRegistry: Record<string, NodeExecutor> = {
  // ... previously registered nodes ...
  custom: executeCustomNode, // <-- Register your new node
};
```

Your node is now integrated! When the workflow engine encounters a step of type `'custom'`, it will dynamically dispatch to `executeCustomNode`.

## Types and Signatures

Understanding the runtime inputs for an executor is straightforward:

```typescript
export type NodeExecutor = (
  node: NodeInterface,
  context: Record<string, any>,
) => Promise<any>;
```

- **`node`**: Represents the current node entity.
  - `node.id`: A string uniquely referencing the sequence step.
  - `node.parameters`: Configuration data inputted into this node specifically.
- **`context`**: A plain object sharing details about the global execution environment, running state, and potentially the outputs of previous execution steps.
