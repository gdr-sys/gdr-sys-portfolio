import * as bcryptjs from "bcryptjs";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

const SECRET = process.env.SESSION_SECRET || "gdr-sys-secret-2024-x9k2m";

function computeHash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h = ((h << 5) - h) + c;
    h = h & h;
  }
  return Math.abs(h).toString(36);
}

export function createToken(username: string): string {
  const ts = Date.now().toString();
  const hash = computeHash(`${username}|${ts}|${SECRET}`);
  return Buffer.from(`${username}:${ts}:${hash}`).toString("base64");
}

export function verifyToken(token: string): { username: string; valid: boolean } {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length < 3) return { username: "", valid: false };
    const username = parts[0];
    const ts = parts[1];
    const hash = parts[2];
    const age = Date.now() - parseInt(ts);
    if (age > 7 * 24 * 60 * 60 * 1000) return { username, valid: false };
    const expected = computeHash(`${username}|${ts}|${SECRET}`);
    if (hash !== expected) return { username: "", valid: false };
    return { username, valid: true };
  } catch {
    return { username: "", valid: false };
  }
}

export async function loginUser(username: string, password: string): Promise<string | null> {
  const users = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
  if (users.length === 0) return null;
  const valid = await bcryptjs.compare(password, users[0].passwordHash);
  if (!valid) return null;
  return createToken(username);
}

/**
 * Extract token from URL query param OR Authorization header OR POST body,
 * verify it, check user exists.
 */
export async function authenticateRequest(req: Request): Promise<string | null> {
  let token: string | null = null;

  // 1. Try query parameter ?token=xxx
  try {
    const url = new URL(req.url);
    token = url.searchParams.get("token");
  } catch { /* ignore */ }

  // 2. Try Authorization header as fallback
  if (!token) {
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      token = authHeader.replace(/^Bearer\s+/i, "");
    }
  }

  // 3. Try x-admin-token header as another fallback
  if (!token) {
    token = req.headers.get("x-admin-token");
  }

  if (!token) return null;

  const { username, valid } = verifyToken(token);
  if (!valid) return null;

  const users = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
  if (users.length === 0) return null;
  return username;
}
