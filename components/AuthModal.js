"use client";

import { useState } from "react";
import { api } from "@/lib/api-client";
import Modal, { inputClass } from "./Modal";

export default function AuthModal({ initialMode, onClose, onSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isLogin = mode === "login";

  async function submit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      const { user } = await api(`/api/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      onSuccess(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title={isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-xs text-muted">อีเมล</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-xs text-muted">
            รหัสผ่าน{!isLogin && " (อย่างน้อย 8 ตัวอักษร)"}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={isLogin ? undefined : 8}
            autoComplete={isLogin ? "current-password" : "new-password"}
            className={inputClass}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-300">{error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-neon-purple py-2.5 font-semibold text-white transition hover:brightness-110 disabled:opacity-50 glow-purple"
        >
          {busy ? "กำลังดำเนินการ..." : isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-muted">
        {isLogin ? "ยังไม่มีบัญชี?" : "มีบัญชีแล้ว?"}{" "}
        <button
          onClick={() => { setMode(isLogin ? "register" : "login"); setError(""); }}
          className="text-neon-green underline-offset-2 hover:underline"
        >
          {isLogin ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
        </button>
      </p>
    </Modal>
  );
}
