"use client";

import { X, Trash2, Info, Copy, Check } from "lucide-react";
import { useState } from "react";

export function NodeProperties({
  node,
  onClose,
  onUpdate,
  onDelete,
}: {
  node: { id: string; data: Record<string, unknown> };
  onClose: () => void;
  onUpdate: (id: string, data: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!node) return null;

  const handleChange = (field: string, value: string) => {
    onUpdate(node.id, { ...node.data, [field]: value });
  };

  const copyId = () => {
    navigator.clipboard.writeText(`{{${node.id}.output}}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col border-l border-zinc-900 bg-zinc-950 p-6 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Node Settings</h3>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">
            {node.data.type === "startNode" ? "manual trigger" : node.data.type}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto pr-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">Label</label>
          <input
            type="text"
            value={node.data.label}
            onChange={(e) => handleChange("label", e.target.value)}
            className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
          />
        </div>

        {node.data.type === "http" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">
                Method
              </label>
              <select
                value={node.data.method || "GET"}
                onChange={(e) => handleChange("method", e.target.value)}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">URL</label>
              <input
                type="text"
                placeholder="https://api.example.com"
                value={node.data.url || ""}
                onChange={(e) => handleChange("url", e.target.value)}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {node.data.type === "discord" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">
                Webhook URL
              </label>
              <input
                type="text"
                placeholder="https://discord.com/api/webhooks/..."
                value={node.data.webhookUrl || ""}
                onChange={(e) => handleChange("webhookUrl", e.target.value)}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">
                Message Content
              </label>
              <textarea
                rows={3}
                value={node.data.content || ""}
                onChange={(e) => handleChange("content", e.target.value)}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400">
                  Bot Name
                </label>
                <input
                  type="text"
                  value={node.data.username || ""}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400">
                  Avatar URL
                </label>
                <input
                  type="text"
                  value={node.data.avatarUrl || ""}
                  onChange={(e) => handleChange("avatarUrl", e.target.value)}
                  className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {node.data.type === "notion" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">
                API Key
              </label>
              <input
                type="password"
                value={node.data.apiKey || ""}
                onChange={(e) => handleChange("apiKey", e.target.value)}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">
                Database ID
              </label>
              <input
                type="text"
                value={node.data.databaseId || ""}
                onChange={(e) => handleChange("databaseId", e.target.value)}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">
                Page Title
              </label>
              <input
                type="text"
                value={node.data.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">
                Content
              </label>
              <textarea
                rows={3}
                value={node.data.content || ""}
                onChange={(e) => handleChange("content", e.target.value)}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {node.data.type === "openai" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">
                API Key
              </label>
              <input
                type="password"
                value={node.data.apiKey || ""}
                onChange={(e) => handleChange("apiKey", e.target.value)}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">
                Model
              </label>
              <select
                value={node.data.model || "gpt-4o"}
                onChange={(e) => handleChange("model", e.target.value)}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
              >
                <option>gpt-4o</option>
                <option>gpt-4-turbo</option>
                <option>gpt-3.5-turbo</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">
                Prompt
              </label>
              <textarea
                rows={4}
                value={node.data.prompt || ""}
                onChange={(e) => handleChange("prompt", e.target.value)}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {node.data.type === "telegram" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">
                Bot Token
              </label>
              <input
                type="password"
                value={node.data.botToken || ""}
                onChange={(e) => handleChange("botToken", e.target.value)}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">
                Chat ID
              </label>
              <input
                type="text"
                value={node.data.chatId || ""}
                onChange={(e) => handleChange("chatId", e.target.value)}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">
                Message Text
              </label>
              <textarea
                rows={3}
                value={node.data.text || ""}
                onChange={(e) => handleChange("text", e.target.value)}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {node.data.type === "cron" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">
                Schedule (Cron Expression)
              </label>
              <input
                type="text"
                placeholder="* * * * *"
                value={node.data.schedule || ""}
                onChange={(e) => handleChange("schedule", e.target.value)}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
              />
              <p className="text-[10px] text-zinc-600 leading-relaxed italic">
                Example: <code className="text-zinc-500">0 * * * *</code> (Every
                hour)
              </p>
            </div>
          </div>
        )}

        {node.data.type === "condition" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">
                Operator
              </label>
              <select
                value={node.data.operator || "=="}
                onChange={(e) => handleChange("operator", e.target.value)}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
              >
                <option value="==">Equals (==)</option>
                <option value="!=">Not Equals (!=)</option>
                <option value=">">Greater Than (&gt;)</option>
                <option value="<">Less Than (&lt;)</option>
                <option value="contains">Contains</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">
                Value 1
              </label>
              <input
                type="text"
                value={node.data.value1 || ""}
                onChange={(e) => handleChange("value1", e.target.value)}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">
                Value 2
              </label>
              <input
                type="text"
                value={node.data.value2 || ""}
                onChange={(e) => handleChange("value2", e.target.value)}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {node.data.type === "log" && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Logging some data..."
              value={node.data.message || ""}
              onChange={(e) => handleChange("message", e.target.value)}
              className="w-full rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none transition-colors"
            />
          </div>
        )}

        <div className="rounded-lg border border-zinc-900 bg-zinc-900/30 p-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <div className="flex items-center gap-2">
              <Info className="h-3 w-3" />
              Variable Mapping
            </div>
            <button
              onClick={copyId}
              className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 transition-colors bg-violet-500/5 px-2 py-0.5 rounded border border-violet-500/20"
            >
              {copied ? (
                <Check className="h-2 w-2" />
              ) : (
                <Copy className="h-2 w-2" />
              )}
              {copied ? "Copied!" : "Copy {{ID}}"}
            </button>
          </div>
          <p className="text-[10px] text-zinc-600 leading-relaxed">
            Use the button above to copy this node&apos;s variable path. Paste
            it into any field (like Discord message) to use this node&apos;s
            output.
          </p>
          <div className="mt-3 p-2 rounded bg-black/40 border border-zinc-800 font-mono text-[9px] text-zinc-500 truncate">
            ID: {node.id}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 pt-6 border-t border-zinc-900">
        <button
          onClick={() => onDelete(node.id)}
          className="flex items-center justify-center gap-2 rounded-lg border border-red-900/50 bg-red-950/10 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-900/20 transition-all"
        >
          <Trash2 className="h-4 w-4" />
          Delete Node
        </button>
      </div>
    </div>
  );
}
