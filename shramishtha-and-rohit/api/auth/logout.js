import { clearCookies } from "../../lib/session.js";

export default function handler(req, res) {
  res.setHeader("Set-Cookie", clearCookies());
  res.writeHead(302, { Location: "/login", "Cache-Control": "private, no-store" });
  res.end();
}
