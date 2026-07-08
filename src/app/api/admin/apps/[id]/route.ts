import { authenticateRequest } from "@/lib/auth";
import { db } from "@/db";
import { webApps } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await authenticateRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const result = await db.update(webApps).set({
    title: body.title, slug: body.slug, url: body.url || null, purchaseUrl: body.purchaseUrl || null,
    shortDescriptionEn: body.shortDescriptionEn || "", shortDescriptionIt: body.shortDescriptionIt || "",
    fullDescriptionEn: body.fullDescriptionEn || "", fullDescriptionIt: body.fullDescriptionIt || "",
    categoryIds: body.categoryIds || "", targetAudienceIds: body.targetAudienceIds || "",
    media: body.media || [], languages: body.languages || "en", status: body.status || "published",
    showPreview: body.showPreview ?? true, isFree: body.isFree ?? true, price: body.price || null,
    featured: body.featured ?? false, sortOrder: body.sortOrder ?? 0, updatedAt: new Date(),
  }).where(eq(webApps.id, parseInt(id))).returning();
  return NextResponse.json(result[0]);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await authenticateRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.delete(webApps).where(eq(webApps.id, parseInt(id)));
  return NextResponse.json({ success: true });
}
