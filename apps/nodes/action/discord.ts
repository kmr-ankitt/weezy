import { NodeInterface } from "@weezy/workflow";

/**
Discord Node

payload:
  webhookUrl: string,
  content?: string,
  username?: string,
  avatarUrl?: string,
**/
export async function executeDiscordNode(
  node: NodeInterface,
  _context: Record<string, unknown>,
) {
  const { webhookUrl, content, username, avatarUrl } = node.parameters;

  if (!webhookUrl) {
    throw new Error("Discord webhookUrl is missing.");
  }

  // Discord 'content' must be a string and max 2000 characters
  let safeContent = String(content || "");
  if (safeContent.length > 2000) {
    safeContent = safeContent.slice(0, 1997) + "...";
  }

  interface DiscordPayload {
    content: string;
    username?: string;
    avatar_url?: string;
  }

  const payload: DiscordPayload = { content: safeContent };
  if (username) {
    payload.username = username as string;
  }
  if (avatarUrl) {
    payload.avatar_url = avatarUrl as string;
  }

  const res = await fetch(webhookUrl as string, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Discord Webhook Action Failed: ${res.statusText}`);
  }

  return {
    id: node.id,
    timestamp: new Date().toISOString(),
    success: true,
  };
}
