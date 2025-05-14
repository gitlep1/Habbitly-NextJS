import * as jose from "jose";

const getSecretKey = async () => {
  return new TextEncoder().encode(process.env.JWT_SECRET);
};

export async function createToken(payload, expiresIn = "30d") {
  const key = await getSecretKey();
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .setIssuedAt()
    .sign(key);
}

export async function verifyToken(token) {
  const key = await getSecretKey();
  try {
    const { payload, protectedHeader } = await jose.jwtVerify(token, key);
    return { payload, protectedHeader };
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      console.warn("JWT expired.");
    }
    throw error;
  }
}

export function decodeToken(token) {
  try {
    return jose.decodeJwt(token);
  } catch (error) {
    throw error;
  }
}

export async function authenticateRequest(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader)
    return { status: 401, error: "Authorization header missing" };

  const token = authHeader.split(" ")[1];
  if (!token) return { status: 401, error: "Bearer token missing" };

  try {
    const { payload } = await verifyToken(token);
    return { status: 200, user: { token, decodedUser: payload.user } };
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      const expiredPayload = decodeToken(token);
      if (!expiredPayload?.user) {
        return { status: 403, error: "Expired token is invalid" };
      }

      const newPayload = {
        user: expiredPayload.user,
        scopes: ["read:user", "write:user"],
      };

      const newToken = await createToken(newPayload, "30d");

      return {
        status: 200,
        user: {
          token: newToken,
          decodedUser: expiredPayload.user,
        },
        newToken,
      };
    }

    return { status: 403, error: "Invalid or malformed token" };
  }
}
