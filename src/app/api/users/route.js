import { NextRequest, NextResponse } from "next/server";

import {
  getAllUsers,
  getUserByID,
  updateUser,
  deleteUser,
} from "./usersQueries";

import { checkUserExtraEntries } from "../../../validation/entryValidation";
import { authenticateRequest } from "../../../validation/requireAuth";

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
    const allUsers = await getAllUsers();
    console.log("=== GET all users", allUsers, "===");

    const headers = {
      "Content-Type": "application/json",
    };

    if (auth.newToken) {
      headers["Authorization"] = `Bearer ${auth.newToken}`;
    }

    if (allUsers) {
      return new NextResponse(JSON.stringify(allUsers), {
        status: 200,
        headers,
      });
    } else {
      return new NextResponse("Cannot find any users", { status: 404 });
    }
  } catch (error) {
    console.error("ERROR users.GET /", { error });
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await authenticateRequest(request);

  if (auth.status !== 200) {
    return new NextResponse(JSON.stringify(auth), {
      status: auth.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const entryCheck = await checkUserExtraEntries(request);
  if (entryCheck instanceof NextResponse) return entryCheck;

  const { user } = auth;
  const userID = user?.id;

  if (!userID) {
    return new NextResponse("Unauthorized: no user ID found", { status: 401 });
  }

  try {
    const body = await request.json();

    const { username, password, email, theme } = body;

    const existingUser = await getUserByID(userID);
    if (!existingUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const updatedUserData = {
      profileimg: existingUser.profileimg,
      username: username || existingUser.username,
      password: password || existingUser.password,
      email: email || existingUser.email,
      theme: theme || existingUser.theme,
      last_online: new Date(),
    };

    const updatedUser = await updateUser(userID, updatedUserData);

    if (updatedUser) {
      console.log("=== PUT /user", updatedUser, "===");
      return NextResponse.json({ payload: updatedUser }, { status: 200 });
    } else {
      return new NextResponse("Update failed", { status: 404 });
    }
  } catch (error) {
    console.error("ERROR users.PUT /user", { error });
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = await authenticateRequest(request);

  if (auth.status !== 200) {
    return new NextResponse(JSON.stringify(auth), {
      status: auth.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { user } = auth;
  const userID = user?.id;

  if (!userID) {
    return new NextResponse("Unauthorized: no user ID found", { status: 401 });
  }

  try {
    const userToDelete = await getUserByID(userID);
    if (!userToDelete) {
      return new NextResponse(`ID: ${userID}\nERROR: user does not exist.`, {
        status: 404,
      });
    }

    const deletedUser = await deleteUser(userID);

    if (deletedUser) {
      console.log("=== DELETE /user", deletedUser, "===");
      return new NextResponse(
        `ID: ${deletedUser.id}\nUser: ${deletedUser.username}\nSUCCESS: user has been deleted.`,
        { status: 200 }
      );
    } else {
      return new NextResponse("Delete failed", { status: 500 });
    }
  } catch (error) {
    console.error("users.DELETE /user", { error });
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
