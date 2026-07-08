import { NextResponse } from "next/server";

export async function POST() {
  // Token-based auth: client just deletes the token from localStorage
  return NextResponse.json({ success: true });
}
