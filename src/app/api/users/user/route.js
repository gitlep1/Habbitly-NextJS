import { NextRequest, NextResponse } from "next/server";

import { getUserByID } from "../usersQueries";

import {
  checkUserValues,
  checkUserExtraEntries,
} from "../../../../validation/entryValidation";
import { authenticateRequest } from "../../../../validation/requireAuth";

export async function GET(request) {
  const auth = await authenticateRequest(request);

  if (auth.status !== 200) {
    return new NextResponse(JSON.stringify(auth), {
      status: auth.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const user = await getUserByID(auth.user.decodedUser.id);

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const userData = {
      id: user.id,
      profileimg: user.profileimg,
      email: user.email,
      username: user.username,
      theme: user.theme,
      last_online: user.last_online,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    if (auth.newToken) {
      headers["Authorization"] = `Bearer ${auth.newToken}`;
    }

    return new NextResponse(JSON.stringify({ payload: userData }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("ERROR users.GET /:id", { error });
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
