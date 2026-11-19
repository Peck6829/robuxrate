import { pool } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { parseStore } from "@/lib/validate";

// Guest ดูได้
export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.topup_type, s.rate, s.url, s.updated_at,
              AVG(r.rating) AS avg_rating, COUNT(r.id) AS review_count
         FROM stores s LEFT JOIN reviews r ON r.store_id = s.id
        WHERE s.is_active = 1
        GROUP BY s.id, s.name, s.topup_type, s.rate, s.url, s.updated_at`
    );
    // DECIMAL/AVG จาก mysql2 เป็น string -> แปลงเป็น number
    const stores = rows.map((r) => ({
      ...r,
      rate: Number(r.rate),
      avg_rating: r.avg_rating == null ? null : Number(r.avg_rating),
      review_count: Number(r.review_count),
    }));
    return Response.json(stores, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "โหลดข้อมูลร้านค้าไม่สำเร็จ" }, { status: 500 });
  }
}

// Admin เท่านั้น
export async function POST(req) {
  const g = await requireAdmin();
  if (g.error) return g.error;

  const parsed = parseStore(await req.json().catch(() => null));
  if (parsed.error) return Response.json({ error: parsed.error }, { status: 400 });

  const s = parsed.value;
  try {
    const [r] = await pool.execute(
      "INSERT INTO stores (name, topup_type, rate, url) VALUES (?, ?, ?, ?)",
      [s.name, s.topup_type, s.rate, s.url]
    );
    return Response.json({ id: r.insertId }, { status: 201 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "เพิ่มร้านค้าไม่สำเร็จ" }, { status: 500 });
  }
}
