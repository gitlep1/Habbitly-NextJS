import { NextRequest, NextResponse } from "next/server";

import { createUser, checkUserCredentials } from "../usersQueries";

import {
  checkUserValues,
  checkUserExtraEntries,
} from "../../../../validation/entryValidation";
import { createToken } from "../../../../validation/requireAuth";

export async function POST(request) {
  const [valueChecker, entryChecker] = await Promise.all([
    checkUserValues(request),
    checkUserExtraEntries(request),
  ]);

  if (valueChecker instanceof NextResponse) return valueChecker;
  if (entryChecker instanceof NextResponse) return entryChecker;

  const newUserData = valueChecker.body;

  try {
    const checkCreds = await checkUserCredentials(
      newUserData,
      "email&username"
    );

    if (checkCreds) {
      return new NextResponse("Email/Username already taken!", { status: 409 });
    }

    const createdUser = await createUser(newUserData);

    if (!createdUser) {
      return new NextResponse("User not created", { status: 404 });
    }

    const auth = await createToken(createdUser);

    if (!auth) {
      return new NextResponse("Token not created", { status: 404 });
    }

    const userData = {
      id: createdUser.id,
      profileimg: createdUser.profileimg,
      email: createdUser.email,
      username: createdUser.username,
      theme: createdUser.theme,
      last_online: createdUser.last_online,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    if (auth.newToken) {
      headers["Authorization"] = `Bearer ${auth.newToken}`;
    }

    return new NextResponse(JSON.stringify(userData), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("users.POST /signup", { error });
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
