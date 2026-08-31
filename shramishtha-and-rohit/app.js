/* Renders content from data.js, runs the countdown, guards the album. */

const $ = (id) => document.getElementById(id);

/* ---------- countdown ---------- */
const ENGAGEMENT = new Date(SITE.engagementISO);
const WEDDING = new Date(SITE.weddingISO);

function currentTarget(now) {
  if (now < ENGAGEMENT) {
    return { when: ENGAGEMENT, label: "Until our Saakharpuda", date: SITE.engagementLine };
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
  </li>`).join("");

/* ---------- movie tickets ---------- */
function ticketPhoto(m) {
  if (!m.photo || !unlocked()) return "";
  return `<div class="ticket-photo"><img src="${m.photo}" alt="Photo from ${m.title}" loading="lazy"></div>`;
}
function renderTickets() {
  $("tickets").innerHTML = SITE.movies.map((m) => `
    <article class="ticket">
      <div class="ticket-head">
        <span class="ticket-admit">Admit Two</span>
        <span class="ticket-seat">Seats R &amp; S</span>
      </div>
      <h3 class="ticket-title">${m.title}</h3>
      <p class="ticket-date">${m.date}</p>
      <p class="ticket-note">${m.note}</p>
      ${ticketPhoto(m)}
    </article>`).join("");
}
renderTickets();

/* ---------- two-tier gates: family album, then just-us ---------- */
const FAMILY_KEY = "rs-album-open";
const US_KEY = "rs-us-open";
const flag = {
  get: (k) => { try { return localStorage.getItem(k) === "yes"; } catch { return false; } },
  set: (k) => { try { localStorage.setItem(k, "yes"); } catch { /* private mode is fine */ } },
};
function unlocked() { return flag.get(FAMILY_KEY); }

function polaroids(list) {
  const tilts = [-2.4, 1.8, -1.2, 2.6, -2, 1.4, -1.8, 2.2];
  return list.map((p, i) => `
    <figure class="polaroid" style="--tilt:${tilts[i % tilts.length]}deg">
      <img src="${p.src}" alt="${p.caption}" loading="lazy">
      <figcaption>${p.caption}</figcaption>
    </figure>`).join("");
}

function openFamily() {
  $("polaroids").innerHTML = polaroids(SITE.familyAlbum);
  renderTickets();
  $("gallery").hidden = false;
  $("us-gate").hidden = flag.get(US_KEY);
  $("gate-card").hidden = true;
  $("gate-open").hidden = false;
}

function openUs() {
  $("us-polaroids").innerHTML = polaroids(SITE.usAlbum);
  $("hands-line").textContent = SITE.hands.line;
  $("hands-row").innerHTML = SITE.hands.photos.map((p) => `
    <figure class="polaroid">
      <img src="${p.src}" alt="Our hands, together — ${p.caption}" loading="lazy">
      <figcaption>${p.caption}</figcaption>
    </figure>`).join("");
  $("us-album").hidden = false;
  $("hands").hidden = false;
  $("us-gate").hidden = true;
}

if (flag.get(FAMILY_KEY)) openFamily();
if (flag.get(FAMILY_KEY) && flag.get(US_KEY)) openUs();

$("gate-form").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const answer = $("gate-input").value.trim();
  if (SITE.flowerAnswer.test(answer)) {
    flag.set(FAMILY_KEY);
    openFamily();
    document.getElementById("gallery").scrollIntoView({ behavior: "smooth" });
  } else {
    const card = $("gate-card");
    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
    $("gate-hint").textContent = "Not quite — think of our favourite spring flower…";
    $("gate-input").select();
  }
});

$("us-gate-form").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const digits = $("us-gate-input").value.replace(/\D/g, "");
  if (digits === SITE.usAnswer) {
    flag.set(US_KEY);
    openUs();
    document.getElementById("us-album").scrollIntoView({ behavior: "smooth" });
  } else {
    const card = $("us-gate-card");
    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
    $("us-gate-hint").textContent = "This door stays shut. It only opens for two people.";
    $("us-gate-input").select();
  }
});

/* ---------- songs / places / letters ---------- */
$("songs-list").innerHTML = SITE.songs.map((s) => `
  <li>
    <span class="song-icon">♪</span>
    <span class="song-title">${s.title}</span>
    <span class="song-note">${s.note}</span>
  </li>`).join("");

$("places-list").innerHTML = SITE.places.map((p) => `
  <div class="place">
    <span class="place-name">${p.name}</span>
    <span class="place-note">${p.note}</span>
  </div>`).join("");

$("letters-list").innerHTML = SITE.letters.map((l) => `
  <article class="letter">
    <div class="letter-seal">${l.from[0]}</div>
    <p class="letter-from">From ${l.from}</p>
    <p class="letter-note">${l.note}</p>
  </article>`).join("");
