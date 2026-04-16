import { NodeInterface } from "@weezy/workflow";

/**
Telegram Node
Sends a text message using the Telegram Bot API.

Parameters:
  botToken: string (API token from @BotFather)
  chatId: string (Target chat/user ID)
  text: string (The message content)
  parseMode?: 'Markdown' | 'HTML'
**/
export async function executeTelegramNode(
  node: NodeInterface,
  _context: Record<string, unknown>,
) {
  const { botToken, chatId, text, parseMode = "Markdown" } = node.parameters;

  if (!botToken || !chatId || !text) {
    throw new Error("Telegram node requires botToken, chatId, and text.");
  }

  const isTruncated = String(text).length > 4096;
  const safeText = String(text).slice(0, 4096);

  const res = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: safeText,
        // Disable parse_mode if we truncated to avoid cutting tags mid-way
        parse_mode: isTruncated ? undefined : parseMode,
      }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Telegram API Error: ${errorData.description || res.statusText}`,
    );
  }

  return {
    id: node.id,
    timestamp: new Date().toISOString(),
    success: true,
  };
}
