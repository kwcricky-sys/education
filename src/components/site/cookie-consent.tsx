"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "dsehack-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) !== "accepted") {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      /* ignore quota / private mode */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie 同意提示"
      className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-2xl shadow-navy/10 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
        <p className="flex-1 text-sm leading-relaxed text-ink-muted">
          本網站用 Cookies 同瀏覽器本機儲存記住你嘅設定同溫習進度，唔會賣廣告。繼續瀏覽即表示你同意我哋嘅
          <Link
            href="/privacy"
            className="mx-1 font-semibold text-navy underline underline-offset-2"
          >
            私隱政策
          </Link>
          。
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-navy-soft"
        >
          我同意
        </button>
      </div>
    </div>
  );
}
