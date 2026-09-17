/* The front door.
   Runs at the edge before any file is served, so a photo URL on its own is
   never enough -- every request for anything carries a verified session or it
   doesn't get bytes. */

import { next } from "@vercel/edge";
import { COOKIE, TIER, allows, cookiesFor, issue, readCookie, verify, worthRenewing }
  from "./lib/session.js";

export const config = {
  /* Everything except Vercel's own internals. The login page and the auth
     endpoints are let through by name below, so the default here is "guard it". */
  matcher: ["/((?!_vercel/).*)"],
};

/* The only things a stranger may fetch. */
const OPEN = new Set(["/login", "/login.html", "/favicon.ico"]);
const isOpen = (path) => OPEN.has(path) || path.startsWith("/api/auth/");

/* Content that belongs to the two of them alone, whatever else you signed in as. */
const usOnly = (path) =>
  path === "/data-us.js" || path.startsWith("/photos/us/");

function deny(req, path) {
  /* An asset request gets a plain 401 -- bouncing an <img> to an HTML login
     page would just paint a broken image. A page request gets the door. */
  const accepts = req.headers.get("accept") || "";
  if (!accepts.includes("text/html")) {
    return new Response("Not authorised", {
      status: 401,
      headers: { "cache-control": "private, no-store" },
    });
  }
  const to = new URL("/login", req.url);
  if (path && path !== "/") to.searchParams.set("next", path);
  return new Response(null, {
    status: 302,
    headers: { location: to.toString(), "cache-control": "private, no-store" },
  });
}

export default async function middleware(req) {
  const { pathname } = new URL(req.url);
  if (isOpen(pathname)) return next();

  const secret = process.env.SESSION_SECRET;
  /* No secret configured means we cannot tell friend from stranger.
     Refuse everyone rather than quietly serving the album to the internet. */
  if (!secret) {
    return new Response("Site is not configured for sign-in yet.", {
      status: 503,
      headers: { "cache-control": "private, no-store" },
    });
  }

  const claims = await verify(readCookie(req.headers.get("cookie"), COOKIE), secret);
  if (!claims) return deny(req, pathname);
  if (usOnly(pathname) && !allows(claims, TIER.US)) return deny(req, pathname);

  const headers = new Headers({ "cache-control": "private, no-store" });

  /* Renew on page views only -- doing it per asset would re-stamp the cookie
     dozens of times for one page load, to no purpose. */
  const isPage = (req.headers.get("accept") || "").includes("text/html");
  if (isPage && worthRenewing(claims)) {
    const { token } = await issue(claims.sub, claims.tier, secret);
    for (const c of cookiesFor(token, claims.tier)) headers.append("set-cookie", c);
  }

  return next({ headers });
}
