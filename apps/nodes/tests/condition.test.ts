import { describe, it, expect } from "vitest";
import { executeConditionNode } from "../core/condition";
import { NodeInterface } from "@weezy/workflow";

describe("Condition Node", () => {
  const createNode = (parameters: any): NodeInterface => ({
    id: "condition-node",
    type: "condition",
    parameters,
  });

  const ctx = {};

  it("should return result: true for matching values with ==", async () => {
    const node = createNode({ value1: "test", value2: "test", operator: "==" });
    const result = await executeConditionNode(node, ctx);
    expect(result.result).toBe(true);
  });

  it("should return result: false for non-matching values with ==", async () => {
    const node = createNode({
      value1: "test",
      value2: "mismatch",
      operator: "==",
    });
    const result = await executeConditionNode(node, ctx);
    expect(result.result).toBe(false);
  });

  it("should handle contains operator correctly", async () => {
    const node = createNode({
      value1: "hello world",
      value2: "hello",
      operator: "contains",
    });
    const result = await executeConditionNode(node, ctx);
    expect(result.result).toBe(true);

    const node2 = createNode({
      value1: "hello world",
      value2: "mars",
      operator: "contains",
    });
    const result2 = await executeConditionNode(node2, ctx);
    expect(result2.result).toBe(false);
  });

  it("should handle numeric comparisons correctly", async () => {
    const node = createNode({ value1: "10", value2: "5", operator: ">" });
    const result = await executeConditionNode(node, ctx);
    expect(result.result).toBe(true);

    const node2 = createNode({ value1: "3", value2: "10", operator: "<" });
    const result2 = await executeConditionNode(node2, ctx);
    expect(result2.result).toBe(true);
  });

  it("should throw error for unsupported operator", async () => {
    const node = createNode({ value1: "a", value2: "b", operator: "invalid" });
    await expect(executeConditionNode(node, ctx)).rejects.toThrow(
      "Unknown operator: invalid",
    );
  });
});
