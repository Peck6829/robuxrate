"use client";

import { useState } from "react";
import { api } from "@/lib/api-client";
import { TOPUP_TYPES } from "@/lib/types";
import Modal, { inputClass } from "./Modal";

// store = {} -> เพิ่มใหม่ (POST), store มี id -> แก้ไข (PUT)
export default function StoreFormModal({ store, onClose, onSaved }) {
  const isEdit = Boolean(store.id);
  const [rate, setRate] = useState(store.rate != null ? String(store.rate) : "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const rateNum = Number(rate);
  const per100 = rateNum > 0 ? (100 / rateNum).toFixed(2) : null;

  async function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const payload = {
      name: f.get("name"),
      topup_type: f.get("topup_type"),
      rate,
      url: f.get("url"),
    };
    setBusy(true);
    setError("");
    try {
      await api(isEdit ? `/api/stores/${store.id}` : "/api/stores", {
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      await onSaved();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <Modal title={isEdit ? "แก้ไขร้านค้า" : "เพิ่มร้านค้า"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label htmlFor="name" className="mb-1 block text-xs text-muted">ชื่อร้าน</label>
          <input id="name" name="name" required maxLength={100} defaultValue={store.name} className={inputClass} />
        </div>
        <div>
          <label htmlFor="topup_type" className="mb-1 block text-xs text-muted">รูปแบบการเติม</label>
          <select
            id="topup_type"
            name="topup_type"
            defaultValue={store.topup_type ?? "id_pass"}
            className={inputClass}
          >
            {Object.entries(TOPUP_TYPES).map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rate" className="mb-1 block text-xs text-muted">
            เรท (Robux ต่อ 1 บาท)
          </label>
          <input
            id="rate"
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="เช่น 4.50"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-muted">
            {per100 ? `เท่ากับ ฿${per100} ต่อ 100 Robux` : "ใส่เรทที่ร้านประกาศ เช่น 1 บาท = 4.5 Robux"}
          </p>
        </div>
        <div>
          <label htmlFor="url" className="mb-1 block text-xs text-muted">ลิงก์ร้าน (ไม่บังคับ)</label>
          <input id="url" name="url" type="url" placeholder="https://" defaultValue={store.url ?? ""} className={inputClass} />
        </div>

        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-neon-green py-2.5 font-semibold text-black transition hover:brightness-110 disabled:opacity-50 glow-green"
        >
          {busy ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </form>
    </Modal>
  );
}
