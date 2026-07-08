import { authenticateRequest } from "@/lib/auth";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await authenticateRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const messages = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  return NextResponse.json(messages);
}
