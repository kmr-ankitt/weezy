import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "./setup";
import { executeHttpNode } from "../action/http";
import { executeDiscordNode } from "../action/discord";
import { executeTelegramNode } from "../action/telegram";
import { executeNotionNode } from "../action/notion";
import { executeOpenAINode } from "../action/openai";

describe("Action Integration Nodes (Mocked)", () => {
  const ctx = {};

  describe("HTTP Node", () => {
    it("should perform a successful GET request", async () => {
      server.use(
        http.get("https://example.com/api", () => {
          return HttpResponse.json({ success: true });
        }),
      );

      const node = {
        id: "n1",
        type: "http",
        parameters: { url: "https://example.com/api", method: "GET" },
      };
      const result = await executeHttpNode(node, ctx);
      expect(result.data).toEqual({ success: true });
      expect(result.status).toBe(200);
    });
  });

  describe("Discord Node", () => {
    it("should send a webhook message", async () => {
      server.use(
        http.post("https://discord.com/api/webhooks/123", () => {
          return new HttpResponse(null, { status: 204 });
        }),
      );

      const node = {
        id: "n1",
        type: "discord",
        parameters: {
          webhookUrl: "https://discord.com/api/webhooks/123",
          content: "hello",
        },
      };
      const result = await executeDiscordNode(node, ctx);
      expect(result.success).toBe(true);
    });
  });

  describe("Telegram Node", () => {
    it("should send a telegram message", async () => {
      server.use(
        http.post("https://api.telegram.org/botTOKEN/sendMessage", () => {
          return HttpResponse.json({ ok: true, result: { message_id: 1 } });
        }),
      );

      const node = {
        id: "n1",
        type: "telegram",
        parameters: { botToken: "TOKEN", chatId: "123", text: "hello" },
      };
      const result = await executeTelegramNode(node, ctx);
      expect(result.success).toBe(true);
    });
  });

  describe("Notion Node", () => {
    it("should create a notion page", async () => {
      server.use(
        http.post("https://api.notion.com/v1/pages", () => {
          return HttpResponse.json({ id: "page_123" });
        }),
      );

      const node = {
        id: "n1",
        type: "notion",
        parameters: { apiKey: "KEY", databaseId: "DB", title: "Test" },
      };
      const result = await executeNotionNode(node, ctx);
      expect(result.pageId).toBe("page_123");
    });
  });

  describe("OpenAI Node", () => {
    it("should generate text via chat completions", async () => {
      server.use(
        http.post("https://api.openai.com/v1/chat/completions", () => {
          return HttpResponse.json({
            choices: [{ message: { content: "AI Response" } }],
            model: "gpt-4o",
          });
        }),
      );

      const node = {
        id: "n1",
        type: "openai",
        parameters: { apiKey: "KEY", prompt: "Hello" },
      };
      const result = await executeOpenAINode(node, ctx);
      expect(result.text).toBe("AI Response");
    });
  });
});
