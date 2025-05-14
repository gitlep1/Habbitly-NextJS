import { NextResponse } from "next/server";

const allowedOrigins = [
  "http://localhost:3000",
  "https://habbitly.vercel.app",
  "http://localhost:4000",
  "https://habbitly-backend.vercel.app",
];

const Middleware = async (request) => {
  console.log("=== inside middleware ===");
  const response = NextResponse.next();

  const origin = request.headers.get("origin");
  const requestUrlOrigin = request.nextUrl.origin;

  const isAllowedOrigin =
    origin === null ||
    allowedOrigins.includes(origin) ||
    origin === requestUrlOrigin;

  if (isAllowedOrigin) {
    const originToSet = origin === null ? requestUrlOrigin : origin;

    response.headers.append("Access-Control-Allow-Origin", originToSet);
    response.headers.append("Access-Control-Allow-Credentials", "true");
    response.headers.append(
      "Access-Control-Allow-Methods",
      "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    );
    response.headers.append(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );

    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: response.headers,
      });
    }
  } else {
    console.log(`=== Blocking request from disallowed origin: ${origin}`);
    return new NextResponse("Not allowed by CORS", {
      status: 403,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  return response;
};

export { Middleware as middleware };

export const config = {
  matcher: "/api/:path*",
};
