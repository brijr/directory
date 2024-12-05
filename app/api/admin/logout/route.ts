import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  // Remove the authentication cookie
  cookies().delete("admin-token");

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL));
}
