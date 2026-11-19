import mysql from "mysql2/promise";

// ใช้ global เพื่อไม่ให้สร้าง pool ใหม่ทุกครั้งที่ hot reload ตอน dev
const globalForDb = globalThis;

export const pool =
  globalForDb.__robuxPool ??
  mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 4000),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // TiDB Cloud บังคับ TLS (DB_SSL=true) / XAMPP ในเครื่องไม่ใช้ (DB_SSL=false)
    ssl:
      process.env.DB_SSL === "false"
        ? undefined
        : { minVersion: "TLSv1.2", rejectUnauthorized: true },
    connectionLimit: 5,
  });

if (process.env.NODE_ENV !== "production") globalForDb.__robuxPool = pool;
