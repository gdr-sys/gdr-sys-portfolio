"use client";
import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AppCard from "@/components/AppCard";
import FilterBar from "@/components/FilterBar";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import type { Locale } from "@/lib/i18n";
import type { AppData, CategoryData, TargetData } from "@/components/AppCard";

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("en");
  const [apps, setApps] = useState<AppData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [targets, setTargets] = useState<TargetData[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Auto-detect language
    const lang = navigator.language.toLowerCase();
    if (lang.startsWith("it")) setLocale("it");
    else setLocale("en");
  }, []);

  useEffect(() => {
    fetch("/api/apps")
      .then((r) => r.json())
      .then((data) => {
        setApps(data.apps);
        setCategories(data.categories);
        setTargets(data.targets);
        setSettings(data.settings);
        setLoaded(true);
      })
      .catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    return apps.filter((app) => {
      // Hide coming_soon with showPreview=false
      if (app.status === "coming_soon" && !app.showPreview) return false;

      if (selectedStatus && app.status !== selectedStatus) return false;

      if (selectedCat) {
        const cat = categories.find((c) => c.slug === selectedCat);
        if (cat) {
          const ids = app.categoryIds.split(",").map(Number);
          if (!ids.includes(cat.id)) return false;
        }
      }

      if (selectedTarget) {
        const tgt = targets.find((t) => t.slug === selectedTarget);
        if (tgt) {
          const ids = app.targetAudienceIds.split(",").map(Number);
          if (!ids.includes(tgt.id)) return false;
        }
      }

      return true;
    });
  }, [apps, categories, targets, selectedCat, selectedTarget, selectedStatus]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar
        locale={locale}
        onLocaleChange={setLocale}
        kofiUrl={settings.kofi_url}
      />

      <HeroSection
        locale={locale}
        heroTitleEn={settings.hero_title_en || "WebApps for RPG, Sports & More"}
        heroTitleIt={settings.hero_title_it || "WebApp per GDR, Sport & Altro"}
        heroSubtitleEn={settings.hero_subtitle_en || "Modern digital tools for players, Dungeon Masters, sports clubs, coaches, and everyone."}
        heroSubtitleIt={settings.hero_subtitle_it || "Strumenti digitali moderni per giocatori, Dungeon Master, società sportive, allenatori e tutti."}
      />

      {/* Apps Grid */}
      <section id="apps" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">
                {locale === "it" ? "Le Nostre App" : "Our Apps"}
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              {locale === "it"
                ? "Esplora la nostra collezione di strumenti digitali"
                : "Explore our collection of digital tools"}
            </p>
          </div>

          <div className="mb-10">
            <FilterBar
              locale={locale}
              categories={categories}
              targets={targets}
              selectedCat={selectedCat}
              selectedTarget={selectedTarget}
              selectedStatus={selectedStatus}
              onCatChange={setSelectedCat}
              onTargetChange={setSelectedTarget}
              onStatusChange={setSelectedStatus}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((app, i) => (
              <div
                key={app.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <AppCard app={app} categories={categories} locale={locale} />
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                {locale === "it"
                  ? "Nessuna app trovata con questi filtri"
                  : "No apps found with these filters"}
              </p>
            </div>
          )}
        </div>
      </section>

      <ContactSection locale={locale} kofiUrl={settings.kofi_url} />
      <Footer locale={locale} />
      <CookieBanner locale={locale} />
    </>
  );
}
