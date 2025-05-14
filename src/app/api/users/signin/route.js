import { NextRequest, NextResponse } from "next/server";

import { getUserByID, checkUserCredentials } from "../usersQueries";

import { createToken } from "../../../../validation/requireAuth";

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return new NextResponse("Missing email or password.", { status: 400 });
  }

  try {
    const checkCreds = await checkUserCredentials(
      { email, password },
      "email&password"
    );

    if (!checkCreds) {
      return new NextResponse("Invalid credentials.", { status: 401 });
    }

    const getUserData = await getUserByID(checkCreds.id);

    if (!getUserData) {
      return new NextResponse(`Data for: ${checkCreds.id} not found`, {
        status: 404,
      });
    }

    const auth = await createToken(getUserData);

    if (!auth || !auth.newToken) {
      return new NextResponse("Token creation failed.", { status: 404 });
    }

    const userData = {
      id: getUserData.id,
      profileimg: getUserData.profileimg,
      email: getUserData.email,
      username: getUserData.username,
      theme: getUserData.theme,
      last_online: getUserData.last_online,
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
    console.error("users.POST /signin", { error });
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
