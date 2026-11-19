"use client";

import { useMemo, useState } from "react";

const nf = new Intl.NumberFormat("th-TH");

export default function Calculator({ stores }) {
  const [thb, setThb] = useState("100");
  const amount = Math.max(0, Number(thb) || 0);

  // คำนวณทันทีที่พิมพ์ (ไม่ต้องเรียก API) แล้วเรียงจากได้ Robux มากสุด
  const rows = useMemo(
    () =>
      stores
        .map((s) => ({ ...s, robux: Math.floor(amount * s.rate) }))
        .sort((a, b) => b.robux - a.robux)
        .slice(0, 5),
    [stores, amount]
  );

  return (
    <div className="rounded-2xl border border-neon-purple/40 bg-surface p-5 glow-purple">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neon-purple">
        THB → Robux Calculator
      </h2>

      <label htmlFor="thb" className="mb-1 block text-xs text-muted">
        จำนวนเงิน (บาท)
      </label>
      <div className="flex items-center rounded-xl border border-line bg-ink px-4 focus-within:border-neon-purple">
        <span className="mr-2 text-muted">฿</span>
        <input
          id="thb"
          type="number"
          inputMode="decimal"
          min="0"
          max="1000000"
          value={thb}
          onChange={(e) => setThb(e.target.value)}
          className="w-full bg-transparent py-3 text-2xl font-semibold outline-none"
        />
      </div>

      <ul className="mt-4 space-y-2">
        {rows.length === 0 && <li className="text-sm text-muted">ยังไม่มีข้อมูลร้านค้า</li>}
        {rows.map((r, i) => (
          <li
            key={r.id}
            className={
              "flex items-center justify-between rounded-lg px-3 py-2 text-sm " +
              (i === 0 ? "border border-neon-green/50 bg-neon-green/10" : "bg-surface-2")
            }
          >
            <span className="truncate pr-2">
              {i === 0 && <span className="mr-2 text-xs font-bold text-neon-green">BEST</span>}
              {r.name}
            </span>
            <span className={"font-mono font-semibold " + (i === 0 ? "text-neon-green text-glow-green" : "")}>
              {nf.format(r.robux)} R$
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
