import { NextRequest, NextResponse } from "next/server";

const COLLECTOR =
  process.env.NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL?.replace(/\/$/, "") ||
  "http://localhost:9090";

export const config = {
  matcher: "/collect/:path*",
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathAfterCollect = pathname.replace(/^\/collect\/?/, "");
  const search = request.nextUrl.search;
  const url = `${COLLECTOR}${pathAfterCollect ? `/${pathAfterCollect}` : ""}${search}`;

  const spCookie = request.cookies.get("sp")?.value;
  const headers = new Headers();
  headers.set(
    "Content-Type",
    request.headers.get("content-type") || "application/json",
  );
  if (spCookie) {
    headers.set("Cookie", `sp=${spCookie}`);
  }

  const body =
    request.method === "POST" ? await request.arrayBuffer() : undefined;

  const collectorRes = await fetch(url, {
    method: request.method,
    headers,
    body,
  });

  const responseBody = await collectorRes.arrayBuffer();
  const response = new NextResponse(responseBody, {
    status: collectorRes.status,
    headers: {
      "Content-Type":
        collectorRes.headers.get("content-type") || "text/plain",
      "Access-Control-Allow-Origin": request.headers.get("origin") || "*",
      "Access-Control-Allow-Credentials": "true",
    },
  });

  const rawSetCookies = collectorRes.headers.getSetCookie?.() ?? [];
  for (const cookie of rawSetCookies) {
    const match = cookie.match(/^sp=([^;]+)/);
    if (match) {
      response.cookies.set("sp", match[1], {
        path: "/",
        maxAge: 63072000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
    }
  }

  return response;
}
