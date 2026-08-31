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
      date: "Once upon a time",
      title: "Two paths crossed",
      note: "[sample] How did you two first meet? Tell me the story and it goes right here.",
    },
    {
      date: "3 July 2026",
      title: "The balloon evening",
      note: "[sample] Golden balloons, held hands, and a cake somewhere nearby. This looks like a day worth naming.",
    },
    {
      date: "3 July 2026",
      title: "Let coffee connect us",
      note: "[sample] The café wall said it before we did.",
    },
    {
      date: "30 August 2026",
      title: "Roses at home",
      note: "[sample] A bouquet, both families, and smiles that wouldn't sit still.",
    },
    {
      date: "13 September 2026",
      title: "Saakharpuda",
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
      note: "Which day was this, and which cinema? The memory line goes here.",
      poster: "photos/poster-hjtihh.jpg",
      photo: null,
    },
    {
      title: "Ohh My Dog",
      date: "2026",
      note: "The dog one. Waiting on the story from you two.",
      poster: "photos/poster-ohhmydog.jpg",
      photo: null,
    },
  ],

  withFamily: {
    line: "Some people arrive and simply belong. These frames say it better than words ever could.",
    photos: [
      { src: "photos/with-family/f1.jpg", caption: "A garden walk with Aai" },
      { src: "photos/with-family/f2.jpg", caption: "Aai, Baba & her — one happy frame" },
    ],
  },

  familyAlbum: [
    { src: "photos/p5.jpg", caption: "Roses at home — 30 August 2026" },
    { src: "photos/p6.jpg", caption: "That smile, mid-laugh" },
    { src: "photos/p7.jpg", caption: "An evening with family" },
    { src: "photos/p8.jpg", caption: "Us, simply" },
  ],

  usAlbum: [
    { src: "photos/p1.jpg", caption: "The balloon evening — 3 July 2026" },
    { src: "photos/p3.jpg", caption: "Let coffee connect us" },
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
    { name: "The coffee-connect café", note: "[sample] its real name goes here" },
    { name: "Beed", note: "where the yes happened" },
    { name: "Next place", note: "[sample] every trip we take gets added" },
  ],

  letters: [
    { from: "Rohit", note: "Sealed. To be opened on a very special day, years from now." },
    { from: "Shramishtha", note: "Sealed. No peeking — not even each other." },
  ],
};
