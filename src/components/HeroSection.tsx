"use client";
import type { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n";

export default function HeroSection({
  locale,
  heroTitleEn,
  heroTitleIt,
  heroSubtitleEn,
  heroSubtitleIt,
  stat1Value,
  stat1LabelEn,
  stat1LabelIt,
  stat2Value,
  stat2LabelEn,
  stat2LabelIt,
  stat3Value,
  stat3LabelEn,
  stat3LabelIt,
}: {
  locale: Locale;
  heroTitleEn: string;
  heroTitleIt: string;
  heroSubtitleEn: string;
  heroSubtitleIt: string;
  stat1Value: string;
  stat1LabelEn: string;
  stat1LabelIt: string;
  stat2Value: string;
  stat2LabelEn: string;
  stat2LabelIt: string;
  stat3Value: string;
  stat3LabelEn: string;
  stat3LabelIt: string;
}) {
  const t = getTranslations(locale);
  const title = locale === "it" ? heroTitleIt : heroTitleEn;
  const subtitle = locale === "it" ? heroSubtitleIt : heroSubtitleEn;

  return (
    <section className="relative min-h-[48vh] flex items-center justify-center overflow-hidden pt-20 pb-4">
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
        {/* TITOLO ENORME CON IL GRADIENTE DEL LOGO */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none mb-3 tracking-tight animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="bg-gradient-to-r from-brand-400 via-brand-300 to-cyan-400 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>

        <p
          className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto mb-5 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {subtitle}
        </p>

        <div
          className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <a
            href="#apps"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-brand-500/25 hover:-translate-y-0.5 transition-all"
          >
            {t.hero.cta}
          </a>
          <a
            href="#contact"
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 hover:-translate-y-0.5 transition-all"
          >
            {t.hero.ctaSecondary}
          </a>
        </div>

        {/* Stats rimpicciolite e più vicine */}
        <div
          className="mt-6 grid grid-cols-3 gap-4 max-w-sm mx-auto animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div>
            <div className="text-xl sm:text-2xl font-bold text-brand-400">{stat1Value}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">
              {locale === "it" ? stat1LabelIt : stat1LabelEn}
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-cyan-400">{stat2Value}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">
              {locale === "it" ? stat2LabelIt : stat2LabelEn}
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400">{stat3Value}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">
              {locale === "it" ? stat3LabelIt : stat3LabelEn}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
