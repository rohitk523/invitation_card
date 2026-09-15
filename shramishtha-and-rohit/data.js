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
      photo: null,
    },
    {
      title: "Ohh My Dog",
      date: "9 August 2026",
      venue: "INOX, Prozone Mall · Sambhajinagar",
      note: "We skipped Spider-Man for this one — best decision. The film was great, and somewhere in that dark hall, the first movie hand-hold happened. Goosebumps.",
      poster: "photos/poster-ohhmydog.jpg",
      photo: null,
    },
  ],

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

  usAlbum: [
    { src: "photos/p1.jpg", caption: "The balloon evening — 3 July 2026" },
    { src: "photos/p3.jpg", caption: "Let coffee connect us" },
    { src: "photos/p5.jpg", caption: "The apology roses — 30 August 2026" },
    { src: "photos/p6.jpg", caption: "That smile, mid-laugh" },
    { src: "photos/p9.jpg", caption: "Fort View Adventure Resort — hunting for where forever begins" },
    { src: "photos/engagement/e1.jpg", caption: "13 September — official, with witnesses" },
    { src: "photos/engagement/e2.jpg", caption: "The saree, and the lucky guy next to it" },
    { src: "photos/engagement/e4.jpg", caption: "Mid-conversation, mid-forever" },
    { src: "photos/engagement/e5.jpg", caption: "A kiss on the hand that said yes" },
    { src: "photos/engagement/e3.jpg", caption: "Reception mode: lavender and velvet" },
    { src: "photos/engagement/e6.jpg", caption: "Her gown brought its own lighting crew" },
    { src: "photos/engagement/e7.jpg", caption: "Walking into the rest of it" },
    { src: "photos/engagement/e8.jpg", caption: "The twirl. The whole venue watched." },
    { src: "photos/engagement/e9.jpg", caption: "Rings on, hands touching — R & S in mehendi" },
  ],

  hands: {
    line: "And in every photo, our hands found each other.",
    photos: [
      { src: "photos/p2.jpg", caption: "3 July 2026" },
      { src: "photos/p4.jpg", caption: "Arm in arm" },
      { src: "photos/engagement/e9.jpg", caption: "The rings — 13 September 2026" },
    ],
  },

  songs: [], // the list begins the day the first song is chosen

  letters: [
    { from: "Rohit", note: "Sealed. To be opened on a very special day, years from now." },
  ],

  // Behind the just-us door. Sincere on purpose — no jokes in this one.
  apology: {
    title: "An Apology to the One I Love",
    paragraphs: [
      "I am putting this into words because I need to take profound and complete accountability. Recently, I let my own insecurities and overthinking cloud my judgment, and in doing so, I deeply hurt the person I care about most.",
      "I jumped to conclusions and made unfair assumptions. In a moment where I should have led with trust and open communication, I reacted from a place of fear and doubt. You have always been honest, loving, and steadfast, and you did not deserve to have your character or your intentions questioned.",
      "I know now that my reaction was a reflection of my own internal struggles, not of anything you did wrong. By projecting my insecurities onto you, I caused unnecessary pain and made you feel unvalued. For that, I am so incredibly sorry.",
      "Love is about taking ownership when you are wrong — and I was wrong. I promise to do better. I promise to listen to you with an open heart, to trust the beautiful bond we share, and to pause and communicate my feelings before jumping to conclusions.",
      "You mean the world to me. I deeply regret causing you pain, and I will spend every day working to be the secure, understanding, and supportive partner you truly deserve.",
    ],
    signoff: "— Rohit",
  },
};
