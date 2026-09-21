/* Renders content from data.js, runs the countdown, guards the album. */

const $ = (id) => document.getElementById(id);

/* ---------- countdown ---------- */
const ENGAGEMENT = new Date(SITE.engagementISO);
const WEDDING = new Date(SITE.weddingISO);

function currentTarget(now) {
  if (now < ENGAGEMENT) {
    return { when: ENGAGEMENT, label: "Until our Engagement", date: SITE.engagementLine };
  }
  if (now < WEDDING) {
    return { when: WEDDING, label: "Until we say forever", date: SITE.weddingLine };
  }
  return null; // married!
}

function two(n) { return String(n).padStart(2, "0"); }

function tick() {
  const now = new Date();
  const target = currentTarget(now);
  if (!target) {
    const days = Math.floor((now - WEDDING) / 86400000);
    $("hero-eyebrow").textContent = "happily ever after";
    $("count-label").textContent = "Married";
    $("count-date").textContent = `${days} day${days === 1 ? "" : "s"} of forever, and counting`;
    $("countdown").hidden = true;
    return;
  }
  const diff = target.when - now;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000) % 24;
  const m = Math.floor(diff / 60000) % 60;
  const s = Math.floor(diff / 1000) % 60;
  $("cd-d").textContent = d;
  $("cd-h").textContent = two(h);
  $("cd-m").textContent = two(m);
  $("cd-s").textContent = two(s);
  $("count-label").textContent = target.label;
  $("count-date").textContent = target.date;
  setTimeout(tick, 1000 - (Date.now() % 1000));
}
tick();

/* ---------- story timeline ---------- */
$("timeline").innerHTML = SITE.story.map((e) => `
  <li>
    <p class="tl-date">${e.date}</p>
    <h3 class="tl-title">${e.title}</h3>
    <p class="tl-note">${e.note}</p>
    ${e.photos ? `<div class="tl-photos">${e.photos.map((p) =>
      `<img src="${p.src}" alt="${p.alt}" loading="lazy">`).join("")}</div>` : ""}
  </li>`).join("");

/* ---------- movie tickets ---------- */
function ticketPhoto(m) {
  const shots = m.photos ?? (m.photo ? [{ src: m.photo, caption: `Photo from ${m.title}` }] : []);
  if (!shots.length || !unlocked()) return "";
  return shots.map((p) => `
    <figure class="ticket-photo">
      <img src="${p.src}" alt="${p.caption}" loading="lazy">
      <figcaption>${p.caption}</figcaption>
    </figure>`).join("");
}
function ticketPoster(m) {
  if (!m.poster) return "";
  return `<div class="ticket-poster"><img src="${m.poster}" alt="Our poster art for ${m.title}" loading="lazy"></div>`;
}
function renderTickets() {
  $("tickets").innerHTML = SITE.movies.map((m) => `
    <article class="ticket">
      <div class="ticket-head">
        <span class="ticket-admit">Admit Two</span>
        <span class="ticket-seat">Seats ${m.seats ?? "R &amp; S"}</span>
      </div>
      ${ticketPoster(m)}
      <h3 class="ticket-title">${m.title}</h3>
      <p class="ticket-date">${m.date}</p>
      ${m.venue ? `<p class="ticket-venue">${m.venue}</p>` : ""}
      <p class="ticket-note">${m.note}</p>
      ${ticketPhoto(m)}
    </article>`).join("");
}
renderTickets();

/* ---------- her gallery (public) ---------- */
$("her-line").textContent = SITE.her.line;
$("her-polaroids").innerHTML = SITE.her.photos.map((p, i) => `
  <figure class="polaroid" style="--tilt:${i % 2 ? 2 : -2}deg">
    <img src="${p.src}" alt="${p.caption}" loading="lazy">
    <figcaption>${p.caption}</figcaption>
  </figure>`).join("");

/* ---------- the engagement reel ---------- */
$("reel-line").textContent = SITE.reel.line;
$("reel-frame").innerHTML = `
  <video controls preload="metadata" playsinline
         poster="${SITE.reel.poster}" aria-label="${SITE.reel.caption}">
    <source src="${SITE.reel.src}" type="video/mp4">
    Your browser can't play this one — the file is ${SITE.reel.src}.
  </video>
  <figcaption>${SITE.reel.caption}</figcaption>`;

/* ---------- what this visitor may see ----------
   The server already decided this before a single byte was served. The cookie
   below is only a hint for what to draw -- the real enforcement is in
   middleware.js, and data-us.js / photos/us/ simply 404 for anyone else. */

