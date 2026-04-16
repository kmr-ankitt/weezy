"use client";

import { marketingConfig } from "@/config/marketing";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

export function Features() {
  return (
    <section className="bg-black py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to automate
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            A powerful suite of tools designed for modern infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {marketingConfig.features.map((feature, index) => {
            const IconComponent =
              (Icons as unknown as Record<string, React.ElementType>)[
                feature.icon
              ] || Icons.HelpCircle;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                id={`feature-${index}`}
                className="group relative flex flex-col items-start rounded-2xl border border-zinc-800 bg-zinc-950 p-8 transition-all hover:bg-zinc-900"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500 group-hover:bg-violet-500 group-hover:text-white transition-colors">
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-zinc-400">{feature.description}</p>
                <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-violet-600/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
