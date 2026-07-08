"use client";
import { useState, useEffect } from "react";

/* ── types ── */
type AppItem = {
  id: number; title: string; slug: string; url: string | null; purchaseUrl: string | null;
  shortDescriptionEn: string; shortDescriptionIt: string; fullDescriptionEn: string; fullDescriptionIt: string;
  categoryIds: string; targetAudienceIds: string; media: Array<{ type: string; url: string }>;
  languages: string; status: string; showPreview: boolean; isFree: boolean; price: string | null;
  featured: boolean; sortOrder: number;
};
type Cat = { id: number; nameEn: string; nameIt: string; slug: string; color: string };
type Tgt = { id: number; nameEn: string; nameIt: string; slug: string };
type Msg = { id: number; name: string; email: string; subject: string; message: string; read: boolean; createdAt: string };

const blankApp: Omit<AppItem, "id"> = {
  title: "", slug: "", url: "", purchaseUrl: "",
  shortDescriptionEn: "", shortDescriptionIt: "", fullDescriptionEn: "", fullDescriptionIt: "",
  categoryIds: "", targetAudienceIds: "", media: [], languages: "en",
  status: "published", showPreview: true, isFree: true, price: "", featured: false, sortOrder: 0,
};

const LS_KEY = "gdr_admin_token";

/* ── XHR fetch helper — query param token ── */
function af(token: string, url: string, opts?: RequestInit): Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }> {
  const sep = url.includes("?") ? "&" : "?";
  const fullUrl = `${url}${sep}token=${encodeURIComponent(token)}`;
  const method = opts?.method || "GET";
  const body = opts?.body as string | undefined;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, fullUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onload = () => resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status, json: () => Promise.resolve(JSON.parse(xhr.responseText)) });
    xhr.onerror = () => reject(new Error("Errore di rete"));
    xhr.send(body || null);
  });
}

function xhrPost(url: string, data: unknown): Promise<{ ok: boolean; status: number; json: () => Promise<unknown> }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onload = () => resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status, json: () => Promise.resolve(JSON.parse(xhr.responseText)) });
    xhr.onerror = () => reject(new Error("Errore di rete"));
    xhr.send(JSON.stringify(data));
  });
}

