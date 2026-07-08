import { db } from "@/db";
import { webApps, categories, targetAudiences } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const [apps, cats, targets] = await Promise.all([
    db.select().from(webApps).where(eq(webApps.slug, slug)),
    db.select().from(categories),
    db.select().from(targetAudiences),
  ]);

  if (apps.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    app: apps[0],
    categories: cats,
    targets,
  });
}
