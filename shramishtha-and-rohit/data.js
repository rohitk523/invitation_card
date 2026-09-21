// Content everyone who signs in may see.
// The just-us material lives in data-us.js, which the server only
// serves to a verified Google account — never put it back in here.
// Entries marked [sample] are placeholders waiting for the real story.
const SITE = {
  bride: "Shramishtha",
  groom: "Rohit",
  engagementISO: "2026-09-13T12:00:00+05:30",
  weddingISO: "2027-01-29T00:00:00+05:30", // muhurat time TBC
  engagementLine: "Sunday, 13 September 2026 · Hotel NeelKamal, Beed",
  weddingLine: "Friday, 29 January 2027",

  story: [
    {
      date: "5 June 2026",
      title: "Hai Jawani Toh Ishq Hona Hai",
      note: "Anjali Cinema Hall. Great seats, greater company — and the great moonlight-versus-double-roast-coffee discovery.",
    },
    {
      date: "21 June 2026",
      title: "The families said yes",
      note: "Chhatrapati Sambhajinagar — both homes, elders and cousins in one room. By evening, the wedding was fixed.",
    },
    {
      date: "28 June 2026",
      title: "The venue hunt begins",
      note: "A trip to Fort View Adventure Resort, scouting where forever might start.",
    },
    {
      date: "9 August 2026",
      title: "Ohh My Dog",
      note: "INOX, Prozone Mall. We skipped Spider-Man — and somewhere in that dark hall, the first movie hand-hold. Goosebumps.",
    },
    {
      date: "30 August 2026",
      title: "The apology roses",
      note: "We hit a rough patch — sharp words, messages I wish I could unsend. The roses were how I said the truest thing: I'm sorry, and I choose us. She forgave me — once the roses cleared quality inspection. I'm told the matter can still be reopened as evidence in any future argument.",
    },
    {
      date: "13 September 2026",
      title: "The Engagement",
      note: "The ring, the promise, the beginning — Hotel NeelKamal, Beed. It happened, and it was perfect.",
      photos: [
        { src: "photos/engagement/e1.jpg", alt: "The ceremony — her pink saree, his arms around her" },
        { src: "photos/engagement/e2.jpg", alt: "Seated together at the ceremony" },
        { src: "photos/engagement/e5.jpg", alt: "A kiss on her hand" },
        { src: "photos/engagement/e3.jpg", alt: "Reception — lavender gown and black tux, arm in arm" },
        { src: "photos/engagement/e7.jpg", alt: "Walking together at the reception" },
        { src: "photos/engagement/e8.jpg", alt: "Her twirl in the lavender gown" },
      ],
    },
    {
      date: "20 September 2026",
      title: "The First Weekend After the Engagement",
      note: "One week married-to-be, and we spent the Sunday proving we could still out-walk each other. A Jyotirlinga, two rock-cut wonders, a fort, a headset and a crime thriller.",
    },
    {
      date: "20 September 2026 · 1:55 pm",
      title: "Ghrishneshwar Temple",
      note: "The twelfth Jyotirlinga, and the first one we have stood in front of together. Eleven to go — we are treating that as an itinerary rather than a statistic.",
      photos: [
        { src: "photos/day/ghrishneshwar-1.jpg", alt: "Ghrishneshwar Temple" },
        { src: "photos/day/ghrishneshwar-2.jpg", alt: "Ghrishneshwar Temple" },
      ],
    },
    {
      date: "20 September 2026 · 2:40 pm",
      title: "Ellora Caves",
      note: "Carved straight down into the rock by people with considerably more patience than the two of us have between us.",
      photos: [
        { src: "photos/day/ellora-1.jpg", alt: "Ellora Caves" },
        { src: "photos/day/ellora-2.jpg", alt: "Ellora Caves" },
        { src: "photos/day/ellora-3.jpg", alt: "Ellora Caves" },
        { src: "photos/day/ellora-4.jpg", alt: "Ellora Caves" },
        { src: "photos/day/ellora-5.jpg", alt: "Ellora Caves" },
        { src: "photos/day/ellora-6.jpg", alt: "Ellora Caves" },
      ],
      videos: [
        { src: "media/day-ellora.mp4", poster: "media/day-ellora-poster.jpg", alt: "Ellora Caves" },
      ],
    },
    {
      date: "20 September 2026 · 3:57 pm",
      title: "Daulatabad Fort",
      note: "As far as the Chand Minar, where the climbing portion of the day was quietly declared complete.",
      photos: [
        { src: "photos/day/daulatabad-1.jpg", alt: "Daulatabad Fort" },
        { src: "photos/day/daulatabad-2.jpg", alt: "Daulatabad Fort" },
        { src: "photos/day/daulatabad-3.jpg", alt: "Daulatabad Fort" },
        { src: "photos/day/daulatabad-4.jpg", alt: "Daulatabad Fort" },
        { src: "photos/day/daulatabad-5.jpg", alt: "Daulatabad Fort" },
        { src: "photos/day/daulatabad-6.jpg", alt: "Daulatabad Fort" },
        { src: "photos/day/daulatabad-7.jpg", alt: "Daulatabad Fort" },
        { src: "photos/day/daulatabad-8.jpg", alt: "Daulatabad Fort" },
        { src: "photos/day/daulatabad-9.jpg", alt: "Daulatabad Fort" },
        { src: "photos/day/daulatabad-10.jpg", alt: "Daulatabad Fort" },
        { src: "photos/day/daulatabad-11.jpg", alt: "Daulatabad Fort" },
      ],
    },
    {
      date: "20 September 2026 · evening",
      title: "Prozone Mall",
      note: "A headset that took her somewhere I could not follow, and then Daayra at INOX — an A-rated thriller watched largely from behind a dupatta.",
      photos: [
        { src: "photos/day/prozone-1.jpg", alt: "Prozone Mall" },
        { src: "photos/day/prozone-2.jpg", alt: "Prozone Mall" },
      ],
      videos: [
        { src: "media/day-prozone.mp4", poster: "media/day-prozone-poster.jpg", alt: "Prozone Mall" },
      ],
    },
    {
      date: "29 January 2027",
      title: "The wedding",
      note: "The day every countdown on this page is running toward.",
    },
  ],

  // poster: always-visible original artwork · photo: our own picture, opens with the album
  movies: [
    {
      title: "Hai Jawani Toh Ishq Hona Hai",
      date: "5 June 2026",
      venue: "Anjali Cinema Hall · Sambhajinagar",
      note: "Perfect seats, perfect time. Also the site of a major scientific discovery: hands side by side, she turned out to be moonlight and I'm double-roast coffee. We're calling it contrast — it's what makes a photo good.",
      poster: "photos/poster-hjtihh.jpg",
      photos: [],
    },
    {
      title: "Ohh My Dog",
      date: "9 August 2026",
      venue: "INOX, Prozone Mall · Sambhajinagar",
      note: "We skipped Spider-Man for this one — best decision. The film was great, and somewhere in that dark hall, the first movie hand-hold happened. Goosebumps.",
      poster: "photos/poster-ohhmydog.jpg",
      photos: [],
    },
    {
      title: "Daayra",
      date: "20 September 2026",
      venue: "INOX, Prozone Mall · Sambhajinagar · Screen 3",
      seats: "D-10 & D-11",
      note: "An A-rated crime thriller, which she agreed to with confidence and then watched approximately forty percent of — the rest was observed from behind a dupatta. Worth it for the photo alone.",
      poster: "photos/poster-daayra.jpg",
      photos: [
        { src: "photos/movies/daayra-her.jpg", caption: "Row D, mid-film, fully fortified." },
        { src: "photos/movies/daayra-ticket.jpg", caption: "Two seats, as always." },
      ],
    },
  ],

  // The engagement film. Sits behind the same door as everything else.
  reel: {
    line: "Thirty-eight seconds of 13 September, with the song she picked.",
    src: "media/reel-sajna.mp4",
    poster: "media/reel-poster.jpg",
    caption: "Engagement reel · Sajna",
  },

  // Her own gallery — add photos to photos/her/ and list them here.
  her: {
    line: "Some people deserve a whole section to themselves. The management (me) fully agrees.",
    photos: [
      { src: "photos/her/h1.jpg", caption: "The pink saree. The smile did the rest." },
      { src: "photos/her/h2.jpg", caption: "Twirl radius: the entire venue." },
      { src: "photos/outings/ellora-her-2.jpg", caption: "A thousand years of carving behind her. I looked at the yellow kurta." },
      { src: "photos/outings/ellora-her-1.jpg", caption: "Framed better by that doorway than by anything I own." },
    ],
  },

  withFamily: {
    line: "Some people arrive and simply belong — on both sides. These frames say it better than words ever could.",
    photos: [
      { src: "photos/with-family/f1.jpg", caption: "Her hand on Aai's shoulder — Aai couldn't wait to tell me" },
      { src: "photos/with-family/f2.jpg", caption: "Aai, Baba & her — one happy frame" },
      { src: "photos/with-family/f3.jpg", caption: "Her birthday lunch, with her family" },
    ],
    moments: [
      {
        title: "Prozone Mall, bodyguard duty",
        text: "Aai walking ahead, her future daughter-in-law stationed right behind — ready for any fall that dared to happen. Aai noticed. Aai approved. I just paid for parking.",
      },
    ],
  },

  fixingDay: {
    line: "Chhatrapati Sambhajinagar — one afternoon, every blessing we needed.",
    photos: [
      { src: "photos/fixing-the-wedding/w1.jpg", caption: "The new family — mine now too" },
      { src: "photos/fixing-the-wedding/w2.jpg", caption: "Her younger brother — the approval committee of one" },
      { src: "photos/fixing-the-wedding/w3.jpg", caption: "Mama & Mami" },
      { src: "photos/fixing-the-wedding/w4.jpg", caption: "With the mamas" },
      { src: "photos/fixing-the-wedding/w5.jpg", caption: "Mavshi & Kaka" },
      { src: "photos/fixing-the-wedding/w6.jpg", caption: "The mothers and the aunts" },
      { src: "photos/fixing-the-wedding/w7.jpg", caption: "My sister, center of the frame — her preferred location" },
      { src: "photos/with-family/f4.jpg", caption: "The cousins' squad" },
      { src: "photos/with-family/f5.jpg", caption: "Her mother, the mamas & mavshi" },
    ],
  },



  songs: [
    {
      title: "Sajna — Darshan Raval",
      note: "The one under our engagement reel. Chosen by her, obviously.",
    },
    {
      title: "Aaj Sajeya — Goldie Sohel",
      note: "The louder alternative. Still in the running.",
    },
    {
      title: "Inaam — Jasleen Royal",
      note: "Playing under all three invitation films.",
    },
  ],


  // Behind the just-us door. Sincere on purpose — no jokes in this one.
};
