/* Draws the promises each of them has made. The text is printed exactly as it
   was written -- no tidying, no sentence case, no stripped emoji. */

const $ = (id) => document.getElementById(id);

/* Written by hand and dropped straight into a template, so anything that looks
   like markup has to stop looking like it before it reaches the page. */
const safe = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[c]));

function vows(list, waitingFor) {
  if (!list?.length) {
    return `<li class="vows-empty">Nothing here yet — ${safe(waitingFor)}.</li>`;
  }
  return list.map((v) => `
    <li class="vow">
      <p class="vow-text">${safe(v.text)}</p>
      ${v.when ? `<p class="vow-when">${safe(v.when)}</p>` : ""}
    </li>`).join("");
}

$("vows-rohit").innerHTML = vows(SITE.promises.rohit, "his first one goes here");
$("vows-shramishtha").innerHTML =
  vows(SITE.promises.shramishtha, "waiting on hers");

$("print-btn").addEventListener("click", () => window.print());
