import { loginUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const token = await loginUser(username, password);

    if (!token) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error("[Admin API] Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
