import { NextResponse } from "next/server";

// NextAuth has been disabled - using custom Django authentication instead
export async function GET() {
  return NextResponse.json(
    { error: "NextAuth endpoint disabled. Use /api/auth/login or /api/auth/logout" },
    { status: 404 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "NextAuth endpoint disabled. Use /api/auth/login or /api/auth/logout" },
    { status: 404 }
  );
}