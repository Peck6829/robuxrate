-- RobuxRate TH : รันไฟล์นี้ใน TiDB Cloud (SQL Editor) หรือ mysql client

-- ถ้าใช้ XAMPP: สร้างฐานข้อมูลก่อน (ถ้าใช้ TiDB Cloud ให้ลบ 2 บรรทัดนี้ออก)
CREATE DATABASE IF NOT EXISTS robuxrate CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE robuxrate;

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stores (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  topup_type   ENUM('id_pass','username_group','gift_card') NOT NULL,
  rate         DECIMAL(8,4) NOT NULL,    -- เรท: Robux ต่อ 1 บาท (เช่น 4.5000)
  url          VARCHAR(500) NULL,
  is_active    TINYINT(1) NOT NULL DEFAULT 1,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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

-- ข้อมูลตัวอย่าง (ชื่อร้านและราคาสมมติ สำหรับทดสอบเท่านั้น ให้แก้ผ่านหน้า Admin เป็นข้อมูลจริง)
INSERT INTO stores (name, topup_type, rate, url) VALUES
 ('Demo Store A', 'id_pass',        4.00, 'https://example.com/a'),
 ('Demo Store B', 'username_group', 4.50, 'https://example.com/b'),
 ('Demo Store C', 'gift_card',      3.80, 'https://example.com/c');

-- ทำให้บัญชีหนึ่งเป็น Admin: สมัครสมาชิกผ่านหน้าเว็บก่อน แล้วรันคำสั่งนี้
-- UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
