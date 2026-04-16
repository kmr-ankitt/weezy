"use client";

import React, { useState, useEffect } from "react";
import { gqlRequest } from "@/lib/api";
import {
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
  ChevronDown,
  Terminal,
  Database,
  Code,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GET_EXECUTION_DETAILS = `
  query GetExecution($id: String!) {
    executionById(id: $id) {
      success
      error
      execution {
        id
        status
        result
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

interface ExecutionNode {
  id: string;
  nodeId: string;
  status: string;
  input: unknown;
  output: unknown;
  error?: string;
  createdAt: string;
}

interface ExecutionData {
  id: string;
  status: string;
  result: unknown;
  executionNodes: ExecutionNode[];
}

interface GqlExecutionResponse {
  executionById: {
    success: boolean;
    error?: string;
    execution: ExecutionData;
  };
}

export function ExecutionPanel({
  executionId,
  onClose,
}: {
  executionId: string | null;
  onClose: () => void;
}) {
  const [execution, setExecution] = useState<ExecutionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    if (!executionId) return;

    let pollInterval: NodeJS.Timeout | undefined = undefined;

    const fetchDetails = async () => {
      try {
        const res = await gqlRequest<GqlExecutionResponse>(
          GET_EXECUTION_DETAILS,
          { id: executionId },
        );
        if (res.executionById.success) {
          const data = res.executionById.execution;
          setExecution(data);

          // Stop polling if finished
          if (data.status === "success" || data.status === "failed") {
            clearInterval(pollInterval);
          }
        }
      } catch (err) {
        console.error("Failed to poll execution details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
    pollInterval = setInterval(fetchDetails, 2000);

    return () => clearInterval(pollInterval);
  }, [executionId]);

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!executionId) return null;

  const statusColors = {
    pending: "text-zinc-500 bg-zinc-500/10 border-zinc-500/20",
    running: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    success: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    failed: "text-red-500 bg-red-500/10 border-red-500/20",
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 right-0 w-[400px] border-l border-zinc-900 bg-zinc-950/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5 text-violet-500" />
          <h2 className="font-bold text-white tracking-tight">
            Execution Result
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {isLoading && !execution ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3 text-zinc-500">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm">Initializing...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Header */}
            <div
              className={`p-4 rounded-xl border ${statusColors[execution?.status as keyof typeof statusColors] || statusColors.pending}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                  Output Status
                </span>
                {execution?.status === "running" && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
              </div>
              <div className="text-2xl font-bold flex items-center gap-2">
                {execution?.status === "success" && (
                  <CheckCircle2 className="h-6 w-6" />
                )}
                {execution?.status === "failed" && (
                  <XCircle className="h-6 w-6" />
                )}
                {execution?.status?.charAt(0).toUpperCase() +
                  execution?.status?.slice(1)}
              </div>
            </div>

            {/* Nodes List */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">
                Executed Steps
              </h3>
              {execution?.executionNodes?.length === 0 && (
                <div className="text-xs text-zinc-600 italic px-1">
                  Waiting for steps to record...
                </div>
              )}
              {execution?.executionNodes?.map((node: ExecutionNode) => (
                <div
                  key={node.id}
                  className="rounded-xl border border-zinc-900 bg-zinc-900/30 overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpand(node.id)}
                    className="w-full flex items-center justify-between p-3 hover:bg-zinc-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {node.status === "success" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-xs font-semibold text-zinc-300">
                        Node: {node.nodeId}
                      </span>
                    </div>
                    {expandedNodes[node.id] ? (
                      <ChevronDown className="h-4 w-4 text-zinc-600" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-zinc-600" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedNodes[node.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-zinc-900 overflow-hidden"
                      >
                        <div className="p-3 space-y-3 text-[11px]">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-zinc-500">
                              <Database className="h-3 w-3" />
                              Input
                            </div>
                            <pre className="p-2 rounded bg-black/50 text-zinc-400 overflow-x-auto">
                              {JSON.stringify(node.input, null, 2)}
                            </pre>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-zinc-500">
                              <Code className="h-3 w-3" />
                              Output
                            </div>
                            <pre className="p-2 rounded bg-emerald-500/5 text-emerald-500/80 border border-emerald-500/10 overflow-x-auto">
                              {JSON.stringify(node.output, null, 2)}
                            </pre>
                          </div>
                          {node.error && (
                            <div className="space-y-1">
                              <div className="text-red-400 font-bold">
                                Error
                              </div>
                              <div className="p-2 rounded bg-red-500/5 text-red-400 border border-red-500/10">
                                {node.error}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
