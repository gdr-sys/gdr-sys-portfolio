import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameIt: text("name_it").notNull(),
  slug: text("slug").notNull().unique(),
  color: text("color").notNull().default("#6366f1"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const targetAudiences = pgTable("target_audiences", {
  id: serial("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameIt: text("name_it").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const webApps = pgTable("web_apps", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  url: text("url"),
  purchaseUrl: text("purchase_url"),
  shortDescriptionEn: text("short_description_en").notNull().default(""),
  shortDescriptionIt: text("short_description_it").notNull().default(""),
  fullDescriptionEn: text("full_description_en").notNull().default(""),
  fullDescriptionIt: text("full_description_it").notNull().default(""),
  // comma-separated category ids
  categoryIds: text("category_ids").notNull().default(""),
  // comma-separated target audience ids
  targetAudienceIds: text("target_audience_ids").notNull().default(""),
  // JSON array of media items: {type: 'image'|'video'|'gif', url: string}
  media: jsonb("media").$type<Array<{ type: string; url: string }>>().notNull().default([]),
  // supported languages for the app itself (comma-separated, e.g. "en,it,de")
  languages: text("languages").notNull().default("en"),
  status: text("status").notNull().default("published"), // published | coming_soon | draft
  showPreview: boolean("show_preview").notNull().default(true),
  isFree: boolean("is_free").notNull().default(true),
  price: text("price"),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull().default(""),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull().default(""),
});
