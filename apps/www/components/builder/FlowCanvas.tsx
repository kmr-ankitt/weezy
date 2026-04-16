"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  Edge,
  Node,
  applyEdgeChanges,
  applyNodeChanges,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Panel,
  BackgroundVariant,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { nanoid } from "nanoid";
import {
  Database,
  Activity,
  Play,
  List,
  Zap,
  MessageSquare,
  Sparkles,
  Send,
  ScrollText,
  Clock,
} from "lucide-react";
import { NodeProperties } from "./NodeProperties";
import { LucideProps } from "lucide-react";

export interface WeezyNodeData extends Record<string, unknown> {
  label: string;
  type: string;
  color?: string;
}

// Icon mapping to handle serialized data
const ICON_MAP: Record<string, React.ElementType<LucideProps>> = {
  startNode: Play,
  cron: Clock,
  http: Database,
  log: List,
  condition: Zap,
  discord: MessageSquare,
  notion: ScrollText,
  openai: Sparkles,
  telegram: Send,
};

// Custom Node Component
const WeezyNode = ({
  data,
  selected,
}: {
  data: WeezyNodeData;
  selected: boolean;
}) => {
  const Icon = (ICON_MAP[data.type] || Activity) as React.ElementType;

  return (
    <div
      className={`
      relative min-w-[200px] rounded-xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl transition-all
      ${selected ? "border-violet-500 ring-2 ring-violet-500/20 shadow-violet-500/20" : "hover:border-zinc-700"}
    `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-zinc-950 bg-zinc-800"
      />
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${(data.color as string) || "bg-zinc-900 border-zinc-800"} border shadow-inner`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="truncate text-sm font-bold text-white leading-tight">
            {data.label}
          </div>
          <div className="truncate text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-0.5 opacity-60">
            {data.type}
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-zinc-950 bg-zinc-800"
      />
    </div>
  );
};

const nodeTypes = {
  weezy: WeezyNode,
};

export function FlowCanvas({
  nodes,
  edges,
  setNodes,
  setEdges,
}: {
  workflowId: string;
  nodes: Node<WeezyNodeData>[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node<WeezyNodeData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId],
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  };

  const onPaneClick = () => {
    setSelectedNodeId(null);
  };

  const updateNode = (id: string, data: Record<string, unknown>) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: data as WeezyNodeData } : n)),
    );
  };

  const deleteNode = (id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setSelectedNodeId(null);
  };

  const addNode = (
    type: string,
    label: string,
    icon: React.ElementType,
    color: string,
  ) => {
    const newNode: Node<WeezyNodeData> = {
      id: nanoid(),
      type: "weezy",
      position: { x: 400, y: 200 },
      data: { label, type, color },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div className="flex h-full w-full bg-black">
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          colorMode="dark"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="#18181b"
          />
          <Controls />

          <Panel position="top-right" className="flex flex-col gap-2">
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/80 p-3 backdrop-blur-md shadow-2xl w-48">
              <div className="mb-3 px-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Triggers
              </div>
              <div className="flex flex-col gap-1 mb-4">
                <button
                  onClick={() =>
                    addNode(
                      "startNode",
                      "Manual Start",
                      Play,
                      "bg-emerald-500/10 border-emerald-500/50 text-emerald-500",
                    )
                  }
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  <Play className="h-3.5 w-3.5" />
                  Manual Start
                </button>
                <button
                  onClick={() =>
                    addNode(
                      "cron",
                      "Cron Schedule",
                      Clock,
                      "bg-emerald-500/10 border-emerald-500/50 text-emerald-500",
                    )
                  }
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  <Clock className="h-3.5 w-3.5" />
                  Cron Trigger
                </button>
              </div>

              <div className="mb-3 px-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Core Nodes
              </div>
              <div className="flex flex-col gap-1 mb-4">
                <button
                  onClick={() =>
                    addNode(
                      "http",
                      "HTTP Request",
                      Database,
                      "bg-blue-500/10 border-blue-500/50 text-blue-500",
                    )
                  }
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  <Database className="h-3.5 w-3.5" />
                  HTTP Request
                </button>
                <button
                  onClick={() =>
                    addNode(
                      "log",
                      "Log Message",
                      List,
                      "bg-amber-500/10 border-amber-500/50 text-amber-500",
                    )
                  }
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  <List className="h-3.5 w-3.5" />
                  Log step
                </button>
                <button
                  onClick={() =>
                    addNode(
                      "condition",
                      "Conditional",
                      Zap,
                      "bg-violet-500/10 border-violet-500/50 text-violet-500",
                    )
                  }
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Condition
                </button>
              </div>

              <div className="mb-3 px-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Integrations
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() =>
                    addNode(
                      "discord",
                      "Discord Webhook",
                      MessageSquare,
                      "bg-indigo-500/10 border-indigo-500/50 text-indigo-500",
                    )
                  }
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Discord
                </button>
                <button
                  onClick={() =>
                    addNode(
                      "notion",
                      "Notion Page",
                      ScrollText,
                      "bg-zinc-100/10 border-zinc-100/30 text-zinc-100",
                    )
                  }
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  <ScrollText className="h-3.5 w-3.5" />
                  Notion
                </button>
                <button
                  onClick={() =>
                    addNode(
                      "openai",
                      "OpenAI ChatGPT",
                      Sparkles,
                      "bg-emerald-500/10 border-emerald-500/50 text-emerald-500",
                    )
                  }
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  OpenAI
                </button>
                <button
                  onClick={() =>
                    addNode(
                      "telegram",
                      "Telegram Bot",
                      Send,
                      "bg-sky-500/10 border-sky-500/50 text-sky-500",
                    )
                  }
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  Telegram
                </button>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {selectedNode && (
        <div className="w-[350px]">
          <NodeProperties
            node={selectedNode}
            onClose={() => setSelectedNodeId(null)}
            onUpdate={updateNode}
            onDelete={deleteNode}
          />
        </div>
      )}
    </div>
  );
}
