/* Full-screen photo viewer: click any picture, then walk the whole page
   one frame at a time — arrows, keyboard, or a swipe.

   The list is rebuilt from the DOM every time it opens, so photos behind a
   closed gate are never reachable, and newly unlocked ones join in without
   anything here needing to know the gates exist. */

const LB_PHOTOS = ".tl-photos img, .polaroid img, .ticket-photo img, .ticket-poster img";
const SWIPE_MIN = 48;   // px before a drag counts as a swipe

/* ---------- the viewer's own markup ---------- */
document.body.insertAdjacentHTML("beforeend", `
<div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="Photo viewer">
  <div class="lb-bar">
    <p class="lb-count" aria-live="polite">
      <span id="lb-i">1</span><span class="lb-slash">/</span><span id="lb-n">1</span>
    </p>
    <button type="button" class="lb-close" id="lb-close" aria-label="Close viewer">&times;</button>
  </div>
  <button type="button" class="lb-nav lb-prev" id="lb-prev" aria-label="Previous photo">&#8249;</button>
  <figure class="lb-stage">
    <img id="lb-img" alt="">
    <figcaption class="lb-cap" id="lb-cap"></figcaption>
  </figure>
  <button type="button" class="lb-nav lb-next" id="lb-next" aria-label="Next photo">&#8250;</button>
</div>`);

const lb = {
  root: document.getElementById("lb"),
  img: document.getElementById("lb-img"),
  cap: document.getElementById("lb-cap"),
  i: document.getElementById("lb-i"),
  n: document.getElementById("lb-n"),
  prev: document.getElementById("lb-prev"),
  next: document.getElementById("lb-next"),
  close: document.getElementById("lb-close"),
};

let shots = [];       // the photos currently reachable
let at = 0;           // where we are in that list
let lastFocus = null; // so Esc returns you where you were

/* ---------- gathering ---------- */

/* A photo inside a [hidden] section is behind a gate — leave it out. */
const visible = (img) => !img.closest("[hidden]");

/* A figure with no figcaption is deliberately uncaptioned -- the viewer stays
   quiet for it. A bare photo, like the ones in the timeline, has only its alt. */
function captionOf(img) {
  const fig = img.closest("figure");
  if (fig) return fig.querySelector("figcaption")?.textContent.trim() || "";
  return img.alt || "";
}

function gather() {
  return [...document.querySelectorAll(LB_PHOTOS)].filter(visible);
}

/* Photos are reachable by keyboard too, not just mouse. */
function markReachable() {
  for (const img of gather()) {
    if (img.dataset.lbReady) continue;
    img.dataset.lbReady = "1";
    img.tabIndex = 0;
    img.setAttribute("role", "button");
  }
}
markReachable();
/* Sections render late (and again on unlock) — pick up whatever appears. */
new MutationObserver(markReachable).observe(document.body, { childList: true, subtree: true });

/* ---------- showing ---------- */

function preload(i) {
  const img = shots[i];
  if (img) new Image().src = img.currentSrc || img.src;
}

function show(i) {
  at = Math.max(0, Math.min(i, shots.length - 1));
  const src = shots[at];

  lb.img.classList.add("is-loading");
  lb.img.src = src.currentSrc || src.src;
  lb.img.alt = src.alt || "";
  lb.cap.textContent = captionOf(src);
  lb.i.textContent = at + 1;
  lb.n.textContent = shots.length;

  lb.prev.disabled = at === 0;
  lb.next.disabled = at === shots.length - 1;

  preload(at + 1);
  preload(at - 1);
}

lb.img.addEventListener("load", () => lb.img.classList.remove("is-loading"));

function openAt(img) {
  shots = gather();
  const i = shots.indexOf(img);
  if (i < 0) return;

  lastFocus = document.activeElement;
  show(i);
  lb.root.hidden = false;
  document.body.classList.add("lb-open");
  lb.close.focus();
}

function shut() {
  lb.root.hidden = true;
  lb.img.removeAttribute("src");
  document.body.classList.remove("lb-open");
  lastFocus?.focus?.();
}

const step = (d) => show(at + d);

/* ---------- input ---------- */

document.addEventListener("click", (ev) => {
  const img = ev.target.closest(LB_PHOTOS);
  if (img && visible(img)) { ev.preventDefault(); openAt(img); }
});

document.addEventListener("keydown", (ev) => {
  /* Enter/Space on a focused photo opens it. */
  if (lb.root.hidden) {
    if (ev.key !== "Enter" && ev.key !== " ") return;
    const img = document.activeElement?.closest?.(LB_PHOTOS);
    if (img && visible(img)) { ev.preventDefault(); openAt(img); }
    return;
  }
  switch (ev.key) {
    case "Escape":     shut(); break;
    case "ArrowRight": step(1); break;
    case "ArrowLeft":  step(-1); break;
    case "Home":       show(0); break;
    case "End":        show(shots.length - 1); break;
    case "Tab":        trapFocus(ev); return;
    default: return;
  }
  ev.preventDefault();
});

/* Keep Tab inside the viewer while it's open. */
function trapFocus(ev) {
  const stops = [lb.close, lb.prev, lb.next].filter((b) => !b.disabled);
  const first = stops[0];
  const last = stops[stops.length - 1];
  if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
  else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
}

lb.prev.addEventListener("click", () => step(-1));
lb.next.addEventListener("click", () => step(1));
lb.close.addEventListener("click", shut);

/* Clicking the dark surround closes; clicking the photo itself doesn't. */
lb.root.addEventListener("click", (ev) => {
  if (ev.target === lb.root || ev.target.classList.contains("lb-stage")) shut();
});

/* ---------- swipe ---------- */
let touch = null;
lb.root.addEventListener("touchstart", (ev) => {
  const t = ev.changedTouches[0];
  touch = { x: t.clientX, y: t.clientY };
}, { passive: true });

lb.root.addEventListener("touchend", (ev) => {
  if (!touch) return;
  const t = ev.changedTouches[0];
  const dx = t.clientX - touch.x;
  const dy = t.clientY - touch.y;
  touch = null;
  if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy)) return;
  step(dx < 0 ? 1 : -1);
}, { passive: true });
