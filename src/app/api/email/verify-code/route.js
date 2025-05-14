import { NextRequest, NextResponse } from "next/server";

import crypto from "crypto";

import {
  getEmailVerification,
  deleteEmailVerification,
} from "../emailAuthQueries";

export async function POST(request) {
  const body = await request.json();
  const { email, code } = body;

  try {
    const emailVerification = await getEmailVerification(email);

    if (!emailVerification) {
      return new NextResponse("Invalid email or code.", { status: 400 });
    }

    const { code: storedHashedCode, created_at } = emailVerification;
    const expiresAt = new Date(created_at.getTime() + 5 * 60 * 1000);

    const hashedInputCode = crypto
      .createHash("sha256")
      .update(code)
      .digest("hex");

    if (!hashedInputCode !== storedHashedCode) {
      return new NextResponse("Invalid verification code.", { status: 400 });
    }

    if (new Date() > expiresAt) {
      await deleteEmailVerification(email);
      return new NextResponse("Verification code has expired.", {
        status: 400,
      });
    }

    return new NextResponse("Verification successful.", { status: 200 });
  } catch (error) {
    console.error("ERROR /api/email/verify-code", { error });
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
