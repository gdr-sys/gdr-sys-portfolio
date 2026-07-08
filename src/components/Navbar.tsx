"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n";

export default function Navbar({
  locale,
  onLocaleChange,
  kofiUrl,
}: {
  locale: Locale;
  onLocaleChange: (l: Locale) => void;
  kofiUrl?: string;
}) {
  const t = getTranslations(locale);
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-brand-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/images/logo.png"
              alt="gdr-sys"
              width={36}
              height={36}
              className="rounded-lg group-hover:scale-110 transition-transform"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">
              gdr-sys
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              {t.nav.home}
            </Link>
            <Link
              href="/#apps"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              {t.nav.apps}
            </Link>
            <Link
              href="/#contact"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              {t.nav.contact}
            </Link>
            {kofiUrl && (
              <a
                href={kofiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-4 py-2 rounded-full bg-brand-600/20 text-brand-300 hover:bg-brand-600/40 transition-all border border-brand-500/30"
              >
                ☕ {t.nav.support}
              </a>
            )}
            <button
              onClick={() => onLocaleChange(locale === "en" ? "it" : "en")}
              className="text-sm px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1.5"
            >
              {locale === "en" ? "🇮🇹 IT" : "🇬🇧 EN"}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setOpen(!open)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass-card border-t border-brand-500/10">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block text-gray-300 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              {t.nav.home}
            </Link>
            <Link
              href="/#apps"
              className="block text-gray-300 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              {t.nav.apps}
            </Link>
            <Link
              href="/#contact"
              className="block text-gray-300 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              {t.nav.contact}
            </Link>
            {kofiUrl && (
              <a
                href={kofiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-brand-300"
              >
                ☕ {t.nav.support}
              </a>
            )}
            <button
              onClick={() => onLocaleChange(locale === "en" ? "it" : "en")}
              className="text-sm px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              {locale === "en" ? "🇮🇹 Italiano" : "🇬🇧 English"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
