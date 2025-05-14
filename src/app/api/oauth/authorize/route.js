import { google } from "googleapis";
import { NextResponse } from "next/server";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const ALLOW_OAUTH_SETUP = process.env.ALLOW_OAUTH_SETUP === "true";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = [
  "https://mail.google.com",
  "https://www.googleapis.com/auth/gmail.send",
];

export async function GET(request) {
  console.log("🔑 Initiating OAuth flow...");
  console.log("✅ Inside /authorize ...");

  if (!ALLOW_OAUTH_SETUP) {
    return new NextResponse("OAuth setup is not enabled.", { status: 403 });
  }

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  console.log("✅ Redirecting to Google OAuth consent screen...");

  return NextResponse.redirect(authUrl);
}
