"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Play, Activity, Check, Server } from "lucide-react";

const nodes = [
  {
    id: "trigger",
    label: "Trigger",
    icon: Play,
    x: 50,
    y: 150,
    color: "bg-emerald-500",
  },
  {
    id: "node1",
    label: "Worker A",
    icon: Server,
    x: 250,
    y: 75,
    color: "bg-blue-500",
  },
  {
    id: "node2",
    label: "Worker B",
    icon: Server,
    x: 250,
    y: 225,
    color: "bg-blue-500",
  },
  {
    id: "process",
    label: "Aggregate",
    icon: Activity,
    x: 450,
    y: 150,
    color: "bg-amber-500",
  },
  {
    id: "success",
    label: "Success",
    icon: Check,
    x: 650,
    y: 150,
    color: "bg-violet-500",
  },
];

const connections = [
  { from: "trigger", to: "node1" },
  { from: "trigger", to: "node2" },
  { from: "node1", to: "process" },
  { from: "node2", to: "process" },
  { from: "process", to: "success" },
];

export function WorkflowGraph() {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-8 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 750 300">
        <defs>
          <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.5)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {connections.map((conn, i) => {
          const fromNode = nodes.find((n) => n.id === conn.from)!;
          const toNode = nodes.find((n) => n.id === conn.to)!;

          // Using cubic bezier for smoother curved lines
          const midX = (fromNode.x + toNode.x) / 2;
          const path = `M ${fromNode.x} ${fromNode.y} C ${midX} ${fromNode.y}, ${midX} ${toNode.y}, ${toNode.x} ${toNode.y}`;

          return (
            <g key={i}>
              {/* Background Path */}
              <motion.path
                d={path}
                stroke="#18181b"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
              />

              {/* Flowing Particle */}
              <motion.path
                d={path}
                stroke="url(#line-grad)"
                strokeWidth="3"
                fill="none"
                initial={{ pathOffset: 0, pathLength: 0.2, opacity: 0 }}
                animate={{
                  pathOffset: [0, 1],
                  pathLength: 0.2,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.5 + 1,
                  ease: "linear",
                }}
              />
            </g>
          );
        })}
      </svg>

      {nodes.map((node, i) => {
        const Icon = node.icon;
        return (
          <motion.div
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: i * 0.2,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            style={{
              left: `${(node.x / 750) * 100}%`,
              top: `${(node.y / 300) * 100}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <div className="group relative flex flex-col items-center">
              {/* Glow effect on hover */}
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:border-white/20",
                  node.color,
                  "bg-opacity-10 backdrop-blur-xl",
                )}
              >
                <Icon className="h-7 w-7 text-white" />
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl animate-pulse -z-10",
                    node.color,
                    "opacity-10",
                  )}
                />
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity",
                    node.color,
                  )}
                />
              </div>
              <span className="mt-3 whitespace-nowrap text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                {node.label}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
