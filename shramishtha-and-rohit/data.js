// All site content lives here — edit this file, redeploy, done.
// Entries marked [sample] are placeholders waiting for the real story.
const SITE = {
  bride: "Shramishtha",
  groom: "Rohit",
  engagementISO: "2026-09-13T12:00:00+05:30",
  weddingISO: "2027-01-29T00:00:00+05:30", // muhurat time TBC
  engagementLine: "Sunday, 13 September 2026 · Hotel NeelKamal, Beed",
  weddingLine: "Friday, 29 January 2027",
  flowerAnswer: /tulip/i,
  // "Just Us" door — placeholder secret: the wedding date as ddmmyyyy.
  // Change this to something only the two of you would ever guess.
  usAnswer: "29012027",

  story: [
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
      date: "30 August 2026",
      title: "The apology roses",
      note: "We hit a rough patch — sharp words, messages I wish I could unsend. The roses were how I said the truest thing: I'm sorry, and I choose us. She forgave me — once the roses cleared quality inspection. I'm told the matter can still be reopened as evidence in any future argument.",
    },
    {
      date: "13 September 2026",
      title: "The Engagement",
      note: "The ring, the promise, the beginning — Hotel NeelKamal, Beed.",
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
      date: "2026",
      venue: "Anjali Cinema Hall · Sambhajinagar",
      note: "Which day was this? The memory line goes here.",
      poster: "photos/poster-hjtihh.jpg",
      photo: null,
    },
    {
      title: "Ohh My Dog",
      date: "2026",
      venue: "INOX, Prozone Mall · Sambhajinagar",
      note: "We skipped Spider-Man for this one — best decision. The film was great, and somewhere in that dark hall, the first movie hand-hold happened. Goosebumps.",
      poster: "photos/poster-ohhmydog.jpg",
      photo: null,
    },
  ],

  withFamily: {
    line: "Some people arrive and simply belong — on both sides. These frames say it better than words ever could.",
    photos: [
      { src: "photos/with-family/f1.jpg", caption: "A garden walk with Aai" },
      { src: "photos/with-family/f2.jpg", caption: "Aai, Baba & her — one happy frame" },
      { src: "photos/with-family/f3.jpg", caption: "Her birthday lunch, with her family" },
    ],
  },

  fixingDay: {
    line: "Chhatrapati Sambhajinagar — one afternoon, every blessing we needed.",
    photos: [
      { src: "photos/fixing-the-wedding/w1.jpg", caption: "Blessings from the elders" },
      { src: "photos/fixing-the-wedding/w2.jpg", caption: "The young brigade" },
      { src: "photos/fixing-the-wedding/w3.jpg", caption: "Family on both sides" },
      { src: "photos/fixing-the-wedding/w4.jpg", caption: "With the uncles" },
      { src: "photos/fixing-the-wedding/w5.jpg", caption: "Elders' blessings" },
      { src: "photos/fixing-the-wedding/w6.jpg", caption: "The mothers and the aunts" },
      { src: "photos/fixing-the-wedding/w7.jpg", caption: "The three of us, one happy wall" },
      { src: "photos/with-family/f4.jpg", caption: "The cousins' squad" },
      { src: "photos/with-family/f5.jpg", caption: "Both families, one decision" },
      { src: "photos/with-family/f6.jpg", caption: "Blessings all around" },
    ],
  },

  usAlbum: [
    { src: "photos/p1.jpg", caption: "The balloon evening — 3 July 2026" },
    { src: "photos/p3.jpg", caption: "Let coffee connect us" },
    { src: "photos/p5.jpg", caption: "The apology roses — 30 August 2026" },
    { src: "photos/p6.jpg", caption: "That smile, mid-laugh" },
    { src: "photos/p7.jpg", caption: "An evening, just us" },
    { src: "photos/p8.jpg", caption: "Us, simply" },
    { src: "photos/p9.jpg", caption: "Fort View Adventure Resort — hunting for where forever begins" },
  ],

  hands: {
    line: "And in every photo, our hands found each other.",
    photos: [
      { src: "photos/p2.jpg", caption: "3 July 2026" },
      { src: "photos/p4.jpg", caption: "Arm in arm" },
    ],
  },

  songs: [], // the list begins the day the first song is chosen

  places: [
    { name: "Beed", note: "where the yes happened" },
    { name: "Fort View Adventure Resort", note: "the marriage-destination-finding trip" },
    { name: "Next place", note: "[sample] every trip we take gets added" },
  ],

  letters: [
    { from: "Rohit", note: "Sealed. To be opened on a very special day, years from now." },
  ],
};
