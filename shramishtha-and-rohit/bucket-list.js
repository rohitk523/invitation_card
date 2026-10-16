/* The list, and the ticking of it.

   A tick is kept in the browser that made it. There is nowhere on this site to
   put one otherwise -- the content is files in the repo and the only API reads,
   it never writes -- so a tick made on his phone does not appear on hers. That
   is worth knowing before trusting it with a list you both keep. */

const $ = (id) => document.getElementById(id);

const safe = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[c]));

const STORE = "rs.bucket.v1";

/* Private windows, blocked site data and thumbnail capture all make storage
   throw rather than return nothing, so every touch of it is guarded. The page
   has to work with none of it. */
function readTicks() {
  try {
    return JSON.parse(localStorage.getItem(STORE) || "{}") || {};
  } catch {
    return {};
  }
}

function writeTicks(ticks) {
  try {
    localStorage.setItem(STORE, JSON.stringify(ticks));
  } catch {
    /* Nothing to do about it, and nothing worth interrupting them over. */
  }
}

function list(items, ticks) {
  if (!items?.length) {
    return `<li class="ticks-empty">Nothing on this half of the list yet.</li>`;
  }
  return items.map((it) => `
    <li class="tick">
      <label class="tick-row">
        <input type="checkbox" class="tick-input" data-id="${safe(it.id)}"
               ${ticks[it.id] ? "checked" : ""}>
        <span class="tick-box" aria-hidden="true"></span>
        <span class="tick-text">${safe(it.text)}</span>
      </label>
      ${it.note ? `<p class="tick-note">${safe(it.note)}</p>` : ""}
    </li>`).join("");
}

function render() {
  const ticks = readTicks();
  const her = SITE.bucket.shramishtha;
  const his = SITE.bucket.rohit;

  $("her-line").textContent = her.line ?? "";
  $("his-line").textContent = his.line ?? "";
  $("ticks-shramishtha").innerHTML = list(her.items, ticks);
  $("ticks-rohit").innerHTML = list(his.items, ticks);

  for (const li of document.querySelectorAll(".tick")) {
    li.classList.toggle("is-done", !!li.querySelector(".tick-input")?.checked);
  }
}

/* One listener for the whole page rather than one per row, so rows that are
   added to data.js later need nothing here. */
document.addEventListener("change", (e) => {
  const box = e.target.closest(".tick-input");
  if (!box) return;
  const ticks = readTicks();
  if (box.checked) ticks[box.dataset.id] = true;
  else delete ticks[box.dataset.id];
  writeTicks(ticks);
  box.closest(".tick")?.classList.toggle("is-done", box.checked);
});

render();

$("print-btn").addEventListener("click", () => window.print());
