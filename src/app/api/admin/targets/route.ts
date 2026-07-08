import { authenticateRequest } from "@/lib/auth";
import { db } from "@/db";
import { targetAudiences } from "@/db/schema";
import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await authenticateRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const targets = await db.select().from(targetAudiences).orderBy(asc(targetAudiences.id));
  return NextResponse.json(targets);
}

export async function POST(req: Request) {
  const user = await authenticateRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const result = await db.insert(targetAudiences).values({
    nameEn: body.nameEn, nameIt: body.nameIt, slug: body.slug,
  }).returning();
  return NextResponse.json(result[0]);
}
