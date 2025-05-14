import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const ALLOW_OAUTH_SETUP = process.env.ALLOW_OAUTH_SETUP === "true";

export async function GET(request) {
  console.log("✅ Inside /view-temp-tokens ...");

  if (!ALLOW_OAUTH_SETUP) {
    return new NextResponse("OAuth setup is not enabled.", { status: 403 });
  }

  const TEMP_TOKEN_PATH = path.join(
    process.cwd(),
    "temp_tokens_for_setup.json"
  );

  try {
    const tokens = await fs.readFile(TEMP_TOKEN_PATH, "utf8");
    const parsedTokens = JSON.parse(tokens);

    console.log("✅ Successfully read tokens from file.");
    return NextResponse.json(parsedTokens, { status: 200 });
  } catch (err) {
    console.log("❌ Failed /view-temp-tokens");
    console.error("❌ Error reading token file:", err);

    if (err.code === "ENOENT") {
      return new NextResponse(
        "Token file not found. Have you run the OAuth setup flow yet?",
        { status: 404 }
      );
    }

    return new NextResponse("Failed to read token file.", { status: 500 });
  }
}
