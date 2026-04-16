"use client";

import useSWR from "swr";
import { gqlRequest } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Plus,
  Play,
  Settings,
  Search,
  Activity,
  ChevronRight,
  History,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

const GET_WORKFLOWS_QUERY = `
  query GetWorkflows {
    workflow {
      id
      name
      definition
      createdAt
      updatedAt
    }
  }
`;

interface WorkflowOverview {
  id: string;
  name: string;
  definition: unknown;
  createdAt: string;
  updatedAt: string;
  active?: boolean;
  lastRun?: string;
}

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR("get-workflows", () =>
    gqlRequest<{ workflow: WorkflowOverview[] }>(GET_WORKFLOWS_QUERY),
  );
  const workflows = data?.workflow;
  const [search, setSearch] = useState("");

  const filteredWorkflows = workflows?.filter((wf: WorkflowOverview) =>
    wf.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar / Navigation Mockup */}
      <div className="fixed left-0 top-0 h-full w-64 border-r border-zinc-900 bg-zinc-950/50 p-6">
        <div className="mb-10 text-xl font-bold tracking-tight">Weezy</div>
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg bg-zinc-900 px-3 py-2 text-white"
          >
            <Activity className="h-4 w-4 text-violet-500" />
            Workflows
          </Link>
          <Link
            href="/dashboard/executions"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <History className="h-4 w-4" />
            History
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </div>

      <main className="ml-64 p-10">
        <div className="mx-auto max-w-5xl">
          <header className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
              <p className="mt-1 text-zinc-400">
                Manage and monitor your automated processes.
              </p>
            </div>
            <Link
              href="/builder/new"
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              New Workflow
            </Link>
          </header>

          {/* Search bar */}
          <div className="mb-8 relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-900 bg-zinc-950 py-2 pl-10 pr-4 text-sm focus:border-violet-500 focus:outline-none transition-colors"
            />
          </div>

          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-xl border border-zinc-900 bg-zinc-950"
                />
              ))}
            </div>
          ) : error ? (
            <div className="flex h-40 items-center justify-center rounded-xl border border-red-900/50 bg-red-950/10 text-red-400">
              Failed to load workflows. Make sure the API is running.
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredWorkflows?.map((workflow: WorkflowOverview) => (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group flex items-center justify-between rounded-xl border border-zinc-900 bg-zinc-950 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900/50 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg border",
                        workflow.active
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-500"
                          : "border-zinc-800 bg-zinc-900 text-zinc-400",
                      )}
                    >
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <Link
                        href={`/builder/${workflow.id}`}
                        className="font-semibold hover:text-violet-400 transition-colors"
                      >
                        {workflow.name || "Untitled Workflow"}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                        <span>
                          Last run:{" "}
                          {workflow.lastRun
                            ? new Date(workflow.lastRun).toLocaleDateString()
                            : "Never"}
                        </span>
                        <span>•</span>
                        <span
                          className={
                            workflow.active
                              ? "text-emerald-500"
                              : "text-zinc-500"
                          }
                        >
                          {workflow.active ? "Active" : "Paused"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition-colors">
                      <Play className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/builder/${workflow.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}

              {filteredWorkflows?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-900 rounded-2xl">
                  <Activity className="h-10 w-10 text-zinc-700 mb-4" />
                  <h3 className="font-semibold text-zinc-300">
                    No workflows found
                  </h3>
                  <p className="text-sm text-zinc-500 mt-1">
                    Start by creating your first automation.
                  </p>
                  <Link
                    href="/builder/new"
                    className="mt-6 text-sm font-medium text-violet-500 hover:text-violet-400"
                  >
                    Create my first workflow →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
