import { authenticateRequest } from "@/lib/auth";
import { db } from "@/db";
import { webApps } from "@/db/schema";
import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await authenticateRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const apps = await db.select().from(webApps).orderBy(asc(webApps.sortOrder));
  return NextResponse.json(apps);
}

export async function POST(req: Request) {
  const user = await authenticateRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const result = await db.insert(webApps).values({
    title: body.title, slug: body.slug, url: body.url || null, purchaseUrl: body.purchaseUrl || null,
    shortDescriptionEn: body.shortDescriptionEn || "", shortDescriptionIt: body.shortDescriptionIt || "",
    fullDescriptionEn: body.fullDescriptionEn || "", fullDescriptionIt: body.fullDescriptionIt || "",
    categoryIds: body.categoryIds || "", targetAudienceIds: body.targetAudienceIds || "",
    media: body.media || [], languages: body.languages || "en", status: body.status || "published",
    showPreview: body.showPreview ?? true, isFree: body.isFree ?? true, price: body.price || null,
    featured: body.featured ?? false, sortOrder: body.sortOrder ?? 0,
  }).returning();
  return NextResponse.json(result[0]);
}
