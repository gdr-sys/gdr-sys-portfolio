"use client";
import type { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n";

export default function HeroSection({
  locale,
  heroTitleEn,
  heroTitleIt,
  heroSubtitleEn,
  heroSubtitleIt,
}: {
  locale: Locale;
  heroTitleEn: string;
  heroTitleIt: string;
  heroSubtitleEn: string;
  heroSubtitleIt: string;
}) {
  const t = getTranslations(locale);
  const title = locale === "it" ? heroTitleIt : heroTitleEn;
  const subtitle = locale === "it" ? heroSubtitleIt : heroSubtitleEn;

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url(/images/hero-bg.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/60 to-navy-950" />
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">


        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="bg-gradient-to-r from-white via-brand-200 to-cyan-200 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>

        <p
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {subtitle}
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <a
            href="#apps"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-brand-500/25 hover:-translate-y-0.5 transition-all"
          >
            {t.hero.cta}
          </a>
          <a
            href="#contact"
            className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 hover:-translate-y-0.5 transition-all"
          >
            {t.hero.ctaSecondary}
          </a>
        </div>

        {/* Stats */}
        <div
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-brand-400">10+</div>
            <div className="text-xs text-gray-500 mt-1">
              {locale === "it" ? "App" : "Apps"}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-cyan-400">
              {locale === "it" ? "Gratis" : "Free"}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {locale === "it" ? "Open Source" : "Open Source"}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400">5+</div>
            <div className="text-xs text-gray-500 mt-1">
              {locale === "it" ? "Categorie" : "Categories"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
