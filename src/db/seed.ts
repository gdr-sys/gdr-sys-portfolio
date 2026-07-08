import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { categories, targetAudiences, webApps, adminUsers, siteSettings } from "./schema";
import * as bcryptjs from "bcryptjs";

async function seed() {
  const pool = new Pool({ connectionString: "postgresql://postgres:postgres@127.0.0.1:5432/app_db" });
  const db = drizzle(pool);

  // Clear existing data
  await db.delete(siteSettings);
  await db.delete(webApps);
  await db.delete(categories);
  await db.delete(targetAudiences);
  await db.delete(adminUsers);

  // Create admin user: admin / GdrSys2024!
  const hash = await bcryptjs.hash("GdrSys2024!", 12);
  await db.insert(adminUsers).values({ username: "admin", passwordHash: hash });

  // Categories
  const cats = await db.insert(categories).values([
    { nameEn: "RPG", nameIt: "GDR", slug: "rpg", color: "#8b5cf6" },
    { nameEn: "Sports", nameIt: "Sport", slug: "sports", color: "#06b6d4" },
    { nameEn: "Utility", nameIt: "Utility", slug: "utility", color: "#10b981" },
    { nameEn: "Tools", nameIt: "Strumenti", slug: "tools", color: "#f59e0b" },
    { nameEn: "Cooking", nameIt: "Cucina", slug: "cooking", color: "#ef4444" },
    { nameEn: "Compendium", nameIt: "Compendio", slug: "compendium", color: "#ec4899" },
    { nameEn: "Management", nameIt: "Gestionale", slug: "management", color: "#3b82f6" },
    { nameEn: "Productivity", nameIt: "Produttività", slug: "productivity", color: "#14b8a6" },
    { nameEn: "Education", nameIt: "Educazione", slug: "education", color: "#a855f7" },
  ]).returning();

  const catMap: Record<string, number> = {};
  for (const c of cats) catMap[c.slug] = c.id;

  // Target Audiences
  const targets = await db.insert(targetAudiences).values([
    { nameEn: "Players", nameIt: "Giocatori", slug: "players" },
    { nameEn: "Dungeon Masters", nameIt: "Dungeon Master", slug: "dungeon-masters" },
    { nameEn: "Sports Clubs", nameIt: "Società Sportive", slug: "sports-clubs" },
    { nameEn: "Coaches", nameIt: "Allenatori", slug: "coaches" },
    { nameEn: "Everyone", nameIt: "Tutti", slug: "everyone" },
    { nameEn: "Developers", nameIt: "Sviluppatori", slug: "developers" },
    { nameEn: "Students", nameIt: "Studenti", slug: "students" },
  ]).returning();

  const tgtMap: Record<string, number> = {};
  for (const t of targets) tgtMap[t.slug] = t.id;

  // WebApps
  await db.insert(webApps).values([
    {
      title: "7th Sea Dice Roller",
      slug: "7th-sea-dice-roller",
      url: "https://gdr-sys.github.io/7th-sea-dice-roller/",
      shortDescriptionEn: "A specialized dice roller for the 7th Sea RPG system with dramatic flair.",
      shortDescriptionIt: "Un dice roller specifico per il sistema di gioco 7th Sea con stile drammatico.",
      fullDescriptionEn: "Roll dice with style using this dedicated 7th Sea dice roller. Features include raise counting, exploding 10s, and a beautiful thematic interface that captures the swashbuckling spirit of the game. Perfect for both in-person and online sessions.",
      fullDescriptionIt: "Tira i dadi con stile usando questo dice roller dedicato a 7th Sea. Include conteggio dei rilanci, esplosione dei 10 e un'interfaccia tematica bellissima che cattura lo spirito avventuroso del gioco. Perfetto per sessioni sia dal vivo che online.",
      categoryIds: [catMap["rpg"], catMap["tools"]].join(","),
      targetAudienceIds: [tgtMap["players"], tgtMap["dungeon-masters"]].join(","),
      media: [
        { type: "image", url: "/images/apps/dice-roller.jpg" },
      ],
      languages: "en,it",
      status: "published",
      isFree: true,
      featured: true,
      sortOrder: 1,
    },
    {
      title: "Torneo Volley Manager",
      slug: "torneo-volley-manager",
      url: "https://torneo-volley.pages.dev/landing",
      purchaseUrl: "https://gdr-sys.lemonsqueezy.com/checkout/buy/762a8624-7eb2-4890-9c5d-d59bf64edd49?discount=0",
      shortDescriptionEn: "Complete volleyball tournament management platform for clubs and organizers.",
      shortDescriptionIt: "Piattaforma completa per la gestione di tornei di pallavolo per club e organizzatori.",
      fullDescriptionEn: "The ultimate volleyball tournament management solution. Create brackets, manage teams, track scores in real-time, and generate standings automatically. Designed for sports clubs, tournament organizers, and volleyball enthusiasts who need a professional tool.",
      fullDescriptionIt: "La soluzione definitiva per la gestione dei tornei di pallavolo. Crea tabelloni, gestisci squadre, traccia i punteggi in tempo reale e genera classifiche automaticamente. Progettato per società sportive, organizzatori di tornei e appassionati di pallavolo.",
      categoryIds: [catMap["sports"], catMap["management"]].join(","),
      targetAudienceIds: [tgtMap["sports-clubs"], tgtMap["coaches"]].join(","),
      media: [
        { type: "image", url: "/images/apps/volleyball.jpg" },
      ],
      languages: "it",
      status: "published",
      isFree: false,
      price: "€29.99",
      featured: true,
      sortOrder: 2,
    },
    {
      title: "Scheda Interattiva 7th Sea",
      slug: "scheda-7th-sea-interattiva",
      url: "https://gdr-sys.github.io/Scheda-7th-sea-interattiva/",
      shortDescriptionEn: "Interactive character sheet for 7th Sea players with auto-calculations.",
      shortDescriptionIt: "Scheda del personaggio interattiva per giocatori di 7th Sea con calcoli automatici.",
      fullDescriptionEn: "A fully interactive digital character sheet for 7th Sea 2nd Edition. Auto-calculates derived stats, tracks wounds, manages advantages and backgrounds. Save and load characters with ease. No more erasing and rewriting on paper!",
      fullDescriptionIt: "Una scheda del personaggio digitale completamente interattiva per 7th Sea 2a Edizione. Calcola automaticamente le statistiche derivate, traccia le ferite, gestisce vantaggi e background. Salva e carica i personaggi con facilità.",
      categoryIds: [catMap["rpg"], catMap["utility"]].join(","),
      targetAudienceIds: [tgtMap["players"]].join(","),
      media: [
        { type: "image", url: "/images/apps/character-sheet.jpg" },
      ],
      languages: "it",
      status: "published",
      isFree: true,
      featured: true,
      sortOrder: 3,
    },
    {
      title: "Compendio Incantesimi Homebrew",
      slug: "compendio-incantesimi-homebrew",
      url: "https://gdr-sys.github.io/Compendio-incantesimi-homebrew/",
      shortDescriptionEn: "A curated collection of homebrew spells with advanced search and filters.",
      shortDescriptionIt: "Una raccolta curata di incantesimi homebrew con ricerca avanzata e filtri.",
      fullDescriptionEn: "Browse, search, and discover custom homebrew spells organized by school, level, and class. Features detailed spell descriptions, casting components, and damage calculations. Perfect for DMs looking to spice up their campaigns.",
      fullDescriptionIt: "Sfoglia, cerca e scopri incantesimi homebrew personalizzati organizzati per scuola, livello e classe. Include descrizioni dettagliate degli incantesimi, componenti di lancio e calcoli dei danni. Perfetto per i DM che vogliono arricchire le loro campagne.",
      categoryIds: [catMap["rpg"], catMap["compendium"]].join(","),
      targetAudienceIds: [tgtMap["dungeon-masters"], tgtMap["players"]].join(","),
      media: [
        { type: "image", url: "/images/apps/scout.jpg" },
      ],
      languages: "it",
      status: "published",
      isFree: true,
      featured: false,
      sortOrder: 4,
    },
    {
      title: "Scout Pallavolo",
      slug: "scout-pallavolo",
      url: "https://gdr-sys.github.io/Scout-pallavolo/",
      shortDescriptionEn: "Volleyball scouting app for collecting match statistics and player performance data.",
      shortDescriptionIt: "App di scouting per la pallavolo per raccogliere statistiche delle partite e dati sulle prestazioni dei giocatori.",
      fullDescriptionEn: "A comprehensive volleyball scouting tool for coaches and analysts. Record player actions in real-time, generate performance reports, track statistics across matches, and identify patterns. Export data for deeper analysis.",
      fullDescriptionIt: "Uno strumento di scouting completo per la pallavolo per allenatori e analisti. Registra le azioni dei giocatori in tempo reale, genera report sulle prestazioni, traccia le statistiche tra le partite e identifica pattern. Esporta i dati per un'analisi più approfondita.",
      categoryIds: [catMap["sports"], catMap["utility"]].join(","),
      targetAudienceIds: [tgtMap["coaches"], tgtMap["sports-clubs"]].join(","),
      media: [
        { type: "image", url: "/images/apps/scout.jpg" },
      ],
      languages: "it",
      status: "published",
      isFree: true,
      featured: false,
      sortOrder: 5,
    },
    {
      title: "Achtung! Cthulhu Dice Roller",
      slug: "achtung-cthulhu-dice-roller",
      url: "https://gdr-sys.github.io/Achtung-Cthulhu-Dice-Roller/",
      shortDescriptionEn: "Themed dice roller for Achtung! Cthulhu with atmospheric effects.",
      shortDescriptionIt: "Dice roller tematico per Achtung! Cthulhu con effetti atmosferici.",
      fullDescriptionEn: "Dive into the horrors of WWII meets Lovecraft with this atmospheric dice roller. Features the 2d20 system mechanics, momentum tracking, and eerie visual effects that set the mood for your Achtung! Cthulhu sessions.",
      fullDescriptionIt: "Immergiti negli orrori della Seconda Guerra Mondiale incontra Lovecraft con questo dice roller atmosferico. Include le meccaniche del sistema 2d20, tracciamento del momentum ed effetti visivi inquietanti che creano l'atmosfera per le tue sessioni di Achtung! Cthulhu.",
      categoryIds: [catMap["rpg"], catMap["tools"]].join(","),
      targetAudienceIds: [tgtMap["players"], tgtMap["dungeon-masters"]].join(","),
      media: [
        { type: "image", url: "/images/apps/dice-roller.jpg" },
      ],
      languages: "en,it",
      status: "published",
      isFree: true,
      featured: false,
      sortOrder: 6,
    },
    {
      title: "Ricettario Digitale",
      slug: "ricettario-digitale",
      url: "https://gdr-sys.github.io/Ricettario/",
      shortDescriptionEn: "A beautiful interactive digital recipe book for your favorite dishes.",
      shortDescriptionIt: "Un bellissimo ricettario digitale interattivo per i tuoi piatti preferiti.",
      fullDescriptionEn: "Organize your recipes in a modern digital cookbook. Add ingredients, steps, cooking times, and photos. Search and filter by category, difficulty, or preparation time. Never lose a recipe again!",
      fullDescriptionIt: "Organizza le tue ricette in un moderno ricettario digitale. Aggiungi ingredienti, passaggi, tempi di cottura e foto. Cerca e filtra per categoria, difficoltà o tempo di preparazione. Non perdere mai più una ricetta!",
      categoryIds: [catMap["utility"], catMap["cooking"]].join(","),
      targetAudienceIds: [tgtMap["everyone"]].join(","),
      media: [
        { type: "image", url: "/images/apps/volleyball.jpg" },
      ],
      languages: "it",
      status: "published",
      isFree: true,
      featured: false,
      sortOrder: 7,
    },
    {
      title: "Image Optimizer Pro",
      slug: "image-optimizer-pro",
      url: "https://github.com/gdr-sys/Image-Optimizer-Pro/",
      shortDescriptionEn: "Compress, rename, and watermark thousands of images directly in your browser.",
      shortDescriptionIt: "Comprimi, rinomina e applica watermark a migliaia di immagini direttamente nel browser.",
      fullDescriptionEn: "A powerful browser-based image optimization tool. Batch compress, rename, and apply watermarks to thousands of images without uploading them to any server. Your images stay private and processing is lightning fast.",
      fullDescriptionIt: "Un potente strumento di ottimizzazione immagini basato su browser. Comprimi in batch, rinomina e applica watermark a migliaia di immagini senza caricarle su nessun server. Le tue immagini restano private e l'elaborazione è velocissima.",
      categoryIds: [catMap["utility"], catMap["tools"]].join(","),
      targetAudienceIds: [tgtMap["everyone"], tgtMap["developers"]].join(","),
      media: [],
      languages: "en",
      status: "coming_soon",
      showPreview: true,
      isFree: true,
      featured: false,
      sortOrder: 8,
    },
    {
      title: "Arcane Card Forge",
      slug: "arcane-card-forge",
      url: "https://github.com/gdr-sys/Arcane-Card-Forge/",
      shortDescriptionEn: "Create stunning custom RPG cards with beautiful templates and effects.",
      shortDescriptionIt: "Crea splendide carte RPG personalizzate con template e effetti bellissimi.",
      fullDescriptionEn: "Design and generate custom cards for your RPG campaigns. Choose from multiple templates, add artwork, stats, and descriptions. Export as print-ready PDFs or share digitally with your party.",
      fullDescriptionIt: "Progetta e genera carte personalizzate per le tue campagne RPG. Scegli tra molteplici template, aggiungi artwork, statistiche e descrizioni. Esporta come PDF pronti per la stampa o condividi digitalmente con il tuo gruppo.",
      categoryIds: [catMap["rpg"], catMap["tools"]].join(","),
      targetAudienceIds: [tgtMap["dungeon-masters"], tgtMap["players"]].join(","),
      media: [],
      languages: "en",
      status: "coming_soon",
      showPreview: true,
      isFree: true,
      featured: false,
      sortOrder: 9,
    },
    {
      title: "DM Toolkit",
      slug: "dm-toolkit",
      url: "https://github.com/gdr-sys/dm-toolkit",
      shortDescriptionEn: "The ultimate toolkit for Dungeon Masters — encounters, NPCs, loot, and more.",
      shortDescriptionIt: "Il toolkit definitivo per Dungeon Master — incontri, PNG, bottino e altro.",
      fullDescriptionEn: "Everything a Dungeon Master needs in one place. Generate random encounters, create NPCs on the fly, roll for loot tables, manage initiative trackers, and keep session notes organized. Your digital DM screen.",
      fullDescriptionIt: "Tutto ciò di cui un Dungeon Master ha bisogno in un unico posto. Genera incontri casuali, crea PNG al volo, tira per le tabelle del bottino, gestisci i tracker dell'iniziativa e mantieni gli appunti di sessione organizzati. Il tuo schermo da DM digitale.",
      categoryIds: [catMap["rpg"], catMap["tools"]].join(","),
      targetAudienceIds: [tgtMap["dungeon-masters"]].join(","),
      media: [],
      languages: "en,it",
      status: "coming_soon",
      showPreview: true,
      isFree: true,
      featured: false,
      sortOrder: 10,
    },
  ]);

  // Site settings
  await db.insert(siteSettings).values([
    { key: "kofi_url", value: "https://ko-fi.com/noemimarcolini" },
    { key: "site_title", value: "gdr-sys" },
    { key: "hero_title_en", value: "WebApps for RPG, Sports & More" },
    { key: "hero_title_it", value: "WebApp per GDR, Sport & Altro" },
    { key: "hero_subtitle_en", value: "Modern digital tools for players, Dungeon Masters, sports clubs, coaches, and everyone." },
    { key: "hero_subtitle_it", value: "Strumenti digitali moderni per giocatori, Dungeon Master, società sportive, allenatori e tutti." },
  ]);

  console.log("✅ Seeding complete!");
  await pool.end();
}

seed().catch(console.error);
