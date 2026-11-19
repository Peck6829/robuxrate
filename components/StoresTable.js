"use client";

import { useMemo } from "react";
import { TOPUP_TYPES } from "@/lib/types";

export default function StoresTable({ stores, loading, isAdmin, onEdit, onDelete, onReview }) {
  // เรทดีที่สุด (Robux ต่อ 1 บาท) ขึ้นก่อน
  const rows = useMemo(
    () =>
      stores
        .sort((a, b) => b.rate - a.rate),
    [stores]
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">ร้านค้า</th>
            <th className="px-4 py-3">รูปแบบ</th>
            <th className="px-4 py-3 text-right">เรท (R$/฿)</th>
            <th className="px-4 py-3 text-right">฿ ต่อ 100 R$</th>
            <th className="px-4 py-3">รีวิว</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-muted">กำลังโหลด...</td>
            </tr>
          )}
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-muted">ไม่พบร้านค้าในหมวดนี้</td>
            </tr>
          )}
          {rows.map((s, i) => (
            <tr key={s.id} className="border-b border-line/60 last:border-0 hover:bg-surface-2">
              <td className="px-4 py-3 text-muted">{i + 1}</td>
              <td className="px-4 py-3 font-medium">
                {s.name}
                {i === 0 && (
                  <span className="ml-2 rounded bg-neon-green/15 px-1.5 py-0.5 text-[10px] font-bold text-neon-green">
                    BEST RATE
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="rounded-full border border-neon-purple/40 bg-neon-purple/10 px-2.5 py-0.5 text-xs text-neon-purple">
                  {TOPUP_TYPES[s.topup_type]}
                </span>
              </td>
              <td className={"px-4 py-3 text-right font-mono font-semibold " + (i === 0 ? "text-neon-green" : "")}>
                {s.rate.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-right font-mono">฿{(100 / s.rate).toFixed(2)}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onReview(s)}
                  className="whitespace-nowrap rounded-lg px-2 py-1 text-xs transition hover:bg-neon-purple/10"
                >
                  {s.review_count > 0 ? (
                    <>
                      <span className="text-neon-purple">★</span> {s.avg_rating.toFixed(1)}{" "}
                      <span className="text-muted">({s.review_count})</span>
                    </>
                  ) : (
                    <span className="text-muted">รีวิว</span>
                  )}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {s.url && (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-line px-3 py-1 text-xs transition hover:border-neon-green hover:text-neon-green"
                    >
                      ไปที่ร้าน
                    </a>
                  )}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => onEdit(s)}
                        className="rounded-lg border border-line px-3 py-1 text-xs transition hover:border-neon-purple"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => onDelete(s)}
                        className="rounded-lg border border-red-500/40 px-3 py-1 text-xs text-red-300 transition hover:bg-red-500/10"
                      >
                        ลบ
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
