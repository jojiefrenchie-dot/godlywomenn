import { NextResponse } from "next/server";

// This catch-all route should not handle any requests
// All user detail requests should go to /api/user/[userId] instead
// This route exists only to prevent conflicts with NextAuth routes

export async function GET() {
  return NextResponse.json(
    { error: 'Use /api/user/[userId] instead' },
    { status: 404 }
  );
}