export default function AdminPage() {
  const [token, setTokenState] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [tab, setTab] = useState<"apps" | "categories" | "targets" | "messages" | "settings">("apps");
  const [busy, setBusy] = useState(false);

  const [apps, setApps] = useState<AppItem[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [tgts, setTgts] = useState<Tgt[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [cfg, setCfg] = useState<Record<string, string>>({});

  const [editApp, setEditApp] = useState<(Omit<AppItem, "id"> & { id?: number }) | null>(null);
  const [editCat, setEditCat] = useState<(Omit<Cat, "id"> & { id?: number }) | null>(null);
  const [editTgt, setEditTgt] = useState<(Omit<Tgt, "id"> & { id?: number }) | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [delModal, setDelModal] = useState<{ t: string; id: number } | null>(null);
  const [toast, setToast] = useState("");
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  function storeToken(t: string) { setTokenState(t); try { localStorage.setItem(LS_KEY, t); } catch { /* */ } }
  function dropToken() { setTokenState(null); try { localStorage.removeItem(LS_KEY); } catch { /* */ } }

  async function loadAll(tk: string) {
    setBusy(true);
    try {
      const [aR, cR, tR, mR, sR] = await Promise.all([
        af(tk, "/api/admin/apps"), af(tk, "/api/admin/categories"), af(tk, "/api/admin/targets"),
        af(tk, "/api/admin/messages"), af(tk, "/api/admin/settings"),
      ]);
      if (aR.status === 401) { dropToken(); setBusy(false); return; }
      if (aR.ok) setApps(await aR.json() as AppItem[]);
      if (cR.ok) setCats(await cR.json() as Cat[]);
      if (tR.ok) setTgts(await tR.json() as Tgt[]);
      if (mR.ok) setMsgs(await mR.json() as Msg[]);
      if (sR.ok) { const d = await sR.json() as Record<string, string>; setCfg(d || {}); }
    } catch (e) { console.error(e); }
    setBusy(false);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let stored: string | null = null;
      try { stored = localStorage.getItem(LS_KEY); } catch { /* */ }
      if (!stored) { setReady(true); return; }
      try {
        const r = await af(stored, "/api/admin/check");
        const d = await r.json() as Record<string, unknown>;
        if (!cancelled && d.authenticated) { setTokenState(stored); await loadAll(stored); }
        else { try { localStorage.removeItem(LS_KEY); } catch { /* */ } }
      } catch { /* */ }
      if (!cancelled) setReady(true);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault(); setLoginErr(""); setLoginBusy(true);
    try {
      const r = await xhrPost("/api/admin/login", { username, password });
      if (!r.ok) { setLoginErr("Credenziali non valide"); setLoginBusy(false); return; }
      const data = await r.json() as Record<string, string>;
      const tk = data.token;
      if (!tk) { setLoginErr("Token non ricevuto"); setLoginBusy(false); return; }
      storeToken(tk);
      await loadAll(tk);
    } catch { setLoginErr("Errore di connessione"); }
    setLoginBusy(false);
  }

  function doLogout() { dropToken(); setApps([]); setCats([]); setTgts([]); setMsgs([]); setCfg({}); }

  async function saveApp() {
    if (!editApp || !token) return;
    const m = editApp.id ? "PUT" : "POST";
    const u = editApp.id ? `/api/admin/apps/${editApp.id}` : "/api/admin/apps";
    await af(token, u, { method: m, body: JSON.stringify(editApp) });
    setEditApp(null); flash("App salvata!"); loadAll(token);
  }
  async function rmApp(id: number) { if (!token) return; await af(token, `/api/admin/apps/${id}`, { method: "DELETE" }); setDelModal(null); flash("Eliminata"); loadAll(token); }
  async function saveCat() {
    if (!editCat || !token) return;
    const m = editCat.id ? "PUT" : "POST";
    const u = editCat.id ? `/api/admin/categories/${editCat.id}` : "/api/admin/categories";
    await af(token, u, { method: m, body: JSON.stringify(editCat) });
    setEditCat(null); flash("Categoria salvata!"); loadAll(token);
  }
  async function rmCat(id: number) { if (!token) return; await af(token, `/api/admin/categories/${id}`, { method: "DELETE" }); setDelModal(null); flash("Eliminata"); loadAll(token); }
  async function saveTgt() {
    if (!editTgt || !token) return;
    const m = editTgt.id ? "PUT" : "POST";
    const u = editTgt.id ? `/api/admin/targets/${editTgt.id}` : "/api/admin/targets";
    await af(token, u, { method: m, body: JSON.stringify(editTgt) });
    setEditTgt(null); flash("Target salvato!"); loadAll(token);
  }
  async function rmTgt(id: number) { if (!token) return; await af(token, `/api/admin/targets/${id}`, { method: "DELETE" }); setDelModal(null); flash("Eliminato"); loadAll(token); }
  async function readMsg(id: number) { if (!token) return; await af(token, `/api/admin/messages/${id}`, { method: "PUT" }); loadAll(token); }
  async function rmMsg(id: number) { if (!token) return; await af(token, `/api/admin/messages/${id}`, { method: "DELETE" }); setDelModal(null); loadAll(token); }
  async function saveCfg() { if (!token) return; await af(token, "/api/admin/settings", { method: "PUT", body: JSON.stringify(cfg) }); flash("Impostazioni salvate!"); }

  function addMed() {
    if (!mediaUrl.trim() || !editApp) return;
    const t = mediaUrl.match(/\.(mp4|webm|mov)/i) ? "video" : mediaUrl.match(/\.gif/i) ? "gif" : "image";
    setEditApp({ ...editApp, media: [...editApp.media, { type: t, url: mediaUrl.trim() }] });
    setMediaUrl("");
  }
  function rmMed(i: number) { if (!editApp) return; setEditApp({ ...editApp, media: editApp.media.filter((_, j) => j !== i) }); }
  function tglCat(id: number) {
    if (!editApp) return;
    const ids = editApp.categoryIds.split(",").filter(Boolean).map(Number);
    setEditApp({ ...editApp, categoryIds: (ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]).join(",") });
  }
  function tglTgt(id: number) {
    if (!editApp) return;
    const ids = editApp.targetAudienceIds.split(",").filter(Boolean).map(Number);
    setEditApp({ ...editApp, targetAudienceIds: (ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]).join(",") });
  }

  if (!ready) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" /></div>;

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card rounded-3xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2"><span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">Pannello Admin</span></h1>
        <p className="text-gray-500 text-center text-sm mb-8">gdr-sys</p>
        <form onSubmit={doLogin} className="space-y-4">
          <div><label className="block text-sm text-gray-400 mb-1">Nome utente</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-500/50" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-500/50" /></div>
          {loginErr && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{loginErr}</div>}
          <button type="submit" disabled={loginBusy} className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50">
            {loginBusy ? "Accesso in corso…" : "Accedi"}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {toast && <div className="fixed top-4 right-4 z-[60] px-5 py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium shadow-lg animate-fade-in-up">✓ {toast}</div>}

      <div className="glass-card border-b border-brand-500/10 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-bold bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">gdr-sys Admin</h1>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-sm text-gray-400 hover:text-white">Vedi Sito →</a>
          <button onClick={doLogout} className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10">Esci</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-8">
          {([["apps", "App"], ["categories", "Categorie"], ["targets", "Target"], ["messages", "Messaggi"], ["settings", "Impostazioni"]] as const).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === k ? "bg-brand-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"}`}>
              {label}
              {k === "apps" && ` (${apps.length})`}
              {k === "categories" && ` (${cats.length})`}
              {k === "targets" && ` (${tgts.length})`}
              {k === "messages" && msgs.filter(m => !m.read).length > 0 && <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">{msgs.filter(m => !m.read).length}</span>}
            </button>
          ))}
          <button onClick={() => loadAll(token)} disabled={busy} className="px-3 py-2 rounded-xl text-sm bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10 disabled:opacity-50">{busy ? "⏳" : "🔄"}</button>
        </div>

        {busy && <div className="flex items-center gap-3 mb-6 text-gray-400 text-sm"><div className="w-4 h-4 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />Caricamento…</div>}

        {/* ════════ APP ════════ */}
        {tab === "apps" && !editApp && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Web App</h2>
              <button onClick={() => setEditApp({ ...blankApp })} className="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700">+ Nuova App</button>
            </div>
            {apps.length === 0 && !busy ? <div className="glass-card rounded-xl p-10 text-center"><p className="text-gray-400 mb-4">Nessuna app ancora.</p></div> : (
              <div className="space-y-3">{apps.map(a => (
                <div key={a.id} className="glass-card rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{a.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${a.status === "published" ? "bg-emerald-500/20 text-emerald-300" : a.status === "coming_soon" ? "bg-amber-500/20 text-amber-300" : "bg-gray-500/20 text-gray-300"}`}>
                        {a.status === "published" ? "Pubblicata" : a.status === "coming_soon" ? "In arrivo" : "Bozza"}
                      </span>
                      {a.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300">⭐</span>}
                      {!a.isFree && <span className="text-xs text-cyan-400">{a.price}</span>}
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-0.5">/{a.slug}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setEditApp(a)} className="px-3 py-1.5 rounded-lg bg-white/5 text-sm hover:bg-white/10 border border-white/10">Modifica</button>
                    <button onClick={() => setDelModal({ t: "app", id: a.id })} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20">Elimina</button>
                  </div>
                </div>
              ))}</div>
            )}
          </div>
        )}

        {tab === "apps" && editApp && (
          <div className="glass-card rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editApp.id ? "Modifica App" : "Nuova App"}</h2>
              <button onClick={() => setEditApp(null)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <I l="Titolo *" v={editApp.title} s={v => setEditApp({ ...editApp, title: v })} />
              <I l="Slug *" v={editApp.slug} s={v => setEditApp({ ...editApp, slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} p="my-app" />
              <I l="URL App / GitHub" v={editApp.url || ""} s={v => setEditApp({ ...editApp, url: v })} p="https://..." />
              <I l="URL Acquisto" v={editApp.purchaseUrl || ""} s={v => setEditApp({ ...editApp, purchaseUrl: v })} p="https://..." />
              <T l="Descrizione breve (EN)" v={editApp.shortDescriptionEn} s={v => setEditApp({ ...editApp, shortDescriptionEn: v })} />
              <T l="Descrizione breve (IT)" v={editApp.shortDescriptionIt} s={v => setEditApp({ ...editApp, shortDescriptionIt: v })} />
              <T l="Descrizione completa (EN)" v={editApp.fullDescriptionEn} s={v => setEditApp({ ...editApp, fullDescriptionEn: v })} r={4} w />
              <T l="Descrizione completa (IT)" v={editApp.fullDescriptionIt} s={v => setEditApp({ ...editApp, fullDescriptionIt: v })} r={4} w />

              <div className="md:col-span-2"><label className="block text-sm text-gray-400 mb-2">Categorie (clicca per selezionare)</label>
                <div className="flex flex-wrap gap-2">{cats.map(c => {
                  const sel = editApp.categoryIds.split(",").map(Number).includes(c.id);
                  return <button key={c.id} type="button" onClick={() => tglCat(c.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sel ? "text-white shadow" : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"}`} style={sel ? { backgroundColor: c.color } : undefined}>{c.nameEn} / {c.nameIt}</button>;
                })}</div></div>

              <div className="md:col-span-2"><label className="block text-sm text-gray-400 mb-2">Target (clicca per selezionare)</label>
                <div className="flex flex-wrap gap-2">{tgts.map(t => {
                  const sel = editApp.targetAudienceIds.split(",").map(Number).includes(t.id);
                  return <button key={t.id} type="button" onClick={() => tglTgt(t.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sel ? "bg-cyan-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"}`}>{t.nameEn} / {t.nameIt}</button>;
                })}</div></div>

              <div className="md:col-span-2"><label className="block text-sm text-gray-400 mb-2">Media (immagini, video, gif tramite URL)</label>
                <div className="flex gap-2 mb-3">
                  <input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder="https://... immagine/video/gif" className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500/50" onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addMed())} />
                  <button type="button" onClick={addMed} className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm">Aggiungi</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{editApp.media.map((m, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden aspect-video bg-navy-900">
                    {m.type === "video" ? <video src={m.url} className="w-full h-full object-cover" /> :
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.url} alt="" className="w-full h-full object-cover" />}
                    <button onClick={() => rmMed(i)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    <span className="absolute bottom-1 left-1 text-xs bg-black/60 px-1.5 py-0.5 rounded text-white">{m.type}</span>
                  </div>
                ))}</div>
              </div>

              <I l="Lingue (separate da virgola)" v={editApp.languages} s={v => setEditApp({ ...editApp, languages: v })} p="en,it" />
              <div><label className="block text-sm text-gray-400 mb-1">Stato</label>
                <select value={editApp.status} onChange={e => setEditApp({ ...editApp, status: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500/50">
                  <option value="published">Pubblicata</option><option value="coming_soon">In arrivo</option><option value="draft">Bozza</option></select></div>
              <I l="Prezzo (vuoto = gratis)" v={editApp.price || ""} s={v => setEditApp({ ...editApp, price: v, isFree: !v })} p="€29.99" />
              <I l="Ordine" v={String(editApp.sortOrder)} s={v => setEditApp({ ...editApp, sortOrder: parseInt(v) || 0 })} t="number" />
              <div className="md:col-span-2 flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editApp.featured} onChange={e => setEditApp({ ...editApp, featured: e.target.checked })} className="w-4 h-4 rounded" /><span className="text-sm text-gray-300">⭐ In evidenza</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editApp.showPreview} onChange={e => setEditApp({ ...editApp, showPreview: e.target.checked })} className="w-4 h-4 rounded" /><span className="text-sm text-gray-300">Mostra anteprima</span></label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveApp} className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold hover:shadow-lg transition-all">Salva</button>
              <button onClick={() => setEditApp(null)} className="px-6 py-3 rounded-xl bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10">Annulla</button>
            </div>
          </div>
        )}

        {/* ════════ CATEGORIE ════════ */}
        {tab === "categories" && !editCat && (
          <div>
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Categorie</h2>
              <button onClick={() => setEditCat({ nameEn: "", nameIt: "", slug: "", color: "#6366f1" })} className="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm">+ Nuova</button></div>
            <div className="space-y-2">{cats.map(c => (
              <div key={c.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-wrap"><div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: c.color }} /><span className="font-medium">{c.nameEn}</span><span className="text-gray-500">/</span><span className="text-gray-400">{c.nameIt}</span><span className="text-xs text-gray-600">({c.slug})</span></div>
                <div className="flex gap-2 shrink-0"><button onClick={() => setEditCat(c)} className="px-3 py-1.5 rounded-lg bg-white/5 text-sm hover:bg-white/10 border border-white/10">Modifica</button><button onClick={() => setDelModal({ t: "cat", id: c.id })} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20">Elimina</button></div>
              </div>))}</div>
          </div>
        )}
        {tab === "categories" && editCat && (
          <div className="glass-card rounded-2xl p-6 max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editCat.id ? "Modifica" : "Nuova"} Categoria</h2>
            <div className="space-y-3">
              <I l="Nome EN" v={editCat.nameEn} s={v => setEditCat({ ...editCat, nameEn: v })} />
              <I l="Nome IT" v={editCat.nameIt} s={v => setEditCat({ ...editCat, nameIt: v })} />
              <I l="Slug" v={editCat.slug} s={v => setEditCat({ ...editCat, slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} />
              <div className="flex items-center gap-3"><label className="text-sm text-gray-400">Colore:</label><input type="color" value={editCat.color} onChange={e => setEditCat({ ...editCat, color: e.target.value })} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0" /></div>
              <div className="flex gap-3 mt-4"><button onClick={saveCat} className="px-6 py-2 rounded-xl bg-brand-600 text-white font-semibold">Salva</button><button onClick={() => setEditCat(null)} className="px-6 py-2 rounded-xl bg-white/5 text-gray-400 border border-white/10">Annulla</button></div>
            </div>
          </div>
        )}

        {/* ════════ TARGET ════════ */}
        {tab === "targets" && !editTgt && (
          <div>
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Target</h2>
              <button onClick={() => setEditTgt({ nameEn: "", nameIt: "", slug: "" })} className="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm">+ Nuovo</button></div>
            <div className="space-y-2">{tgts.map(t => (
              <div key={t.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3"><span className="font-medium">{t.nameEn}</span><span className="text-gray-500">/</span><span className="text-gray-400">{t.nameIt}</span><span className="text-xs text-gray-600">({t.slug})</span></div>
                <div className="flex gap-2 shrink-0"><button onClick={() => setEditTgt(t)} className="px-3 py-1.5 rounded-lg bg-white/5 text-sm hover:bg-white/10 border border-white/10">Modifica</button><button onClick={() => setDelModal({ t: "tgt", id: t.id })} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20">Elimina</button></div>
              </div>))}</div>
          </div>
        )}
        {tab === "targets" && editTgt && (
          <div className="glass-card rounded-2xl p-6 max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editTgt.id ? "Modifica" : "Nuovo"} Target</h2>
            <div className="space-y-3">
              <I l="Nome EN" v={editTgt.nameEn} s={v => setEditTgt({ ...editTgt, nameEn: v })} />
              <I l="Nome IT" v={editTgt.nameIt} s={v => setEditTgt({ ...editTgt, nameIt: v })} />
              <I l="Slug" v={editTgt.slug} s={v => setEditTgt({ ...editTgt, slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} />
              <div className="flex gap-3 mt-4"><button onClick={saveTgt} className="px-6 py-2 rounded-xl bg-brand-600 text-white font-semibold">Salva</button><button onClick={() => setEditTgt(null)} className="px-6 py-2 rounded-xl bg-white/5 text-gray-400 border border-white/10">Annulla</button></div>
            </div>
          </div>
        )}

        {/* ════════ MESSAGGI ════════ */}
        {tab === "messages" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Messaggi ({msgs.length})</h2>
            {msgs.length === 0 ? <p className="text-gray-500">Nessun messaggio.</p> :
              <div className="space-y-3">{msgs.map(m => (
                <div key={m.id} className={`glass-card rounded-xl p-5 ${!m.read ? "border-2 border-brand-500/30" : ""}`}>
                  <div className="flex justify-between items-start mb-2"><div><span className="font-semibold">{m.name}</span><span className="text-gray-500 text-sm ml-2">{m.email}</span>{!m.read && <span className="ml-2 text-xs bg-brand-500 text-white px-2 py-0.5 rounded-full">Nuovo</span>}</div><span className="text-xs text-gray-600">{new Date(m.createdAt).toLocaleDateString("it-IT")}</span></div>
                  {m.subject && <p className="text-sm text-gray-400 mb-1 font-medium">{m.subject}</p>}
                  <p className="text-sm text-gray-300 whitespace-pre-line">{m.message}</p>
                  <div className="flex gap-2 mt-3">{!m.read && <button onClick={() => readMsg(m.id)} className="text-xs px-3 py-1 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10">Segna come letto</button>}<button onClick={() => setDelModal({ t: "msg", id: m.id })} className="text-xs px-3 py-1 rounded-lg bg-red-500/10 text-red-400">Elimina</button></div>
                </div>
              ))}</div>}
          </div>
        )}

        {/* ════════ IMPOSTAZIONI ════════ */}
                {tab === "settings" && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Impostazioni Sito</h2>
            <div className="space-y-4">
              <I l="URL Ko-fi (donazioni)" v={cfg.kofi_url || ""} s={v => setCfg({ ...cfg, kofi_url: v })} p="https://ko-fi.com/..." />
              <I l="Titolo Hero (EN)" v={cfg.hero_title_en || ""} s={v => setCfg({ ...cfg, hero_title_en: v })} />
              <I l="Titolo Hero (IT)" v={cfg.hero_title_it || ""} s={v => setCfg({ ...cfg, hero_title_it: v })} />
              <T l="Sottotitolo Hero (EN)" v={cfg.hero_subtitle_en || ""} s={v => setCfg({ ...cfg, hero_subtitle_en: v })} />
              <T l="Sottotitolo Hero (IT)" v={cfg.hero_subtitle_it || ""} s={v => setCfg({ ...cfg, hero_subtitle_it: v })} />

              <div className="pt-4 mt-4 border-t border-white/10">
                <h3 className="text-lg font-semibold mb-3 text-brand-300">📊 Statistiche Hero</h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <I l="Stat 1 - Valore" v={cfg.stat1_value || ""} s={v => setCfg({ ...cfg, stat1_value: v })} p="10+" />
                <I l="Stat 1 - Label EN" v={cfg.stat1_label_en || ""} s={v => setCfg({ ...cfg, stat1_label_en: v })} p="Apps" />
                <I l="Stat 1 - Label IT" v={cfg.stat1_label_it || ""} s={v => setCfg({ ...cfg, stat1_label_it: v })} p="App" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <I l="Stat 2 - Valore" v={cfg.stat2_value || ""} s={v => setCfg({ ...cfg, stat2_value: v })} p="9" />
                <I l="Stat 2 - Label EN" v={cfg.stat2_label_en || ""} s={v => setCfg({ ...cfg, stat2_label_en: v })} p="Categories" />
                <I l="Stat 2 - Label IT" v={cfg.stat2_label_it || ""} s={v => setCfg({ ...cfg, stat2_label_it: v })} p="Categorie" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <I l="Stat 3 - Valore" v={cfg.stat3_value || ""} s={v => setCfg({ ...cfg, stat3_value: v })} p="3" />
                <I l="Stat 3 - Label EN" v={cfg.stat3_label_en || ""} s={v => setCfg({ ...cfg, stat3_label_en: v })} p="Coming soon" />
                <I l="Stat 3 - Label IT" v={cfg.stat3_label_it || ""} s={v => setCfg({ ...cfg, stat3_label_it: v })} p="In arrivo" />
              </div>

              <button onClick={saveCfg} className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold mt-2">Salva Impostazioni</button>
            </div>
          </div>
        )}
      </div>

      {delModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setDelModal(null)}>
          <div className="glass-card rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-3">⚠️ Conferma eliminazione</h3><p className="text-gray-400 mb-6 text-sm">Questa azione non può essere annullata.</p>
            <div className="flex gap-3">
              <button onClick={() => { if (delModal.t === "app") rmApp(delModal.id); if (delModal.t === "cat") rmCat(delModal.id); if (delModal.t === "tgt") rmTgt(delModal.id); if (delModal.t === "msg") rmMsg(delModal.id); }} className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold text-sm">Elimina</button>
              <button onClick={() => setDelModal(null)} className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 border border-white/10 text-sm">Annulla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function I({ l, v, s, p, t }: { l: string; v: string; s: (v: string) => void; p?: string; t?: string }) {
  return <div><label className="block text-sm text-gray-400 mb-1">{l}</label><input type={t || "text"} value={v} onChange={e => s(e.target.value)} placeholder={p} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500/50" /></div>;
}
function T({ l, v, s, r, w }: { l: string; v: string; s: (v: string) => void; r?: number; w?: boolean }) {
  return <div className={w ? "md:col-span-2" : ""}><label className="block text-sm text-gray-400 mb-1">{l}</label><textarea rows={r || 2} value={v} onChange={e => s(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500/50 resize-none" /></div>;
}
