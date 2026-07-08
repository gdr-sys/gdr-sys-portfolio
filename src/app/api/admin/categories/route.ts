import { authenticateRequest } from "@/lib/auth";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await authenticateRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const cats = await db.select().from(categories).orderBy(asc(categories.id));
  return NextResponse.json(cats);
}

export async function POST(req: Request) {
  const user = await authenticateRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const result = await db.insert(categories).values({
    nameEn: body.nameEn, nameIt: body.nameIt, slug: body.slug, color: body.color || "#6366f1",
  }).returning();
  return NextResponse.json(result[0]);
}
