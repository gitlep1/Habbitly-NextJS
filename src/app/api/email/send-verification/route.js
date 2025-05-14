import { NextRequest, NextResponse } from "next/server";

import crypto from "crypto";

import { createTransporter } from "../../../../Utils/emailUtil";
import { generateCode } from "../../../../Utils/codeGenerator";

import { createEmailVerification } from "../emailAuthQueries";

import { checkUserCredentials } from "../../users/usersQueries";

export async function POST(request) {
  const body = await request.json();
  const { email } = body;

  try {
    const userExists = await checkUserCredentials({ email }, "email");

    if (userExists) {
      return new NextResponse("User already exists.", { status: 400 });
    }

    const transporter = await createTransporter();
    const code = generateCode();

    if (!transporter) {
      console.error("ERROR /api/email/send-verification", {
        error: `Failed to create transporter. Transported returned: ${transporter}`,
      });
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    const createdEmailAuth = await createEmailVerification(email, hashedCode);

    const mailOptions = {
      from: `<${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: "Habbitly Verification Code",
      text: `Your verification code is: ${code}`,
    };

    if (createdEmailAuth) {
      await transporter.sendMail(mailOptions);
      return new NextResponse(
        "Verification code sent to the specified email address.",
        { status: 200 }
      );
    } else {
      return new NextResponse("Failed to send verification code.", {
        status: 500,
      });
    }
  } catch (error) {
    console.error("ERROR /api/email/send-verification", { error });
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
