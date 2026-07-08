"use client";
import type { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n";

export default function Footer({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">
            gdr-sys
          </span>
          <span className="text-gray-600 text-sm">
            © {new Date().getFullYear()} — {t.footer.rights}
          </span>
        </div>
        <p className="text-xs text-gray-600">{t.footer.madeWith}</p>
      </div>
    </footer>
  );
}