function tier() {
  const m = document.cookie.match(/(?:^|;\s*)rs_tier=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "family";
}
function unlocked() { return true; }   // signed in at all == the family album

function polaroids(list) {
  const tilts = [-2.4, 1.8, -1.2, 2.6, -2, 1.4, -1.8, 2.2];
  return list.map((p, i) => `
    <figure class="polaroid" style="--tilt:${tilts[i % tilts.length]}deg">
      <img src="${p.src}" alt="${p.caption}" loading="lazy">
      <figcaption>${p.caption}</figcaption>
    </figure>`).join("");
}

function showFamily() {
  $("with-family-line").textContent = SITE.withFamily.line;
  $("with-family-polaroids").innerHTML = polaroids(SITE.withFamily.photos);
  $("with-family-moments").innerHTML = (SITE.withFamily.moments ?? []).map((m) => `
    <article class="moment">
      <p class="moment-title">${m.title}</p>
      <p class="moment-text">${m.text}</p>
    </article>`).join("");
  $("fixing-day-line").textContent = SITE.fixingDay.line;
  $("fixing-day-polaroids").innerHTML = polaroids(SITE.fixingDay.photos);
  $("with-family").hidden = false;
  $("fixing-day").hidden = false;
}

function showUs() {
  $("us-polaroids").innerHTML = polaroids(US.usAlbum);
  $("hands-line").textContent = US.hands.line;
  $("hands-row").innerHTML = US.hands.photos.map((p) => `
    <figure class="polaroid">
      <img src="${p.src}" alt="Our hands, together — ${p.caption}" loading="lazy">
      <figcaption>${p.caption}</figcaption>
    </figure>`).join("");
  $("apology-title").textContent = US.apology.title;
  $("apology-body").innerHTML =
    US.apology.paragraphs.map((p) => `<p>${p}</p>`).join("") +
    `<p class="apology-signoff">${US.apology.signoff}</p>`;
  $("us-album").hidden = false;
  $("hands").hidden = false;
  $("apology").hidden = false;
  document.querySelector('.nav-links a[href="#hands"]').hidden = false;
}

/* Fetched rather than hard-linked in the page: for anyone but the two of them
   this request is refused, and there is nothing to render. */
function loadUsContent() {
  return new Promise((resolve, reject) => {
    const tag = document.createElement("script");
    tag.src = "data-us.js";
    tag.onload = resolve;
    tag.onerror = () => reject(new Error("not permitted"));
    document.head.appendChild(tag);
  });
}

showFamily();
if (tier() === "us") {
  loadUsContent().then(showUs).catch(() => { /* not ours to show */ });
}

/* ---------- songs / places / letters ---------- */
$("songs-list").innerHTML = SITE.songs.length
  ? SITE.songs.map((s) => `
      <li>
        <span class="song-icon">♪</span>
        <span class="song-title">${s.title}</span>
        <span class="song-note">${s.note}</span>
      </li>`).join("")
  : `<li class="songs-empty">We haven&rsquo;t chosen our first song yet. The list begins the day we do. ♪</li>`;

/* ---------- letters ----------
   The text lives on the server and is refused until the date passes, so the
   seal is real rather than drawn on. */
function letterCard(l) {
  const when = new Date(`${l.openOn}T00:00:00+05:30`)
    .toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return `
    <article class="letter${l.sealed ? " is-sealed" : ""}" data-id="${l.id}">
      <div class="letter-seal">${l.from[0]}</div>
      <p class="letter-from">From ${l.from}</p>
      <p class="letter-note">${l.note}</p>
      <p class="letter-when">${l.sealed ? `opens ${when}` : `opened ${when}`}</p>
      ${l.sealed ? "" : `<button type="button" class="letter-open">Read it</button>`}
      <div class="letter-body" hidden></div>
    </article>`;
}

async function renderLetters() {
  if (tier() !== "us") {
    $("letters-list").innerHTML =
      `<p class="letters-note">The sealed letters are behind the other door.</p>`;
    return;
  }
  try {
    const r = await fetch("/api/letter", { credentials: "include" });
    if (!r.ok) throw new Error("refused");
    const { letters } = await r.json();
    $("letters-list").innerHTML = letters.map(letterCard).join("");
  } catch {
    $("letters-list").innerHTML = `<p class="letters-note">Couldn't fetch the letters just now.</p>`;
  }
}

$("letters-list").addEventListener("click", async (ev) => {
  const btn = ev.target.closest(".letter-open");
  if (!btn) return;
  const card = btn.closest(".letter");
  btn.disabled = true;
  const r = await fetch(`/api/letter?id=${encodeURIComponent(card.dataset.id)}`,
                        { credentials: "include" });
  const data = await r.json();
  const body = card.querySelector(".letter-body");
  body.innerHTML = r.ok
    ? data.body.map((para) => `<p>${para}</p>`).join("")
    : `<p>${data.error === "still sealed" ? "Not yet." : "Couldn't open that one."}</p>`;
  body.hidden = false;
  btn.remove();
});

renderLetters();

/* ---------- print ----------
   Everything is on one page already, so the browser's own print-to-PDF is the
   whole feature; the stylesheet does the work. */
$("print-btn").addEventListener("click", () => window.print());
