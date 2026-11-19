"use client";

// แสดงดาว (อ่านอย่างเดียว) ถ้าส่ง onChange มาจะกดเลือกคะแนนได้
export default function Stars({ value = 0, onChange, size = "text-base" }) {
  return (
    <span className={`inline-flex ${size}`} role={onChange ? "radiogroup" : "img"} aria-label={`${value} จาก 5 ดาว`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(value);
        const star = (
          <span className={filled ? "text-neon-purple" : "text-line"}>★</span>
        );
        return onChange ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} ดาว`}
            onClick={() => onChange(n)}
            className="px-0.5 transition hover:scale-125"
          >
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </span>
  );
}
