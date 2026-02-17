"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";

import {
  NEW_ACCOUNT_CELEBRATION_EVENT,
  NEW_ACCOUNT_CELEBRATION_SESSION_KEY,
} from "@/lib/auth/celebration";

type ConfettiPiece = {
  id: number;
  color: string;
  left: number;
  width: number;
  height: number;
  delayMs: number;
  durationMs: number;
  driftPx: number;
  spinDeg: number;
  rounded: boolean;
};

const CONFETTI_COLORS = [
  "#ff9ecd",
  "#acf8e0",
  "#ffbc8c",
  "#f9e27f",
  "#b794f6",
  "#ff6b5a",
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    left: randomInt(2, 98),
    width: randomInt(6, 12),
    height: randomInt(8, 18),
    delayMs: randomInt(0, 450),
    durationMs: randomInt(1500, 2600),
    driftPx: randomInt(-160, 160),
    spinDeg: randomInt(180, 720),
    rounded: Math.random() > 0.58,
  }));
}

export function NewAccountCelebration() {
  const [active, setActive] = useState(false);
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  const maybeCelebrate = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(NEW_ACCOUNT_CELEBRATION_SESSION_KEY) !== "1") {
      return;
    }

    window.sessionStorage.removeItem(NEW_ACCOUNT_CELEBRATION_SESSION_KEY);
    setPieces(generatePieces(90));
    setActive(true);

    window.setTimeout(() => {
      setActive(false);
    }, 2700);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      maybeCelebrate();
    }, 0);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [maybeCelebrate]);

  useEffect(() => {
    const handleTrigger = () => {
      maybeCelebrate();
    };
    window.addEventListener(NEW_ACCOUNT_CELEBRATION_EVENT, handleTrigger);
    return () => {
      window.removeEventListener(NEW_ACCOUNT_CELEBRATION_EVENT, handleTrigger);
    };
  }, [maybeCelebrate]);

  if (!active) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      {pieces.map((piece) => {
        const style = {
          left: `${piece.left}%`,
          width: `${piece.width}px`,
          height: `${piece.height}px`,
          backgroundColor: piece.color,
          borderRadius: piece.rounded ? "999px" : "2px",
          animationDelay: `${piece.delayMs}ms`,
          animationDuration: `${piece.durationMs}ms`,
          "--drift": `${piece.driftPx}px`,
          "--spin": `${piece.spinDeg}deg`,
        } as CSSProperties;

        return <span key={piece.id} className="replaysell-confetti-piece" style={style} />;
      })}

      <div className="absolute left-1/2 top-20 -translate-x-1/2 rounded-2xl border-[3px] border-line bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-text shadow-[0_4px_0_#000] replaysell-celebration-badge">
        Account created
      </div>
    </div>
  );
}
