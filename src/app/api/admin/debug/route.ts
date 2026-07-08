import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  
  let tokenFromQuery: string | null = null;
  try {
    const url = new URL(req.url);
    tokenFromQuery = url.searchParams.get("token");
  } catch { /* ignore */ }

  const token = tokenFromQuery || (authHeader ? authHeader.replace(/^Bearer\s+/i, "") : null);
  let tokenInfo = null;
  if (token) {
    tokenInfo = verifyToken(token);
  }

  return NextResponse.json({
    hasAuthHeader: !!authHeader,
    hasQueryToken: !!tokenFromQuery,
    tokenInfo,
  });
}
