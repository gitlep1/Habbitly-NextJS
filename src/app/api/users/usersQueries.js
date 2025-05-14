import { db } from "../db/dbConfig.js";

const getAllUsers = async () => {
  const query = "SELECT profileimg, username, theme, last_online FROM users";
  const users = await db.any(query);
  return users;
};

const getUserByID = async (id) => {
  const query = "SELECT * FROM users WHERE id = $1";
  const user = await db.oneOrNone(query, [id]);

  if (!user) {
    return null;
  }

  return user;
};

const createUser = async (newUserData) => {
  const query =
    "INSERT INTO users (username, password, email, created_at) VALUES ($1, $2, $3, NOW())  RETURNING id, profileimg, username, theme, last_online";
  const newUser = await db.oneOrNone(query, [
    newUserData.username,
    newUserData.password,
    newUserData.email,
  ]);
  return newUser;
};

const updateUser = async (id, updatedUserData) => {
  const query =
    "UPDATE users SET profileimg = $1, username = $2, password = $3, email = $4, updated_at = NOW(), last_online = $5 WHERE id = $6 RETURNING id, profileimg, username, email, last_online";
  const updateUser = await db.oneOrNone(query, [
    updatedUserData.profileimg,
    updatedUserData.username,
    updatedUserData.password,
    updatedUserData.email,
    updatedUserData.last_online,
    id,
  ]);
  return updateUser;
};

const deleteUser = async (id) => {
  if (id === null || id === undefined) {
    return false;
  }

  const query =
    "DELETE FROM users WHERE id = $1 RETURNING id, profileimg, username";
  const deletedUser = await db.oneOrNone(query, id);
  return deletedUser;
};

// prettier-ignore
const checkUserCredentials = async (userData, checker) => {
  if (checker === "email") {
    const query = `SELECT id FROM users WHERE email = $1`;
    const userCredentials = await db.oneOrNone(query, userData.email);
    return userCredentials;

  } else if (checker === "email&username") {
    console.log("=== checkUserCredentials", { userData, checker }, "===");

    const query = `SELECT id FROM users WHERE email = $1 OR username = $2`;
    const userCredentials = await db.oneOrNone(query, [
      userData.email,
      userData.username,
    ]);
    return userCredentials;

  } else if (checker === "email&password") {
    const query = `SELECT id FROM users WHERE email = $1 AND password = $2`;
    const userCredentials = await db.oneOrNone(query, [
      userData.email,
      userData.password
    ]);
    return userCredentials;
  }
};

export {
  getAllUsers,
  getUserByID,
  createUser,
  updateUser,
  deleteUser,
  checkUserCredentials,
};
