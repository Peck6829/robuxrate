import Image from "next/image";

// พื้นหลังการ์ดภาพเอียงแบบแกลเลอรีเกม: ภาพอยู่ใน public/tiles/tile-1..12.svg
// อยากใช้รูปของตัวเอง: วางไฟล์ชื่อเดิมทับ หรือแก้ TILES ด้านล่าง
const TILES = Array.from({ length: 12 }, (_, i) => `/tiles/tile-${i + 1}.svg`);

// สีกรอบนีออนที่วางซ้อนเยื้องหลังการ์ด และมุมเอียงของแต่ละใบ
const FRAMES = ["#a855f7", "#22ff88", "#38bdf8", "#f472b6", "#fb923c", "#2dd4bf"];
const TILTS = [-6, 4, -3, 7, -8, 5, -2, 6, -5, 3, -7, 8];
const FRAME_TILTS = [10, -9, 12, -7, 8, -11, 9, -6, 11, -8, 7, -10];

export default function HeroBackground() {
  const cells = Array.from({ length: 54 }, (_, i) => i);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[760px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_45%,transparent)]"
    >
      <div className="absolute -inset-[30%] grid -rotate-12 grid-cols-9 content-center gap-7 opacity-35 blur-[2px]">
        {cells.map((i) => {
          const n = i % TILES.length;
          const offset = (i * 5) % 3;
          return (
            <div
              key={i}
              className="relative aspect-square"
              style={{ transform: `translateY(${offset * 14}px)` }}
            >
              {/* กรอบนีออนบางๆ ซ้อนเยื้องหลังการ์ด */}
              <span
                className="absolute -inset-2 rounded-xl border"
                style={{
                  borderColor: FRAMES[i % FRAMES.length],
                  opacity: 0.55,
                  transform: `rotate(${FRAME_TILTS[n]}deg)`,
                }}
              />
              <Image
                src={TILES[n]}
                alt=""
                width={240}
                height={240}
                className="relative h-full w-full rounded-2xl object-cover shadow-lg"
                style={{ transform: `rotate(${TILTS[n]}deg)` }}
              />
            </div>
          );
        })}
      </div>
      {/* ม่านดำให้ข้อความอ่านง่าย */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/75 to-ink" />
    </div>
  );
}
