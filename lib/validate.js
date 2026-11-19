import { TYPE_KEYS } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseCredentials(body, { checkPasswordLength = false } = {}) {
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  if (!EMAIL_RE.test(email) || email.length > 255) return { error: "รูปแบบอีเมลไม่ถูกต้อง" };
  if (!password) return { error: "กรุณากรอกรหัสผ่าน" };
  // bcrypt ใช้ได้สูงสุด 72 bytes
  if (checkPasswordLength && (password.length < 8 || Buffer.byteLength(password) > 72))
    return { error: "รหัสผ่านต้องยาว 8-72 ตัวอักษร" };
  return { value: { email, password } };
}

export function parseStore(body) {
  const name = String(body?.name ?? "").trim();
  const rate = Number(body?.rate);
  const rawUrl = body?.url ? String(body.url).trim() : "";

  if (!name || name.length > 100) return { error: "ชื่อร้านไม่ถูกต้อง (1-100 ตัวอักษร)" };
  if (!TYPE_KEYS.includes(body?.topup_type)) return { error: "รูปแบบการเติมไม่ถูกต้อง" };
  // เรท = Robux ต่อ 1 บาท (เช่น 4.5)
  if (!(rate > 0 && rate < 1000)) return { error: "เรทต้องเป็นตัวเลขมากกว่า 0 (Robux ต่อ 1 บาท)" };

  let url = null;
  if (rawUrl) {
    try {
      const u = new URL(rawUrl);
      // กัน javascript: และ scheme อันตราย
      if (!["http:", "https:"].includes(u.protocol) || rawUrl.length > 500) throw new Error();
      url = u.toString();
    } catch {
      return { error: "URL ต้องขึ้นต้นด้วย http:// หรือ https://" };
    }
  }

  return {
    value: { name, topup_type: body.topup_type, rate: rate.toFixed(4), url },
  };
}
