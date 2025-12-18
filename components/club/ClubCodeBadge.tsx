"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, RefreshCw } from "lucide-react";
import { copyToClipboard } from "@/lib/utils/club";

interface ClubCodeBadgeProps {
  code: string;
  showLabel?: boolean;
  showHint?: boolean;
  onRegenerate?: () => void;
}

export function ClubCodeBadge({
  code,
  showLabel = true,
  showHint = false,
  onRegenerate,
}: ClubCodeBadgeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 flex items-center gap-3">
        {showLabel && (
          <span className="text-slate-500 text-sm">Club Code:</span>
        )}
        <code className="text-cyan-400 font-mono font-bold">{code}</code>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-slate-400 hover:text-white transition"
            aria-label={copied ? "Copied!" : "Copy club code"}
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </motion.button>

          {onRegenerate && (
            <>
              <div className="w-px h-4 bg-slate-600" />
              <motion.button
                onClick={onRegenerate}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9, rotate: 180 }}
                className="text-slate-400 hover:text-cyan-400 transition"
                aria-label="Regenerate club code"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </div>
      </div>

      {showHint && (
        <span className="text-slate-500 text-xs">
          Share this code to invite members
        </span>
      )}
    </div>
  );
}
