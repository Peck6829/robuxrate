import { pool } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { parseStore } from "@/lib/validate";

// Next 16: params เป็น Promise ต้อง await
async function getId(params) {
  const id = Number((await params).id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PUT(req, { params }) {
  const g = await requireAdmin();
  if (g.error) return g.error;

  const id = await getId(params);
  if (!id) return Response.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });

  const parsed = parseStore(await req.json().catch(() => null));
  if (parsed.error) return Response.json({ error: parsed.error }, { status: 400 });

  const s = parsed.value;
  try {
    const [r] = await pool.execute(
      "UPDATE stores SET name=?, topup_type=?, rate=?, url=? WHERE id=?",
      [s.name, s.topup_type, s.rate, s.url, id]
    );
    if (r.affectedRows === 0) return Response.json({ error: "ไม่พบร้านค้า" }, { status: 404 });
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "แก้ไขร้านค้าไม่สำเร็จ" }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  const g = await requireAdmin();
  if (g.error) return g.error;

  const id = await getId(params);
  if (!id) return Response.json({ error: "id ไม่ถูกต้อง" }, { status: 400 });

  try {
    const [r] = await pool.execute("DELETE FROM stores WHERE id = ?", [id]);
    if (r.affectedRows === 0) return Response.json({ error: "ไม่พบร้านค้า" }, { status: 404 });
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "ลบร้านค้าไม่สำเร็จ" }, { status: 500 });
  }
}
