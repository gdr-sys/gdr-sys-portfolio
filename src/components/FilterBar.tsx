"use client";
import type { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n";
import type { CategoryData, TargetData } from "./AppCard";

export default function FilterBar({
  locale,
  categories,
  targets,
  selectedCat,
  selectedTarget,
  selectedStatus,
  onCatChange,
  onTargetChange,
  onStatusChange,
}: {
  locale: Locale;
  categories: CategoryData[];
  targets: TargetData[];
  selectedCat: string;
  selectedTarget: string;
  selectedStatus: string;
  onCatChange: (slug: string) => void;
  onTargetChange: (slug: string) => void;
  onStatusChange: (s: string) => void;
}) {
  const t = getTranslations(locale);

  return (
    <div className="space-y-4">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCatChange("")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedCat === ""
              ? "bg-brand-600 text-white shadow-lg shadow-brand-500/25"
              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
          }`}
        >
          {t.filter.all}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onCatChange(cat.slug === selectedCat ? "" : cat.slug)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCat === cat.slug
                ? "text-white shadow-lg"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
            style={
              selectedCat === cat.slug
                ? { backgroundColor: cat.color, boxShadow: `0 10px 25px ${cat.color}40` }
                : undefined
            }
          >
            {locale === "it" ? cat.nameIt : cat.nameEn}
          </button>
        ))}
      </div>

      {/* Target + Status row */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-500 mr-1">
          {locale === "it" ? "Per:" : "For:"}
        </span>
        <button
          onClick={() => onTargetChange("")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedTarget === ""
              ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/40"
              : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5"
          }`}
        >
          {t.filter.all}
        </button>
        {targets.map((tgt) => (
          <button
            key={tgt.slug}
            onClick={() =>
              onTargetChange(tgt.slug === selectedTarget ? "" : tgt.slug)
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedTarget === tgt.slug
                ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/40"
                : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5"
            }`}
          >
            {locale === "it" ? tgt.nameIt : tgt.nameEn}
          </button>
        ))}

        <span className="mx-3 text-gray-700">|</span>

        <button
          onClick={() => onStatusChange("")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedStatus === ""
              ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
              : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5"
          }`}
        >
          {t.filter.all}
        </button>
        <button
          onClick={() =>
            onStatusChange(selectedStatus === "published" ? "" : "published")
          }
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedStatus === "published"
              ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
              : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5"
          }`}
        >
          {t.filter.published}
        </button>
        <button
          onClick={() =>
            onStatusChange(
              selectedStatus === "coming_soon" ? "" : "coming_soon"
            )
          }
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedStatus === "coming_soon"
              ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
              : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5"
          }`}
        >
          {t.filter.comingSoon}
        </button>
      </div>
    </div>
  );
}
