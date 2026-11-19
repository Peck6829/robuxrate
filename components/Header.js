"use client";

import Image from "next/image";

export default function Header({ user, onLogin, onRegister, onLogout }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="font-display flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <Image src="/logo-mark.svg" alt="" width={36} height={36} priority />
          <span>
            Robux<span className="text-neon-purple">Rate</span>{" "}
            <span className="text-neon-green">TH</span>
          </span>
        </a>

        <nav className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              <span className="hidden max-w-[200px] truncate text-muted sm:inline">{user.email}</span>
              {user.role === "admin" && (
                <span className="rounded-full border border-neon-green/50 bg-neon-green/10 px-2 py-0.5 text-xs text-neon-green">
                  ADMIN
                </span>
              )}
              <button
                onClick={onLogout}
                className="rounded-lg border border-line px-3 py-1.5 text-muted transition hover:border-neon-purple hover:text-white"
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <button onClick={onLogin} className="px-3 py-1.5 text-muted transition hover:text-white">
                Login
              </button>
              <button
                onClick={onRegister}
                className="rounded-lg bg-neon-purple px-4 py-1.5 font-semibold text-white transition hover:brightness-110 glow-purple"
              >
                Register
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
