import { authenticateRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const username = await authenticateRequest(req);
  return NextResponse.json({ authenticated: !!username, username });
}
