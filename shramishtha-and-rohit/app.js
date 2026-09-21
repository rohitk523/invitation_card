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

/* ---------- story timeline ----------
   An entry may carry its own photos, or a list of stops when several things
   happened on one day -- the Sunday after the engagement being four. */

const tlPhotos = (list) => list?.length
  ? `<div class="tl-photos">${list.map((p) =>
      `<img src="${p.src}" alt="${p.alt}" loading="lazy">`).join("")}</div>`
  : "";

const tlVideos = (list) => list?.length
  ? `<div class="tl-videos">${list.map((v) =>
      `<video controls preload="none" playsinline poster="${v.poster}" aria-label="${v.alt}">
         <source src="${v.src}" type="video/mp4">
       </video>`).join("")}</div>`
  : "";

const tlStops = (stops) => stops?.length
  ? `<ol class="tl-stops">${stops.map((st) => `
      <li>
        <p class="stop-time">${st.time}</p>
        <h4 class="stop-title">${st.title}</h4>
        <p class="stop-note">${st.note}</p>
        ${tlPhotos(st.photos)}
        ${tlVideos(st.videos)}
      </li>`).join("")}</ol>`
  : "";

$("timeline").innerHTML = SITE.story.map((e) => `
  <li${e.stops ? ' class="has-stops"' : ""}>
    <p class="tl-date">${e.date}</p>
    <h3 class="tl-title">${e.title}</h3>
    <p class="tl-note">${e.note}</p>
    ${tlPhotos(e.photos)}
    ${tlVideos(e.videos)}
    ${tlStops(e.stops)}
  </li>`).join("");

/* ---------- movie tickets ---------- */
function ticketPhoto(m) {
  const shots = m.photos ?? (m.photo ? [{ src: m.photo, caption: `Photo from ${m.title}` }] : []);
  if (!shots.length || !unlocked()) return "";
  /* Two across, under the poster. Clicking one opens the full-screen viewer,
     which picks these up on its own. */
  return `<div class="ticket-photos">${shots.map((p) => `
    <figure class="ticket-photo">
      <img src="${p.src}" alt="${p.caption}" loading="lazy">
      <figcaption>${p.caption}</figcaption>
    </figure>`).join("")}</div>`;
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

/* ---------- rendering ----------
   One level of access now: sign in and you see everything. The middleware
   still refuses every byte to anyone without a session. */

function unlocked() { return true; }   // signed in at all means you see it all

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
  $("with-family").hidden = false;
}

function showUs() {
  $("us-polaroids").innerHTML = polaroids(SITE.usAlbum);
  $("apology-title").textContent = SITE.apology.title;
  $("apology-body").innerHTML =
    SITE.apology.paragraphs.map((p) => `<p>${p}</p>`).join("") +
    `<p class="apology-signoff">${SITE.apology.signoff}</p>`;
  $("us-album").hidden = false;
  $("apology").hidden = false;
}

showFamily();
showUs();

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
