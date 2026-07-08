"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Lightbox from "@/components/Lightbox";
import type { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n";
import CookieBanner from "@/components/CookieBanner";
import type { CategoryData, TargetData } from "@/components/AppCard";

type FullApp = {
  id: number;
  title: string;
  slug: string;
  url: string | null;
  purchaseUrl: string | null;
  shortDescriptionEn: string;
  shortDescriptionIt: string;
  fullDescriptionEn: string;
  fullDescriptionIt: string;
  categoryIds: string;
  targetAudienceIds: string;
  media: Array<{ type: string; url: string }>;
  languages: string;
  status: string;
  showPreview: boolean;
  isFree: boolean;
  price: string | null;
  featured: boolean;
};

export default function AppDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [locale, setLocale] = useState<Locale>("en");
  const [app, setApp] = useState<FullApp | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [targets, setTargets] = useState<TargetData[]>([]);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const lang = navigator.language.toLowerCase();
    if (lang.startsWith("it")) setLocale("it");
  }, []);

  useEffect(() => {
    fetch(`/api/apps/${slug}`)
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then((data) => { setApp(data.app); setCategories(data.categories); setTargets(data.targets); })
      .catch(() => setError(true));
  }, [slug]);

  const t = getTranslations(locale);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: app?.title, url }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-400 mb-4">404</h1>
        <Link href="/" className="text-brand-400 hover:underline">← {t.app.backToApps}</Link>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  const desc = locale === "it" ? app.fullDescriptionIt : app.fullDescriptionEn;
  const shortDesc = locale === "it" ? app.shortDescriptionIt : app.shortDescriptionEn;
  const catIds = app.categoryIds.split(",").filter(Boolean).map(Number);
  const appCats = categories.filter((c) => catIds.includes(c.id));
  const tgtIds = app.targetAudienceIds.split(",").filter(Boolean).map(Number);
  const appTargets = targets.filter((tg) => tgtIds.includes(tg.id));
  const isComingSoon = app.status === "coming_soon";
  const images = app.media.filter(m => m.type === "image" || m.type === "gif");
  const videos = app.media.filter(m => m.type === "video");

  return (
    <>
      <Navbar locale={locale} onLocaleChange={setLocale} />

      <main className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> {t.app.backToApps}
        </Link>

        {/* Hero Card */}
        <div className="glass-card rounded-3xl overflow-hidden mb-8">
          {app.media?.[0] && (
            <div className="relative h-64 sm:h-80 lg:h-96">
              {app.media[0].type === "video" ? (
                <video src={app.media[0].url} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${app.media[0].url})` }} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
            </div>
          )}

          <div className="p-6 sm:p-10 -mt-16 relative z-10">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {isComingSoon && (
                <span className="px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-sm font-semibold border border-amber-500/30 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  {t.app.inDevelopment}
                </span>
              )}
              {app.featured && (
                <span className="px-4 py-1.5 rounded-full bg-brand-500/20 text-brand-300 text-sm font-semibold border border-brand-500/30">
                  ⭐ {t.app.featured}
                </span>
              )}
              {app.isFree ? (
                <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-semibold border border-emerald-500/30">
                  ✓ {t.app.free}
                </span>
              ) : (
                <span className="px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-semibold border border-cyan-500/30">
                  💎 {app.price}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-white to-brand-200 bg-clip-text text-transparent">
                {app.title}
              </span>
            </h1>
            <p className="text-lg text-gray-400 mb-6 max-w-2xl">{shortDesc}</p>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {appCats.map((c) => (
                <span key={c.id} className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: `${c.color}20`, color: c.color, borderWidth: 1, borderColor: `${c.color}40` }}>
                  {locale === "it" ? c.nameIt : c.nameEn}
                </span>
              ))}
            </div>

            {/* Meta info grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {appTargets.length > 0 && (
                <div className="glass-card-light rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">{t.app.targetAudience}</p>
                  <p className="text-sm text-white font-medium">
                    {appTargets.map((tg) => (locale === "it" ? tg.nameIt : tg.nameEn)).join(", ")}
                  </p>
                </div>
              )}
              <div className="glass-card-light rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">{t.app.languages}</p>
                <div className="flex gap-1">
                  {app.languages.split(",").map((lang) => (
                    <span key={lang} className="text-sm px-2 py-0.5 rounded bg-white/10 text-white">
                      {lang.trim().toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
              <div className="glass-card-light rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <p className="text-sm text-white font-medium">
                  {app.status === "published" ? (locale === "it" ? "Disponibile" : "Available") :
                   app.status === "coming_soon" ? (locale === "it" ? "In arrivo" : "Coming Soon") :
                   "Draft"}
                </p>
              </div>
              {!app.isFree && app.price && (
                <div className="glass-card-light rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">{locale === "it" ? "Prezzo" : "Price"}</p>
                  <p className="text-lg text-cyan-400 font-bold">{app.price}</p>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              {app.url && !isComingSoon && (
                <a href={app.url} target="_blank" rel="noopener noreferrer"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-brand-500/25 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                  🚀 {t.app.openApp}
                </a>
              )}
              {app.url && isComingSoon && (
                <a href={app.url} target="_blank" rel="noopener noreferrer"
                  className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all flex items-center gap-2">
                  👀 {t.app.viewProject}
                </a>
              )}
              {app.purchaseUrl && (
                <a href={app.purchaseUrl} target="_blank" rel="noopener noreferrer"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                  🛒 {t.app.buyNow}
                </a>
              )}
              <button onClick={handleShare}
                className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all flex items-center gap-2">
                {copied ? "✓ Copiato!" : "📤"} {!copied && (locale === "it" ? "Condividi" : "Share")}
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        {desc && (
          <div className="glass-card rounded-2xl p-6 sm:p-10 mb-8">
            <h2 className="text-xl font-bold mb-4 text-white">
              {locale === "it" ? "Descrizione" : "Description"}
            </h2>
            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-line">
              {desc}
            </div>
          </div>
        )}

        {/* Screenshots Gallery */}
        {images.length > 0 && (
          <div className="glass-card rounded-2xl p-6 sm:p-10 mb-8">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              📸 {locale === "it" ? "Screenshot" : "Screenshots"}
              <span className="text-sm font-normal text-gray-500">({images.length})</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((m, i) => (
                <button key={i} onClick={() => setLightboxIdx(app.media.indexOf(m))}
                  className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer ring-2 ring-transparent hover:ring-brand-500/50 transition-all">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt={`${app.title} screenshot ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-white text-4xl transition-opacity">🔍</span>
                  </div>
                  {m.type === "gif" && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-brand-500 text-white text-xs font-medium">GIF</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <div className="glass-card rounded-2xl p-6 sm:p-10 mb-8">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              🎬 Video
              <span className="text-sm font-normal text-gray-500">({videos.length})</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {videos.map((m, i) => (
                <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-navy-900">
                  <video src={m.url} controls className="absolute inset-0 w-full h-full object-cover" poster="" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features/Info Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {app.isFree && (
            <div className="glass-card rounded-2xl p-6 text-center">
              <span className="text-4xl mb-3 block">🆓</span>
              <h3 className="font-bold text-white mb-1">{locale === "it" ? "Gratuita" : "Free to Use"}</h3>
              <p className="text-sm text-gray-400">{locale === "it" ? "Nessun costo, per sempre" : "No cost, forever"}</p>
            </div>
          )}
          {app.languages.split(",").length > 1 && (
            <div className="glass-card rounded-2xl p-6 text-center">
              <span className="text-4xl mb-3 block">🌍</span>
              <h3 className="font-bold text-white mb-1">{locale === "it" ? "Multilingua" : "Multilingual"}</h3>
              <p className="text-sm text-gray-400">{app.languages.split(",").length} {locale === "it" ? "lingue supportate" : "languages supported"}</p>
            </div>
          )}
          <div className="glass-card rounded-2xl p-6 text-center">
            <span className="text-4xl mb-3 block">📱</span>
            <h3 className="font-bold text-white mb-1">{locale === "it" ? "Responsive" : "Mobile Ready"}</h3>
            <p className="text-sm text-gray-400">{locale === "it" ? "Funziona su ogni dispositivo" : "Works on any device"}</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <span className="text-4xl mb-3 block">⚡</span>
            <h3 className="font-bold text-white mb-1">{locale === "it" ? "Veloce" : "Fast"}</h3>
            <p className="text-sm text-gray-400">{locale === "it" ? "Caricamento istantaneo" : "Instant loading"}</p>
          </div>
          {!app.isFree && (
            <div className="glass-card rounded-2xl p-6 text-center">
              <span className="text-4xl mb-3 block">💎</span>
              <h3 className="font-bold text-white mb-1">Premium</h3>
              <p className="text-sm text-gray-400">{locale === "it" ? "Funzionalità avanzate" : "Advanced features"}</p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="glass-card rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {locale === "it" ? "Pronto a provare?" : "Ready to try it?"}
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {app.url && !isComingSoon && (
              <a href={app.url} target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-brand-500/25 hover:-translate-y-0.5 transition-all">
                🚀 {t.app.openApp}
              </a>
            )}
            {app.purchaseUrl && (
              <a href={app.purchaseUrl} target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5 transition-all">
                🛒 {t.app.buyNow}
              </a>
            )}
          </div>
        </div>
      </main>

      {lightboxIdx !== null && (
        <Lightbox
          items={app.media}
          currentIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onPrev={() => setLightboxIdx((lightboxIdx - 1 + app.media.length) % app.media.length)}
          onNext={() => setLightboxIdx((lightboxIdx + 1) % app.media.length)}
        />
      )}

      <Footer locale={locale} />
      <CookieBanner locale={locale} />
    </>
  );
}
