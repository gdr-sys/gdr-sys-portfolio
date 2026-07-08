import { db } from "@/db";
import { webApps, categories, targetAudiences, siteSettings } from "@/db/schema";
import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const [apps, cats, targets, settings] = await Promise.all([
    db.select().from(webApps).orderBy(asc(webApps.sortOrder)),
    db.select().from(categories).orderBy(asc(categories.id)),
    db.select().from(targetAudiences).orderBy(asc(targetAudiences.id)),
    db.select().from(siteSettings),
  ]);

  const settingsMap: Record<string, string> = {};
  for (const s of settings) settingsMap[s.key] = s.value;

  return NextResponse.json({
    apps: apps.filter((a) => a.status !== "draft"),
    categories: cats,
    targets,
    settings: settingsMap,
  });
}
