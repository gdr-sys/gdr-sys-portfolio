"use client";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n";

export type AppData = {
  id: number;
  title: string;
  slug: string;
  url: string | null;
  purchaseUrl: string | null;
  shortDescriptionEn: string;
  shortDescriptionIt: string;
  categoryIds: string;
  targetAudienceIds: string;
  media: Array<{ type: string; url: string }>;
  status: string;
  showPreview: boolean;
  isFree: boolean;
  price: string | null;
  featured: boolean;
  languages: string;
};

export type CategoryData = { id: number; nameEn: string; nameIt: string; slug: string; color: string };
export type TargetData = { id: number; nameEn: string; nameIt: string; slug: string };

export default function AppCard({
  app,
  categories,
  locale,
}: {
  app: AppData;
  categories: CategoryData[];
  locale: Locale;
}) {
  const t = getTranslations(locale);
  const desc = locale === "it" ? app.shortDescriptionIt : app.shortDescriptionEn;
  const catIds = app.categoryIds.split(",").filter(Boolean).map(Number);
  const appCats = categories.filter((c) => catIds.includes(c.id));
  const isComingSoon = app.status === "coming_soon";
  const thumb = app.media?.[0]?.url;

  return (
    <Link href={`/apps/${app.slug}`} className="group block">
      <div className="glass-card rounded-2xl overflow-hidden hover:border-brand-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/10 h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative h-48 bg-navy-900/50 overflow-hidden">
          {thumb ? (
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
              style={{ backgroundImage: `url(${thumb})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/50 to-navy-800/50 flex items-center justify-center">
              <span className="text-5xl opacity-40">🎮</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {isComingSoon && (
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                🚧 {t.app.comingSoon}
              </span>
            )}
            {app.featured && (
              <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
                ⭐ {t.app.featured}
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3">
            {app.isFree ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                {t.app.free}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
                {app.price}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-3">
            {appCats.map((c) => (
              <span
                key={c.id}
                className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${c.color}20`,
                  color: c.color,
                  borderWidth: 1,
                  borderColor: `${c.color}40`,
                }}
              >
                {locale === "it" ? c.nameIt : c.nameEn}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors mb-2">
            {app.title}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed flex-1">{desc}</p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1">
              {app.languages.split(",").map((lang) => (
                <span
                  key={lang}
                  className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400"
                >
                  {lang.trim().toUpperCase()}
                </span>
              ))}
            </div>
            <span className="text-sm text-brand-400 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
