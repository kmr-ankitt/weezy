import { NodeInterface } from "@weezy/workflow";

/**
Notion Node
Creates a new page in a database.

Parameters:
  apiKey: string (Internal Integration Token)
  databaseId: string (Target database ID)
  title: string (Page title)
  content?: string (Optional paragraph content)
**/
export async function executeNotionNode(
  node: NodeInterface,
  _context: Record<string, any>,
) {
  const { apiKey, databaseId, title, content } = node.parameters;

  if (!apiKey || !databaseId || !title) {
    throw new Error("Notion node requires apiKey, databaseId, and title.");
  }

  const payload: any = {
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [{ type: "text", text: { content: title } }],
      },
    },
  };

  if (content) {
    payload.children = [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: content } }],
        },
      },
    ];
  }

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`Notion API Error: ${errorData.message || res.statusText}`);
  }

  const data = await res.json();
  return {
    id: node.id,
    timestamp: new Date().toISOString(),
    pageId: data.id,
    url: data.url,
  };
}
