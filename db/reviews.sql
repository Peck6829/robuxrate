-- เพิ่มระบบรีวิว: รันไฟล์นี้ใน phpMyAdmin (แท็บ SQL) โดยเลือกฐานข้อมูล robuxrate ก่อน
-- (ถ้าสร้างฐานข้อมูลใหม่จาก schema.sql เวอร์ชันล่าสุด ไม่ต้องรันไฟล์นี้)

CREATE TABLE IF NOT EXISTS reviews (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  store_id   INT NOT NULL,
  user_id    INT NOT NULL,
  rating     TINYINT NOT NULL,            -- 1-5
  comment    VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_store_user (store_id, user_id),   -- 1 คนรีวิว 1 ร้านได้ 1 ครั้ง
  CONSTRAINT fk_rev_store FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  CONSTRAINT fk_rev_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE
);
