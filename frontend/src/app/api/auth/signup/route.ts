import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { validateEmail, validatePassword } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json() as { email: string; password: string; name?: string };

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ message: "Please provide a valid email address" }, { status: 400 });
    }

    if (!validatePassword(password)) {
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await createUser(email, name || "", hashedPassword);
    if (!user) {
      return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
    }

    // Return success response
    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error("Sign-up error:", error);

    if (error.message?.includes("Unique constraint")) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}