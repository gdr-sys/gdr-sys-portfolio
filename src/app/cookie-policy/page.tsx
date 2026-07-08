"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export default function CookiePolicyPage() {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    if (navigator.language.toLowerCase().startsWith("it")) setLocale("it");
  }, []);

  const isIt = locale === "it";

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> {isIt ? "Torna alla Home" : "Back to Home"}
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => setLocale("it")} className={`text-xs px-2 py-1 rounded ${locale === "it" ? "bg-brand-600 text-white" : "bg-white/5 text-gray-400"}`}>IT</button>
          <button onClick={() => setLocale("en")} className={`text-xs px-2 py-1 rounded ${locale === "en" ? "bg-brand-600 text-white" : "bg-white/5 text-gray-400"}`}>EN</button>
        </div>

        {isIt ? (
          <article className="prose prose-invert max-w-none">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">Cookie Policy</h1>
            <p className="text-gray-400 text-sm">Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}</p>

            <h2>Cosa sono i cookie?</h2>
            <p>I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo (computer, tablet, smartphone) quando visiti un sito web. Vengono utilizzati per far funzionare i siti web in modo più efficiente e per fornire informazioni ai proprietari del sito.</p>

            <h2>Quali cookie utilizziamo?</h2>
            <p>Questo sito utilizza esclusivamente <strong>cookie tecnici</strong> strettamente necessari al funzionamento del sito:</p>

            <div className="glass-card rounded-xl p-4 my-4">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-gray-400"><th className="pb-2">Cookie</th><th className="pb-2">Tipo</th><th className="pb-2">Scopo</th><th className="pb-2">Durata</th></tr></thead>
                <tbody className="text-gray-300">
                  <tr className="border-t border-white/5"><td className="py-2 font-mono text-xs">gdr_cookie_consent</td><td>Tecnico</td><td>Ricorda la scelta sui cookie</td><td>Permanente</td></tr>
                  <tr className="border-t border-white/5"><td className="py-2 font-mono text-xs">gdr_admin_token</td><td>Tecnico</td><td>Sessione admin (solo per admin)</td><td>7 giorni</td></tr>
                </tbody>
              </table>
            </div>

            <h2>Cookie di terze parti</h2>
            <p>Questo sito <strong>non utilizza</strong> cookie di profilazione, tracciamento, analytics o pubblicità di terze parti.</p>
            <p>Alcuni link esterni (Ko-fi, Lemon Squeezy) potrebbero impostare propri cookie quando vi si accede. Si rimanda alle rispettive informative privacy.</p>

            <h2>Come gestire i cookie</h2>
            <p>Puoi gestire le preferenze sui cookie direttamente dalle impostazioni del tuo browser:</p>
            <ul>
              <li><strong>Chrome:</strong> Impostazioni → Privacy e sicurezza → Cookie</li>
              <li><strong>Firefox:</strong> Opzioni → Privacy e Sicurezza → Cookie</li>
              <li><strong>Safari:</strong> Preferenze → Privacy → Cookie</li>
              <li><strong>Edge:</strong> Impostazioni → Cookie e autorizzazioni sito</li>
            </ul>
            <p>Nota: disabilitando i cookie tecnici, alcune funzionalità del sito potrebbero non funzionare correttamente.</p>

            <h2>Base giuridica</h2>
            <p>I cookie tecnici non richiedono il consenso dell&#39;utente ai sensi dell&#39;art. 122 del D.Lgs. 196/2003 (come modificato dal D.Lgs. 101/2018) e delle Linee Guida del Garante del 10 giugno 2021.</p>

            <h2>Titolare del trattamento</h2>
            <p>gdr-sys — Per qualsiasi domanda, puoi contattarci tramite il <Link href="/#contact" className="text-brand-400 hover:underline">modulo di contatto</Link>.</p>
          </article>
        ) : (
          <article className="prose prose-invert max-w-none">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">Cookie Policy</h1>
            <p className="text-gray-400 text-sm">Last updated: {new Date().toLocaleDateString("en-US")}</p>

            <h2>What are cookies?</h2>
            <p>Cookies are small text files stored on your device (computer, tablet, smartphone) when you visit a website. They are used to make websites work more efficiently and provide information to site owners.</p>

            <h2>What cookies do we use?</h2>
            <p>This site only uses <strong>essential technical cookies</strong> strictly necessary for the site to function:</p>

            <div className="glass-card rounded-xl p-4 my-4">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-gray-400"><th className="pb-2">Cookie</th><th className="pb-2">Type</th><th className="pb-2">Purpose</th><th className="pb-2">Duration</th></tr></thead>
                <tbody className="text-gray-300">
                  <tr className="border-t border-white/5"><td className="py-2 font-mono text-xs">gdr_cookie_consent</td><td>Technical</td><td>Remembers cookie choice</td><td>Permanent</td></tr>
                  <tr className="border-t border-white/5"><td className="py-2 font-mono text-xs">gdr_admin_token</td><td>Technical</td><td>Admin session (admin only)</td><td>7 days</td></tr>
                </tbody>
              </table>
            </div>

            <h2>Third-party cookies</h2>
            <p>This site does <strong>not use</strong> any profiling, tracking, analytics, or third-party advertising cookies.</p>
            <p>Some external links (Ko-fi, Lemon Squeezy) may set their own cookies when accessed. Please refer to their respective privacy policies.</p>

            <h2>How to manage cookies</h2>
            <p>You can manage cookie preferences from your browser settings:</p>
            <ul>
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
              <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
              <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
            </ul>
            <p>Note: disabling technical cookies may prevent some features from working properly.</p>

            <h2>Data controller</h2>
            <p>gdr-sys — For any questions, contact us via the <Link href="/#contact" className="text-brand-400 hover:underline">contact form</Link>.</p>
          </article>
        )}
      </div>
    </div>
  );
}
