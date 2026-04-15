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
  _context: Record<string, any>,
) {
  const { webhookUrl, content, username, avatarUrl } = node.parameters;

  if (!webhookUrl) {
    throw new Error("Discord webhookUrl is missing.");
  }

  const payload: any = { content };
  if (username) payload.username = username;
  if (avatarUrl) payload.avatar_url = avatarUrl;

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
