import { NextResponse } from "next/server";
import * as jose from "jose";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminPassword || !jwtSecret) {
      console.error("Missing required environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (password === adminPassword) {
      const secret = new TextEncoder().encode(jwtSecret);
      const token = await new jose.SignJWT({
        role: "admin",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secret);

      cookies().set("admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      return NextResponse.json(
        {
          success: true,
          message: "Authentication successful",
          token: token,
        },
        {
          status: 200,
        },
      );
    }

    console.log("Password match failed");
    return NextResponse.json(
      { error: "Invalid password" },
      {
        status: 401,
      },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        error: "An error occurred during login. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}
