"use client";

import { motion } from "framer-motion";
import { marketingConfig } from "@/config/marketing";
import { ArrowRight, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { WorkflowGraph } from "./WorkflowGraph";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black pt-20">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/20 blur-[120px]" />
      <div className="absolute top-1/2 left-1/4 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[100px]" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/50 px-3 py-1 text-xs font-medium text-zinc-400 backdrop-blur-sm sm:text-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
          Introducing Weezy Engine v0.1.0
          <ChevronRight className="h-3 w-3" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl lg:text-8xl"
        >
          Workflows. <br />
          <span className="text-violet-500">Distributed.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl"
        >
          {marketingConfig.description} Automate complex processes across your
          infrastructure with ease.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/dashboard"
            className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 font-semibold text-black transition-all hover:bg-zinc-200"
          >
            Start Building
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href={marketingConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="group flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/50 px-8 font-semibold text-white transition-all hover:bg-zinc-900"
          >
            <Star className="h-4 w-4 fill-violet-500 text-violet-500" />
            Star on GitHub
          </Link>
        </motion.div>
      </div>

      {/* Decorative workflow visual centerpiece */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-20 w-full max-w-5xl px-4"
      >
        <div className="relative aspect-[21/9] w-full rounded-3xl border border-zinc-800 bg-zinc-950/50 p-1 shadow-2xl backdrop-blur-3xl overflow-hidden">
          {/* Accent border glow */}
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          <div className="h-full w-full rounded-[20px] bg-black/60 relative overflow-hidden">
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-zinc-800/50 bg-zinc-900/30 px-6 py-3">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5 font-mono text-[10px] text-zinc-500 uppercase tracking-tighter">
                  <span className="text-violet-500">Distributed</span>
                  <span className="text-zinc-700">|</span>
                  <span className="text-emerald-500">Engine Visualizer</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  Active Cluster
                </span>
              </div>
            </div>

            {/* The Graph */}
            <div className="h-full pb-12">
              <WorkflowGraph />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
