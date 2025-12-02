import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { validateEmail } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as { email: string; password: string };

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ message: "Please provide a valid email address" }, { status: 400 });
    }

    // Find the user
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Return success response (without sensitive data)
    return NextResponse.json({
      message: "Authentication successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Sign-in error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Optional: handle other methods
export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
