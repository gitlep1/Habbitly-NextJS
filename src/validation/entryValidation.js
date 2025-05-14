import { NextResponse } from "next/server";
import validator from "validator";

async function parseJsonBody(request) {
  try {
    const requestClone = request.clone();
    const body = await requestClone.json();
    return { success: true, body };
  } catch (error) {
    console.error("Failed to parse JSON body:", error);
    return { success: false, error: "Invalid JSON body" };
  }
}

export async function checkUserValues(request) {
  const bodyResult = await parseJsonBody(request);

  if (!bodyResult.success) {
    return new NextResponse(bodyResult.error, { status: 400 });
  }

  const { username, password, email } = bodyResult.body;

  const trimmedUsername = username?.trim() ?? "";
  const trimmedPassword = password?.trim() ?? "";
  const trimmedEmail = email?.trim() ?? "";

  if (trimmedUsername && trimmedPassword && trimmedEmail) {
    if (!validator.isEmail(trimmedEmail)) {
      return new NextResponse("Invalid email format", { status: 400 });
    }
    return {
      success: true,
      body: {
        username: trimmedUsername,
        password: trimmedPassword,
        email: trimmedEmail,
      },
    };
  } else {
    return new NextResponse(
      "You are missing required keys. Please make sure you have: username, password, email",
      { status: 400 }
    );
  }
}

export function createExtraEntryChecker(validFields) {
  return async (request) => {
    const bodyResult = await parseJsonBody(request);

    if (!bodyResult.success) {
      return new NextResponse(bodyResult.error, { status: 400 });
    }

    const body = bodyResult.body;

    if (!body || typeof body !== "object") {
      return new NextResponse("Invalid request body format", { status: 400 });
    }

    const extraFields = Object.keys(body).filter(
      (key) => !validFields.includes(key)
    );

    if (extraFields.length > 0) {
      return new NextResponse(
        `You have extra keys: ${extraFields.join(", ")}.`,
        {
          status: 400,
        }
      );
    }

    return { success: true, body };
  };
}

const checkUserExtraEntries = createExtraEntryChecker([
  "username",
  "password",
  "email",
]);

const checkProfileImageExtraEntries = createExtraEntryChecker([
  "user_id",
  "image_url",
  "delete_hash",
]);

export {
  checkUserValues,
  checkUserExtraEntries,
  checkProfileImageExtraEntries,
};
