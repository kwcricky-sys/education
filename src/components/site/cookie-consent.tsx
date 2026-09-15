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
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-md sm:flex-row sm:items-center sm:gap-5 sm:p-5">
        <p className="flex-1 text-sm leading-relaxed text-slate-700">
          本網站使用 Cookies 以改善用戶體驗及提供個人化廣告。繼續瀏覽即表示您同意我們的
          <Link
            href="/privacy"
            className="mx-1 font-medium text-blue-700 underline-offset-2 hover:underline"
          >
            私隱政策
          </Link>
          。
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:brightness-110"
        >
          我同意
        </button>
      </div>
    </div>
  );
}
