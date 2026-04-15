import { NodeInterface } from "@weezy/workflow";

/**
OpenAI Node
Generates text using Chat Completions.

Parameters:
  apiKey: string
  prompt: string
  model?: string (default: gpt-4o)
  systemMessage?: string
**/
export async function executeOpenAINode(
  node: NodeInterface,
  _context: Record<string, any>,
) {
  const {
    apiKey,
    prompt,
    model = "gpt-4o",
    systemMessage = "You are a helpful assistant.",
  } = node.parameters;

  if (!apiKey || !prompt) {
    throw new Error("OpenAI node requires apiKey and prompt.");
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `OpenAI API Error: ${errorData.error?.message || res.statusText}`,
    );
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";

  return {
    id: node.id,
    timestamp: new Date().toISOString(),
    text,
    model: data.model,
  };
}
