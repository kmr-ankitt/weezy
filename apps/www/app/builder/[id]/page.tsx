"use client";

import { use, useEffect, useState } from "react";
import { FlowCanvas } from "@/components/builder/FlowCanvas";
import { ExecutionPanel } from "@/components/builder/ExecutionPanel";
import {
  ChevronLeft,
  Play,
  Save,
  Share2,
  Loader2,
  CheckCircle2,
  Check,
} from "lucide-react";
import Link from "next/link";
import { Node, Edge } from "@xyflow/react";
import { postData, gqlRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

const GET_WORKFLOW_BY_ID = `
  query GetWorkflow($id: String!) {
    workflowById(id: $id) {
      success
      error
      workflow {
        id
        name
        definition
      }
    }
  }
`;

const CREATE_WORKFLOW = `
  mutation CreateWorkflow($input: CreateWorkflowInput!) {
    createWorkflow(input: $input) {
      success
      id
      error
    }
  }
`;

const UPDATE_WORKFLOW = `
  mutation UpdateWorkflow($input: UpdateWorkflowInput!) {
    updateWorkflow(input: $input) {
      success
      id
      error
    }
  }
`;

interface GqlPayload<T> {
  [key: string]: {
    success: boolean;
    error?: string;
    id?: string;
    workflow?: T;
  };
}

interface WorkflowData {
  id: string;
  name: string;
  definition: unknown;
}

export default function BuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [nodes, setNodes] = useState<Node[]>(
    id === "new"
      ? [
          {
            id: "start",
            type: "weezy",
            position: { x: 100, y: 150 },
            data: {
              label: "Manual Start",
              type: "startNode",
              icon: Play,
              color: "bg-emerald-500/10 border-emerald-500/50 text-emerald-500",
            },
          },
        ]
      : [],
  );
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(id !== "new");
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [isShared, setIsShared] = useState(false);
  const [activeExecutionId, setActiveExecutionId] = useState<string | null>(
    null,
  );
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (id !== "new") {
      const loadWorkflow = async () => {
        try {
          const res = await gqlRequest<GqlPayload<WorkflowData>>(
            GET_WORKFLOW_BY_ID,
            { id },
          );

          if (!res.workflowById.success || !res.workflowById.workflow) {
            console.error("Workflow not found:", res.workflowById.error);
            return;
          }

          const workflow = res.workflowById.workflow;
          setWorkflowName(workflow.name);

          if (workflow.definition) {
            // Restore visual layout from stored metadata if present
            setNodes(workflow.definition.visual?.nodes || []);
            setEdges(workflow.definition.visual?.edges || []);
          }
        } catch (err) {
          console.error("Failed to load workflow:", err);
        } finally {
          setIsLoading(false);
        }
      };
      loadWorkflow();
    }
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Serialize visual layout and engine-compatible definition
      const definition = {
        nodes: nodes.map((n) => ({
          id: n.id,
          type: n.data.type,
          parameters: n.data,
        })),
        connections: edges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
        })),
        visual: { nodes, edges }, // Store layout data for the builder
      };

      const payload = { name: workflowName, definition };

      if (id === "new") {
        const res = await gqlRequest<GqlPayload<WorkflowData>>(
          CREATE_WORKFLOW,
          { input: payload },
        );
        if (res.createWorkflow.success) {
          router.push(`/builder/${res.createWorkflow.id}`);
        } else {
          throw new Error(res.createWorkflow.error);
        }
      } else {
        const res = await gqlRequest<GqlPayload<WorkflowData>>(
          UPDATE_WORKFLOW,
          {
            input: { id, ...payload },
          },
        );
        if (!res.updateWorkflow.success) {
          throw new Error(res.updateWorkflow.error);
        }
      }

      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save workflow:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  const handleExecute = async () => {
    if (id === "new") {
      alert("Please save the workflow before executing.");
      return;
    }
    try {
      const res = await postData<
        Record<string, never>,
        { workflowId: string; executionId: string }
      >(`/workflows/${id}/execute`, {});
      setActiveExecutionId(res.executionId);
    } catch (err) {
      console.error("Failed to execute workflow:", err);
    }
  };

  if (isLoading && nodes.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-black text-white">
      {/* Builder Header */}
      <header className="flex h-14 items-center justify-between border-b border-zinc-900 bg-zinc-950 px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-zinc-900 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="h-6 w-px bg-zinc-800" />
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent text-sm font-semibold tracking-tight text-white focus:outline-none focus:ring-1 focus:ring-violet-500 rounded px-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isShared
                ? "bg-violet-500/10 text-violet-400 border border-violet-500/50"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            {isShared ? (
              <Check className="h-4 w-4" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
            {isShared ? "Copied!" : "Share"}
          </button>
          <div className="h-6 w-px bg-zinc-800 mx-1" />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
              showSaved
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/50"
                : "bg-zinc-900 text-white hover:bg-zinc-800"
            } disabled:opacity-50`}
          >
            {showSaved ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? "Saving..." : showSaved ? "Saved!" : "Save"}
          </button>
          <button
            onClick={handleExecute}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-1.5 text-sm font-bold text-black transition-transform hover:scale-105"
          >
            <Play className="h-4 w-4 fill-black" />
            Execute
          </button>
        </div>
      </header>

      {/* Main Builder Canvas */}
      <div className="flex-1 overflow-hidden">
        <FlowCanvas
          workflowId={id}
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
        />
      </div>

      <ExecutionPanel
        executionId={activeExecutionId}
        onClose={() => setActiveExecutionId(null)}
      />
    </div>
  );
}
