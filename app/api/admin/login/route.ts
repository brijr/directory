import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log('Attempting login...');
    console.log('Admin password from env:', adminPassword);

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD not set in environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (password === adminPassword) {
      console.log('Password match successful');
      const cookieExpiry = 60 * 60 * 24; // 24 hours

      const cookieStore = cookies();
      cookieStore.set("admin_authenticated", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: cookieExpiry,
        path: "/",
      });

      console.log('Cookie set successfully');

      return new NextResponse(
        JSON.stringify({
          success: true,
          message: "Authentication successful"
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('Password match failed');
    return new NextResponse(
      JSON.stringify({ error: "Invalid password" }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new NextResponse(
      JSON.stringify({ error: "An error occurred during login. Please try again." }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
