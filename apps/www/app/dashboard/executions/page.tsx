"use client";

import useSWR from "swr";
import { gqlRequest } from "@/lib/api";
import {
  History,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  ArrowLeft,
  Loader2,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

// Query to fetch workflows with their nested executions
const GET_RECENT_EXECUTIONS = `
  query GetRecentExecutions {
    workflow {
      id
      name
      executions {
        id
        status
        startedAt
        endedAt
      }
    }
  }
`;

interface HistoryExecution {
  id: string;
  status: string;
  startedAt: string;
  endedAt?: string;
}

interface WorkflowWithExecutions {
  id: string;
  name: string;
  executions: HistoryExecution[];
}

interface HistoryFlattened extends HistoryExecution {
  workflowName: string;
}

export default function ExecutionsHistoryPage() {
  const { data, isLoading } = useSWR("all-executions", () =>
    gqlRequest<{ workflow: WorkflowWithExecutions[] }>(GET_RECENT_EXECUTIONS),
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  // Flatten the executions from all workflows
  const allExecutions: HistoryFlattened[] =
    data?.workflow
      ?.flatMap((wf: WorkflowWithExecutions) =>
        wf.executions.map((ex: HistoryExecution) => ({
          ...ex,
          workflowName: wf.name,
        })),
      )
      .sort(
        (a: HistoryFlattened, b: HistoryFlattened) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
      ) || [];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg hover:bg-zinc-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-zinc-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Execution History
              </h1>
              <p className="text-zinc-500 text-sm">
                Review all past workflow runs and their results.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-900 px-4 py-2 rounded-xl">
            <Activity className="h-4 w-4 text-violet-500" />
            <span className="text-sm font-medium">
              {allExecutions.length} Total Runs
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {allExecutions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-900 rounded-2xl">
              <History className="h-12 w-12 text-zinc-800 mb-4" />
              <p className="text-zinc-500">No executions found yet.</p>
            </div>
          ) : (
            allExecutions.map((ex: HistoryFlattened, idx: number) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={ex.id}
              >
                <Link
                  href={`/dashboard/executions/${ex.id}`}
                  className="flex items-center justify-between p-4 rounded-2xl border border-zinc-900 bg-zinc-950 hover:bg-zinc-900/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        ex.status === "success"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : ex.status === "failed"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-violet-500/10 text-violet-500"
                      }`}
                    >
                      {ex.status === "success" && (
                        <CheckCircle2 className="h-5 w-5" />
                      )}
                      {ex.status === "failed" && (
                        <XCircle className="h-5 w-5" />
                      )}
                      {(ex.status === "running" || ex.status === "pending") && (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-200 group-hover:text-white transition-colors">
                        {ex.workflowName}
                      </h3>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                          {ex.id.split("-")[0]}...
                        </span>
                        <span className="text-[10px] text-zinc-600">•</span>
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {ex.startedAt
                            ? formatDistanceToNow(new Date(ex.startedAt), {
                                addSuffix: true,
                              })
                            : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <div
                        className={`text-xs font-bold uppercase tracking-widest ${
                          ex.status === "success"
                            ? "text-emerald-500"
                            : ex.status === "failed"
                              ? "text-red-500"
                              : "text-violet-500"
                        }`}
                      >
                        {ex.status}
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">
                        {ex.endedAt && ex.startedAt
                          ? `${Math.round((new Date(ex.endedAt).getTime() - new Date(ex.startedAt).getTime()) / 1000)}s`
                          : "--"}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-zinc-700 group-hover:text-violet-500 transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
