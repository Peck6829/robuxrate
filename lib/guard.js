import { getSession } from "./session";

// ใช้ใน API ที่ต้องเป็น Admin: if (g.error) return g.error;
export async function requireAdmin() {
  const session = await getSession();
  if (!session) return { error: Response.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 }) };
  if (session.role !== "admin")
    return { error: Response.json({ error: "ไม่มีสิทธิ์ (Admin เท่านั้น)" }, { status: 403 }) };
  return { session };
}
