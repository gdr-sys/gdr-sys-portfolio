"use client";
import { useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n";

const LS_KEY = "gdr_cookie_consent";

const text = {
  en: {
    message: "This website uses technical cookies to ensure the best experience. No profiling or third-party tracking cookies are used.",
    accept: "Accept",
    moreInfo: "More Info",
  },
  it: {
    message: "Questo sito utilizza cookie tecnici per garantire la migliore esperienza. Non vengono utilizzati cookie di profilazione o tracciamento di terze parti.",
    accept: "Accetta",
    moreInfo: "Maggiori info",
  },
};

export default function CookieBanner({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const t = text[locale] || text.en;

  useEffect(() => {
    try {
      const consent = localStorage.getItem(LS_KEY);
      if (!consent) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try { localStorage.setItem(LS_KEY, "accepted"); } catch { /* ok */ }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[70] p-4 animate-fade-in-up">
      <div className="max-w-4xl mx-auto glass-card rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl shadow-black/40 border border-brand-500/20">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🍪</span>
            <h3 className="font-semibold text-white text-sm">Cookie Policy</h3>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">{t.message}</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <a
            href="/cookie-policy"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm hover:bg-white/10 hover:text-white transition-all"
          >
            {t.moreInfo}
          </a>
          <button
            onClick={accept}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-brand-500/25 transition-all"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
