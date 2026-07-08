"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/i18n";

export default function ContactSection({
  locale,
  kofiUrl,
}: {
  locale: Locale;
  kofiUrl?: string;
}) {
  const t = getTranslations(locale);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">
                {t.contact.title}
              </span>
            </h2>
            <p className="text-gray-400 mb-8">{t.contact.subtitle}</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">{t.contact.name}</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t.contact.namePlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">{t.contact.email}</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={t.contact.emailPlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">{t.contact.subject}</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder={t.contact.subjectPlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">{t.contact.message}</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder={t.contact.messagePlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold hover:shadow-lg hover:shadow-brand-500/25 transition-all disabled:opacity-50"
              >
                {status === "sending" ? "..." : t.contact.send}
              </button>
              {status === "success" && (
                <p className="text-emerald-400 text-sm">{t.contact.success}</p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-sm">{t.contact.error}</p>
              )}
            </form>
          </div>

          {/* Support */}
          <div className="flex flex-col items-center justify-center">
            <div className="glass-card rounded-3xl p-8 text-center max-w-sm w-full">
              <div className="text-6xl mb-6">☕</div>
              <h3 className="text-2xl font-bold mb-3">{t.support.title}</h3>
              <p className="text-gray-400 mb-6 text-sm">{t.support.subtitle}</p>
              {kofiUrl && (
                <a
                  href={kofiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 transition-all text-sm"
                >
                  ☕ Ko-fi
                </a>
              )}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-500">
                  gdr-sys © {new Date().getFullYear()}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {t.footer.madeWith}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
