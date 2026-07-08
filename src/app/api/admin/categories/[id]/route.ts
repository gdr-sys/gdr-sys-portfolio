import { authenticateRequest } from "@/lib/auth";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await authenticateRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const result = await db.update(categories).set({
    nameEn: body.nameEn, nameIt: body.nameIt, slug: body.slug, color: body.color,
  }).where(eq(categories.id, parseInt(id))).returning();
  return NextResponse.json(result[0]);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await authenticateRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.delete(categories).where(eq(categories.id, parseInt(id)));
  return NextResponse.json({ success: true });
}
