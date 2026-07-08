import { authenticateRequest } from "@/lib/auth";
import { db } from "@/db";
import { targetAudiences } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await authenticateRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const result = await db.update(targetAudiences).set({
    nameEn: body.nameEn, nameIt: body.nameIt, slug: body.slug,
  }).where(eq(targetAudiences.id, parseInt(id))).returning();
  return NextResponse.json(result[0]);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await authenticateRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.delete(targetAudiences).where(eq(targetAudiences.id, parseInt(id)));
  return NextResponse.json({ success: true });
}
