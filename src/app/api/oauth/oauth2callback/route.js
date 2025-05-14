import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const ALLOW_OAUTH_SETUP = process.env.ALLOW_OAUTH_SETUP === "true";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

export async function GET(request) {
  console.log("✅ Inside /oauth2callback ...");

  if (!ALLOW_OAUTH_SETUP) {
    return new NextResponse("OAuth setup is not enabled.", { status: 403 });
  }

  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return new NextResponse("Authorization code not received.", {
      status: 400,
    });
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const TEMP_TOKEN_PATH = path.join(
      process.cwd(),
      "temp_tokens_for_setup.json"
    );
    await fs.writeFile(TEMP_TOKEN_PATH, JSON.stringify(tokens, null, 2));

    console.log("✅ Tokens acquired and saved temporarily:", tokens);

    const htmlResponse = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Authorization Successful</title>
          <style>
              body { font-family: sans-serif; text-align: center; padding: 50px; }
              code { background-color: #f0f0f0; padding: 2px 5px; border-radius: 4px; }
          </style>
      </head>
      <body>
          <h1>Authorization successful!</h1>
          <p>Your tokens have been saved to <code>${TEMP_TOKEN_PATH}</code>.</p>
          <p>You can now copy these tokens and use them in your application configuration.</p>
      </body>
      </html>
    `;

    return new NextResponse(htmlResponse, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (err) {
    console.log("❌ Failed /oauth2callback ...");
    console.error("❌ Error getting token:", err);
    return new NextResponse("Failed to retrieve access token.", {
      status: 500,
    });
  }
}
