"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import Modal, { inputClass } from "./Modal";
import Stars from "./Stars";

export default function ReviewsModal({ store, user, onClose, onChanged, onLogin }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const list = await api(`/api/stores/${store.id}/reviews`);
      setReviews(list);
      // ถ้าเคยรีวิวแล้ว ใส่ค่าเดิมในฟอร์มเพื่อแก้ไข
      const mine = list.find((r) => r.mine);
      if (mine) {
        setRating(mine.rating);
        setComment(mine.comment ?? "");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [store.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function submit(e) {
    e.preventDefault();
    if (rating < 1) return setError("กรุณาเลือกจำนวนดาว");
    setBusy(true);
    setError("");
    try {
      await api(`/api/stores/${store.id}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating, comment }),
      });
      await load();
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(review) {
    if (!confirm("ลบรีวิวนี้ใช่หรือไม่?")) return;
    try {
      await api(`/api/reviews/${review.id}`, { method: "DELETE" });
      if (review.mine) {
        setRating(0);
        setComment("");
      }
      await load();
      onChanged();
    } catch (err) {
      setError(err.message);
    }
  }

  const isAdmin = user?.role === "admin";
  const hasMine = reviews.some((r) => r.mine);

  return (
    <Modal title={`รีวิว: ${store.name}`} onClose={onClose} wide>
      {/* สรุปคะแนน */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl font-bold text-neon-green">
          {store.avg_rating ? store.avg_rating.toFixed(1) : "-"}
        </span>
        <div>
          <Stars value={store.avg_rating ?? 0} size="text-lg" />
          <p className="text-xs text-muted">{store.review_count} รีวิว</p>
        </div>
      </div>

      {/* ฟอร์มรีวิว */}
      {user ? (
        <form onSubmit={submit} className="mb-5 space-y-3 rounded-xl border border-line bg-surface-2 p-4">
          <p className="text-sm font-medium">{hasMine ? "แก้ไขรีวิวของคุณ" : "ให้คะแนนร้านนี้"}</p>
          <Stars value={rating} onChange={setRating} size="text-2xl" />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="เล่าประสบการณ์การเติม (ไม่บังคับ)"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-neon-purple px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
          >
            {busy ? "กำลังบันทึก..." : hasMine ? "อัปเดตรีวิว" : "ส่งรีวิว"}
          </button>
        </form>
      ) : (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
          <span>เข้าสู่ระบบเพื่อให้คะแนนและเขียนรีวิวร้านนี้</span>
          <button
            onClick={onLogin}
            className="shrink-0 rounded-lg bg-neon-purple px-3 py-1.5 font-semibold text-white transition hover:brightness-110"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      )}

      {error && <p role="alert" className="mb-3 text-sm text-red-300">{error}</p>}

      {/* รายการรีวิว */}
      <ul className="space-y-3">
        {loading && <li className="text-sm text-muted">กำลังโหลด...</li>}
        {!loading && reviews.length === 0 && (
          <li className="text-sm text-muted">ยังไม่มีรีวิว เป็นคนแรกที่รีวิวร้านนี้</li>
        )}
        {reviews.map((r) => (
          <li key={r.id} className="rounded-xl border border-line p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Stars value={r.rating} />
                <span className="text-xs text-muted">
                  {r.author}
                  {r.mine && <span className="ml-1 text-neon-green">(คุณ)</span>}
                </span>
              </div>
              {(r.mine || isAdmin) && (
                <button
                  onClick={() => remove(r)}
                  className="text-xs text-red-300 transition hover:underline"
                >
                  ลบ
                </button>
              )}
            </div>
            {r.comment && <p className="mt-2 whitespace-pre-wrap break-words text-sm">{r.comment}</p>}
          </li>
        ))}
      </ul>
    </Modal>
  );
}
