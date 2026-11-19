-- เปลี่ยนตาราง stores จาก (price_thb + robux_amount) เป็นช่องเดียว: rate (Robux ต่อ 1 บาท)
-- รันใน phpMyAdmin: เลือกฐานข้อมูล robuxrate -> แท็บ SQL -> วางทั้งหมด -> Go
-- ข้อมูลร้านเดิมไม่หาย: ระบบคำนวณเรทจาก robux_amount / price_thb ให้อัตโนมัติ

ALTER TABLE stores ADD COLUMN rate DECIMAL(8,4) NOT NULL DEFAULT 0 AFTER topup_type;

UPDATE stores SET rate = ROUND(robux_amount / price_thb, 4);

ALTER TABLE stores DROP COLUMN price_thb, DROP COLUMN robux_amount;
