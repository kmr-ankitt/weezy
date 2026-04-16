import Link from "next/link";
import { marketingConfig } from "@/config/marketing";
import { GitBranch } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-black pb-12 pt-16 text-zinc-500">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">
              {marketingConfig.name}
            </span>
            <span className="text-xs">© {new Date().getFullYear()}</span>
          </div>

          <Link
            href={marketingConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <GitBranch className="h-4 w-4" />
            GitHub
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Documentation
          </Link>
        </div>
      </div>
    </footer>
  );
}
