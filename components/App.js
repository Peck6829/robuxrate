"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api-client";
import Header from "./Header";
import HeroBackground from "./HeroBackground";
import Calculator from "./Calculator";
import FilterTabs from "./FilterTabs";
import StoresTable from "./StoresTable";
import AuthModal from "./AuthModal";
import StoreFormModal from "./StoreFormModal";
import ReviewsModal from "./ReviewsModal";

export default function App() {
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState("all");
  const [authMode, setAuthMode] = useState(null); // null | "login" | "register"
  const [editing, setEditing] = useState(null); // null | {} (เพิ่มใหม่) | store (แก้ไข)
  const [reviewingId, setReviewingId] = useState(null); // id ร้านที่กำลังดูรีวิว

  const loadStores = useCallback(async () => {
    try {
      setStores(await api("/api/stores"));
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStores();
    api("/api/auth/me")
      .then((d) => setUser(d.user))
      .catch(() => {});
  }, [loadStores]);

  const filtered = useMemo(
    () => (type === "all" ? stores : stores.filter((s) => s.topup_type === type)),
    [stores, type]
  );

  const isAdmin = user?.role === "admin";

  async function logout() {
    await api("/api/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  }

  async function removeStore(store) {
    if (!confirm(`ลบร้าน "${store.name}" ใช่หรือไม่?`)) return;
    try {
      await api(`/api/stores/${store.id}`, { method: "DELETE" });
      await loadStores();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <>
      <Header user={user} onLogin={() => setAuthMode("login")} onRegister={() => setAuthMode("register")} onLogout={logout} />

      <HeroBackground />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-8 sm:px-6">
        <section className="mb-10 grid items-start gap-6 lg:grid-cols-[1fr_400px]">
          <div className="pt-2">
            <p className="mb-3 inline-block rounded-full border border-neon-purple/40 bg-neon-purple/10 px-3 py-1 text-xs font-medium text-neon-purple">
              เปรียบเทียบเรทเติม Robux
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              หาร้านเติม Robux <br />
              <span className="text-neon-green text-glow-green">คุ้มที่สุด</span> ในไทย
            </h1>
            <p className="mt-4 max-w-md text-muted">
              ดูเรทจากหลายร้านในที่เดียว กรองตามรูปแบบการเติม และคำนวณว่าเงินบาทของคุณได้ Robux เท่าไหร่
            </p>
            <Image
              src="/hero.svg"
              alt="ภาพประกอบ: เพชรและกราฟเรทที่เพิ่มขึ้น"
              width={480}
              height={340}
              priority
              className="mt-4 hidden w-full max-w-xs sm:block"
            />
          </div>
          <Calculator stores={filtered} />
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <FilterTabs value={type} onChange={setType} />
            {isAdmin && (
              <button
                onClick={() => setEditing({})}
                className="rounded-lg bg-neon-green px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110 glow-green"
              >
                + เพิ่มร้านค้า
              </button>
            )}
          </div>

          {error && (
            <p role="alert" className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <StoresTable
            stores={filtered}
            loading={loading}
            isAdmin={isAdmin}
            onEdit={setEditing}
            onDelete={removeStore}
            onReview={(s) => setReviewingId(s.id)}
          />
        </section>
      </main>

      <footer className="border-t border-line py-6 text-center text-xs text-muted">
        RobuxRate TH · โครงงานวิชา DIT204 · ราคาเป็นข้อมูลอ้างอิง โปรดตรวจสอบกับร้านก่อนสั่งซื้อ
      </footer>

      {authMode && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setAuthMode(null)}
          onSuccess={(u) => {
            setUser(u);
            setAuthMode(null);
          }}
        />
      )}

      {/* ดึงร้านจาก state ล่าสุดเสมอ เพื่อให้คะแนนเฉลี่ยในหัว modal อัปเดตหลังรีวิว */}
      {reviewingId && stores.find((s) => s.id === reviewingId) && (
        <ReviewsModal
          store={stores.find((s) => s.id === reviewingId)}
          user={user}
          onClose={() => setReviewingId(null)}
          onChanged={loadStores}
          onLogin={() => {
            setReviewingId(null);
            setAuthMode("login");
          }}
        />
      )}

      {editing && isAdmin && (
        <StoreFormModal
          store={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await loadStores();
          }}
        />
      )}
    </>
  );
}
