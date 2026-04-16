"use client";

import { use, useEffect, useState } from "react";
import { gqlRequest } from "@/lib/api";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ChevronRight,
  ChevronDown,
  Database,
  Code,
  ArrowLeft,
  Calendar,
  Workflow as WorkflowIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";

const GET_EXECUTION_BY_ID = `
  query GetExecution($id: String!) {
    executionById(id: $id) {
      success
      error
      execution {
        id
        status
        startedAt
        endedAt
        result
        workflowId
        executionNodes {
          id
          nodeId
          status
          input
          output
          error
          createdAt
        }
      }
    }
  }
`;

interface DetailedExecutionNode {
  id: string;
  nodeId: string;
  status: string;
  input: unknown;
  output: unknown;
  error?: string;
  createdAt: string;
}

interface DetailedExecution {
  id: string;
  status: string;
  startedAt?: string;
  endedAt?: string;
  result: unknown;
  workflowId: string;
  executionNodes: DetailedExecutionNode[];
}

interface GqlDetailResponse {
  executionById: {
    success: boolean;
    error?: string;
    execution: DetailedExecution;
  };
}

export default function ExecutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [execution, setExecution] = useState<DetailedExecution | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await gqlRequest<GqlDetailResponse>(GET_EXECUTION_BY_ID, {
          id,
        });
        if (res.executionById.success) {
          setExecution(res.executionById.execution);
        }
      } catch (err) {
        console.error("Failed to fetch execution details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!execution) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-black gap-4">
        <XCircle className="h-10 w-10 text-red-500" />
        <p className="text-zinc-500">Execution not found or deleted.</p>
        <Link
          href="/dashboard/executions"
          className="text-violet-500 hover:underline"
        >
          Back to History
        </Link>
      </div>
    );
  }

  const statusColors = {
    pending: "text-zinc-500 bg-zinc-500/10 border-zinc-500/20",
    running: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    success: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    failed: "text-red-500 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard/executions"
            className="p-2 rounded-lg hover:bg-zinc-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-zinc-400" />
          </Link>
          <div className="h-8 w-px bg-zinc-900" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">Run Details</h1>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full border ${statusColors[execution.status as keyof typeof statusColors]}`}
              >
                {execution.status}
              </span>
            </div>
            <p className="text-zinc-500 text-xs mt-1 font-mono">
              ID: {execution.id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900">
            <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
              <Calendar className="h-3 w-3" /> Started At
            </div>
            <div className="text-sm font-medium">
              {execution.startedAt
                ? format(new Date(execution.startedAt), "PPP p")
                : "N/A"}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900">
            <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
              <Clock className="h-3 w-3" /> Duration
            </div>
            <div className="text-sm font-medium">
              {execution.endedAt && execution.startedAt
                ? `${((new Date(execution.endedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000).toFixed(2)}s`
                : "In progress..."}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-900">
            <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
              <WorkflowIcon className="h-3 w-3" /> Actions
            </div>
            <Link
              href={`/builder/${execution.workflowId}`}
              className="text-xs text-violet-500 hover:text-violet-400 font-bold transition-colors"
            >
              Open in Builder →
            </Link>
          </div>
        </div>

        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 px-1">
          Navigation Trace
        </h3>
        <div className="space-y-4">
          {execution.executionNodes?.length === 0 && (
            <div className="text-center py-20 bg-zinc-900/10 border border-dashed border-zinc-900 rounded-3xl text-zinc-600 italic">
              No node-level tracing available for this run.
            </div>
          )}
          {execution.executionNodes?.map(
            (node: DetailedExecutionNode, idx: number) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={node.id}
                className="rounded-3xl border border-zinc-900 bg-zinc-950 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleExpand(node.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-zinc-900/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-xl ${node.status === "success" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
                    >
                      {node.status === "success" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-bold text-white block">
                        Step: {node.nodeId}
                      </span>
                      <span className="text-[10px] text-zinc-600 uppercase tracking-tighter">
                        {node.status} • {format(new Date(node.createdAt), "p")}
                      </span>
                    </div>
                  </div>
                  {expandedNodes[node.id] ? (
                    <ChevronDown className="h-5 w-5 text-zinc-700" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-zinc-700" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedNodes[node.id] && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="border-t border-zinc-900 overflow-hidden"
                    >
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/40">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            <Database className="h-3 w-3 text-violet-500" />
                            Input Payload
                          </div>
                          <pre className="p-4 rounded-2xl bg-zinc-900/50 text-zinc-400 text-[11px] overflow-x-auto border border-zinc-900 custom-scrollbar">
                            {JSON.stringify(node.input, null, 2)}
                          </pre>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            <Code className="h-3 w-3 text-emerald-500" />
                            Output Result
                          </div>
                          <pre className="p-4 rounded-2xl bg-zinc-900/50 text-zinc-300 text-[11px] overflow-x-auto border border-zinc-900 custom-scrollbar">
                            {JSON.stringify(node.output, null, 2)}
                          </pre>
                        </div>
                        {node.error && (
                          <div className="col-span-1 md:col-span-2 space-y-2">
                            <div className="text-red-500 text-[10px] font-bold uppercase tracking-widest">
                              Execution Error
                            </div>
                            <div className="p-4 rounded-2xl bg-red-500/5 text-red-400 text-xs border border-red-500/10 font-mono">
                              {node.error}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
