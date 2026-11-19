import { pool } from "@/lib/db";
import { getSession } from "@/lib/session";

// ลบรีวิว: เจ้าของรีวิว หรือ Admin เท่านั้น
export async function DELETE(_req, { params }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });

  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0)
    return Response.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });

  try {
    const [rows] = await pool.execute("SELECT user_id FROM reviews WHERE id = ?", [id]);
    if (rows.length === 0) return Response.json({ error: "ไม่พบรีวิว" }, { status: 404 });

    if (rows[0].user_id !== session.id && session.role !== "admin")
      return Response.json({ error: "ไม่มีสิทธิ์ลบรีวิวนี้" }, { status: 403 });

    await pool.execute("DELETE FROM reviews WHERE id = ?", [id]);
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "ลบรีวิวไม่สำเร็จ" }, { status: 500 });
  }
}
