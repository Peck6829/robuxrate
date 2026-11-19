import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import { createSession } from "@/lib/session";
import { parseCredentials } from "@/lib/validate";

export async function POST(req) {
  const body = await req.json().catch(() => null);
  const parsed = parseCredentials(body, { checkPasswordLength: true });
  if (parsed.error) return Response.json({ error: parsed.error }, { status: 400 });

  const { email, password } = parsed.value;
  const hash = await bcrypt.hash(password, 10);

  try {
    // role ตั้งเป็น 'user' ที่ฝั่งเซิร์ฟเวอร์เสมอ ไม่รับจาก client
    const [r] = await pool.execute(
      "INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'user')",
      [email, hash]
    );
    const user = { id: r.insertId, email, role: "user" };
    await createSession(user);
    return Response.json({ user }, { status: 201 });
  } catch (e) {
    if (e?.code === "ER_DUP_ENTRY")
      return Response.json({ error: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 409 });
    console.error(e);
    return Response.json({ error: "สมัครสมาชิกไม่สำเร็จ" }, { status: 500 });
  }
}
