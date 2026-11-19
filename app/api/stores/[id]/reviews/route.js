import { pool } from "@/lib/db";
import { getSession } from "@/lib/session";

async function getId(params) {
  const id = Number((await params).id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// ซ่อนอีเมลบางส่วนเพื่อความเป็นส่วนตัว: pe***@gmail.com
function maskEmail(email) {
  const [name, domain] = email.split("@");
  return `${name.slice(0, 2)}***@${domain}`;
}

// ทุกคนดูรีวิวได้
export async function GET(_req, { params }) {
  const storeId = await getId(params);
  if (!storeId) return Response.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });

  const session = await getSession();
  try {
    const [rows] = await pool.execute(
      `SELECT r.id, r.rating, r.comment, r.created_at, r.user_id, u.email
         FROM reviews r JOIN users u ON u.id = r.user_id
        WHERE r.store_id = ? ORDER BY r.updated_at DESC LIMIT 100`,
      [storeId]
    );
    const reviews = rows.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
      author: maskEmail(r.email),
      mine: session?.id === r.user_id,
    }));
    return Response.json(reviews, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "โหลดรีวิวไม่สำเร็จ" }, { status: 500 });
  }
}

// ต้องล็อกอิน: สร้างหรือแก้ไขรีวิวของตัวเอง (1 คน / 1 ร้าน)
export async function POST(req, { params }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "กรุณาเข้าสู่ระบบก่อนรีวิว" }, { status: 401 });

  const storeId = await getId(params);
  if (!storeId) return Response.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });

  const body = await req.json().catch(() => null);
  const rating = Number(body?.rating);
  const comment = String(body?.comment ?? "").trim();
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return Response.json({ error: "คะแนนต้องเป็น 1-5 ดาว" }, { status: 400 });
  if (comment.length > 500)
    return Response.json({ error: "คอมเมนต์ยาวเกิน 500 ตัวอักษร" }, { status: 400 });

  try {
    await pool.execute(
      `INSERT INTO reviews (store_id, user_id, rating, comment) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment)`,
      [storeId, session.id, rating, comment || null]
    );
    return Response.json({ ok: true }, { status: 201 });
  } catch (e) {
    if (e?.code === "ER_NO_REFERENCED_ROW_2")
      return Response.json({ error: "ไม่พบร้านค้าหรือบัญชีผู้ใช้" }, { status: 404 });
    console.error(e);
    return Response.json({ error: "บันทึกรีวิวไม่สำเร็จ" }, { status: 500 });
  }
}
