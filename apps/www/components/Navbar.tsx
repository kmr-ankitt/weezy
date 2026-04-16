"use client";

import Link from "next/link";
import { marketingConfig } from "@/config/marketing";
import { GitBranch } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-white">
              {marketingConfig.name}
            </span>
          </Link>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          {/* Minimal navbar - links removed for simplicity as requested */}
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href={marketingConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            <GitBranch className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Link>
          <Link
            href="#"
            className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black transition-transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
