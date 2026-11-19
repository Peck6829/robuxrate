import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import { createSession } from "@/lib/session";
import { parseCredentials } from "@/lib/validate";

// hash ปลอมไว้เทียบเมื่อไม่พบอีเมล เพื่อให้เวลาตอบใกล้เคียงกัน
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

export async function POST(req) {
  const body = await req.json().catch(() => null);
  const parsed = parseCredentials(body);
  if (parsed.error) return Response.json({ error: parsed.error }, { status: 400 });

  const { email, password } = parsed.value;
  try {
    const [rows] = await pool.execute(
      "SELECT id, email, password_hash, role FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    const row = rows[0];
    const ok = await bcrypt.compare(password, row?.password_hash ?? DUMMY_HASH);
    if (!row || !ok)
      return Response.json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });

    const user = { id: row.id, email: row.email, role: row.role };
    await createSession(user);
    return Response.json({ user });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "เข้าสู่ระบบไม่สำเร็จ" }, { status: 500 });
  }
}
