"use client";

import { TOPUP_TYPES } from "@/lib/types";

const OPTIONS = [["all", "All Types"], ...Object.entries(TOPUP_TYPES)];

export default function FilterTabs({ value, onChange }) {
  return (
    <div role="tablist" aria-label="รูปแบบการเติม" className="flex flex-wrap gap-2">
      {OPTIONS.map(([key, label]) => {
        const active = value === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(key)}
            className={
              "rounded-full border px-4 py-1.5 text-sm transition " +
              (active
                ? "border-neon-purple bg-neon-purple/20 text-white glow-purple"
                : "border-line text-muted hover:border-neon-purple/60 hover:text-white")
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
