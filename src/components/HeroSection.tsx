export type Locale = "en" | "it";

export const translations = {
  en: {
    nav: {
      home: "Home",
      apps: "Apps",
      contact: "Contact",
      support: "Support the Project",
      admin: "Admin",
    },
    hero: {
      badge: "Open Source Portfolio",
      cta: "Explore Apps",
      ctaSecondary: "Support the Project",
    },
    filter: {
      all: "All",
      status: "Status",
      published: "Published",
      comingSoon: "Coming Soon",
    },
    app: {
      openApp: "Open App",
      buyNow: "Buy Now",
      comingSoon: "Coming Soon",
      inDevelopment: "In Development",
      free: "Free",
      featured: "Featured",
      languages: "Languages",
      targetAudience: "For",
      categories: "Categories",
      backToApps: "Back to Apps",
      viewProject: "View Project",
      gallery: "Gallery",
    },
    contact: {
      title: "Get in Touch",
      subtitle: "Have a question, suggestion, or just want to say hello? Send us a message!",
      name: "Your Name",
      email: "Your Email",
      subject: "Subject",
      message: "Message",
      send: "Send Message",
      success: "Message sent successfully!",
      error: "Error sending message. Please try again.",
      namePlaceholder: "John Doe",
      emailPlaceholder: "john@example.com",
      subjectPlaceholder: "What's this about?",
      messagePlaceholder: "Tell us what's on your mind...",
    },
    support: {
      title: "Support the Project",
      subtitle: "If you enjoy these tools, consider buying me a coffee!",
    },
    footer: {
      rights: "All rights reserved.",
      madeWith: "Made with ❤️ by gdr-sys",
    },
  },
  it: {
    nav: {
      home: "Home",
      apps: "App",
      contact: "Contatti",
      support: "Supporta il Progetto",
      admin: "Admin",
    },
    hero: {
      badge: "Portfolio Open Source",
      cta: "Esplora le App",
      ctaSecondary: "Supporta il Progetto",
    },
    filter: {
      all: "Tutte",
      status: "Stato",
      published: "Pubblicate",
      comingSoon: "In Arrivo",
    },
    app: {
      openApp: "Apri l'App",
      buyNow: "Acquista",
      comingSoon: "In Arrivo",
      inDevelopment: "In Sviluppo",
      free: "Gratis",
      featured: "In Evidenza",
      languages: "Lingue",
      targetAudience: "Per",
      categories: "Categorie",
      backToApps: "Torna alle App",
      viewProject: "Vedi Progetto",
      gallery: "Galleria",
    },
    contact: {
      title: "Contattaci",
      subtitle: "Hai una domanda, un suggerimento o vuoi solo salutare? Mandaci un messaggio!",
      name: "Il tuo Nome",
      email: "La tua Email",
      subject: "Oggetto",
      message: "Messaggio",
      send: "Invia Messaggio",
      success: "Messaggio inviato con successo!",
      error: "Errore nell'invio. Riprova.",
      namePlaceholder: "Mario Rossi",
      emailPlaceholder: "mario@esempio.com",
      subjectPlaceholder: "Di cosa si tratta?",
      messagePlaceholder: "Dicci cosa hai in mente...",
    },
    support: {
      title: "Supporta il Progetto",
      subtitle: "Se ti piacciono questi strumenti, offrimi un caffè!",
    },
    footer: {
      rights: "Tutti i diritti riservati.",
      madeWith: "Fatto con ❤️ da gdr-sys",
    },
  },
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale] || translations.en;
}
