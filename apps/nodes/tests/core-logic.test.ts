import { describe, it, expect, vi } from "vitest";
import { executeStartNode } from "../core/start";
import { executeLogNode } from "../core/log";
import { executeDelayNode } from "../core/delay";
import { executeCronNode } from "../core/cron";
import { executeSwitchNode } from "../core/switch";

describe("Core Logic Nodes", () => {
  const ctx = {};

  describe("Start Node", () => {
    it("should return start data", async () => {
      const node = { id: "n1", type: "startNode", parameters: { foo: "bar" } };
      const result = await executeStartNode(node, ctx);
      expect(result.id).toBe("n1");
      expect(result.data).toEqual({ foo: "bar" });
    });
  });

  describe("Log Node", () => {
    it("should return static success message", async () => {
      const node = { id: "n1", type: "log", parameters: { message: "hello" } };
      const result = await executeLogNode(node, ctx);
      expect(result.message).toBe("Logged successfully");
      expect(result.level).toBe("info");
    });
  });

  describe("Delay Node", () => {
    it("should wait for the specified ms", async () => {
      vi.useFakeTimers();
      const node = { id: "n1", type: "delay", parameters: { ms: 1000 } };

      const promise = executeDelayNode(node, ctx);
      vi.advanceTimersByTime(1000);

      const result = await promise;
      expect(result.delayedMs).toBe(1000);
      vi.useRealTimers();
    });
  });

  describe("Cron Node", () => {
    it("should return timestamp and schedule", async () => {
      const node = {
        id: "n1",
        type: "cron",
        parameters: { schedule: "* * * * *" },
      };
      const result = await executeCronNode(node, ctx);
      expect(result.schedule).toBe("* * * * *");
      expect(result.timestamp).toBeDefined();
    });
  });

  describe("Switch Node", () => {
    it("should match a specific case", async () => {
      const node = {
        id: "n1",
        type: "switch",
        parameters: { value: "apple", cases: ["apple", "banana"] },
      };
      const result = await executeSwitchNode(node, ctx);
      expect(result.matchedCase).toBe("apple");
    });

    it("should return default if no case matches", async () => {
      const node = {
        id: "n1",
        type: "switch",
        parameters: { value: "orange", cases: ["apple", "banana"] },
      };
      const result = await executeSwitchNode(node, ctx);
      expect(result.matchedCase).toBe("default");
    });
  });
});
