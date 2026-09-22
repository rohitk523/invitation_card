// All site content. Everyone who signs in sees all of it —
// there is no longer a separate private tier.
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
      photos: [
        { src: "photos/day/fixed-1.jpg", alt: "21 June 2026" },
        { src: "photos/fixing-the-wedding/w1.jpg", alt: "The new family" },
        { src: "photos/fixing-the-wedding/w2.jpg", alt: "Her younger brother" },
        { src: "photos/fixing-the-wedding/w4.jpg", alt: "With the mamas" },
        { src: "photos/fixing-the-wedding/w6.jpg", alt: "The mothers and the aunts" },
        { src: "photos/with-family/f4.jpg", alt: "The cousins" },
      ],
    },
    {
      date: "28 June 2026",
      title: "The venue hunt begins",
      note: "A trip to Fort View Adventure Resort, scouting where forever might start.",
      photos: [
        { src: "photos/album/p9.jpg", alt: "Fort View Adventure Resort" },
      ],
    },
    {
      date: "2 July 2026",
      title: "Her birthday",
      note: "Balloons, a lunch with her family, and the first of her birthdays I got to be in the room for. Many more now scheduled.",
      photos: [
        { src: "photos/album/p1.jpg", alt: "The balloon evening" },
        { src: "photos/with-family/f3.jpg", alt: "Her birthday lunch, with her family" },
        { src: "photos/day/bday-1.jpg", alt: "Her birthday" },
        { src: "photos/day/bday-2.jpg", alt: "Her birthday" },
        { src: "photos/day/bday-3.jpg", alt: "Her birthday" },
        { src: "photos/day/bday-4.jpg", alt: "Her birthday" },
        { src: "photos/day/bday-5.jpg", alt: "Her birthday" },
        { src: "photos/day/bday-6.jpg", alt: "Her birthday" },
        { src: "photos/day/bday-7.jpg", alt: "Her birthday" },
        { src: "photos/day/bday-8.jpg", alt: "Her birthday" },
        { src: "photos/day/bday-9.jpg", alt: "Her birthday" },
        { src: "photos/day/bday-10.jpg", alt: "Her birthday" },
      ],
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
      photos: [
        { src: "photos/album/p5.jpg", alt: "The apology roses" },
        { src: "photos/day/roses-1.jpg", alt: "The apology roses" },
        { src: "photos/day/roses-2.jpg", alt: "The apology roses" },
      ],
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
      videos: [
        { src: "media/engagement-reel.mp4", poster: "media/engagement-reel-poster.jpg", alt: "Our engagement reel" },
      ],
    },
    {
      date: "20 September 2026",
      title: "The First Weekend After the Engagement",
      note: "One week married-to-be, and we spent the Sunday proving we could still out-walk each other. A Jyotirlinga, two rock-cut wonders, a fort, a headset and a crime thriller.",
      stops: [
        {
          time: "1:55 pm",
          title: "Ghrishneshwar Temple",
          note: "The twelfth Jyotirlinga, and the first one we have stood in front of together. Eleven to go — we are treating that as an itinerary rather than a statistic.",
          photos: [
        { src: "photos/day/ghrishneshwar-1.jpg", alt: "Ghrishneshwar Temple" },
        { src: "photos/day/ghrishneshwar-2.jpg", alt: "Ghrishneshwar Temple" },
          ],
        },
        {
          time: "2:40 pm",
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
          time: "3:57 pm",
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
          time: "evening",
          title: "Prozone Mall",
          note: "A headset that took her somewhere I could not follow, and then Daayra at INOX — watched from under a shawl, because the air conditioning was set to arctic.",
          photos: [
        { src: "photos/day/prozone-1.jpg", alt: "Prozone Mall" },
        { src: "photos/day/prozone-2.jpg", alt: "Prozone Mall" },
          ],
          videos: [
        { src: "media/day-prozone.mp4", poster: "media/day-prozone-poster.jpg", alt: "Prozone Mall" },
          ],
        },
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
      note: "A crime thriller, watched almost entirely from under a shawl — INOX had the air conditioning somewhere near polar, and she feels the cold more than anyone I know. The film was good. The AC was the villain.",
      poster: "photos/poster-daayra.jpg",
      photos: [
        { src: "photos/movies/daayra-her.jpg", caption: "Row D, mid-film, fully fortified." },
        { src: "photos/movies/daayra-ticket.jpg", caption: "Two seats, as always." },
      ],
    },
  ],

  // Her own gallery — add photos to photos/her/ and list them here.
  her: {
    line: "Some people deserve a whole section to themselves. The management (me) fully agrees.",
    photos: [
      { src: "photos/her/h1.jpg", alt: "Shramishtha in the pink saree" },
      { src: "photos/her/h2.jpg", alt: "Shramishtha mid-twirl" },
      { src: "photos/her/h3.jpg", alt: "Shramishtha" },
      { src: "photos/her/h4.jpg", alt: "Shramishtha" },
      { src: "photos/her/h5.jpg", alt: "Shramishtha" },
      { src: "photos/her/h6.jpg", alt: "Shramishtha" },
      { src: "photos/her/h7.jpg", alt: "Shramishtha" },
      { src: "photos/her/h8.jpg", alt: "Shramishtha in the doorway" },
      { src: "photos/her/h9.jpg", alt: "Shramishtha" },
      { src: "photos/her/h10.jpg", alt: "Shramishtha" },
    ],
  },

  withFamily: {
    line: "Some people arrive and simply belong — on both sides. Including the June afternoon in Chhatrapati Sambhajinagar when both homes said yes.",
    photos: [
      { src: "photos/with-family/f1.jpg", alt: "Her hand on Aai's shoulder" },
      { src: "photos/with-family/f2.jpg", alt: "Aai, Baba and her" },
      { src: "photos/fixing-the-wedding/w3.jpg", alt: "Mama and Mami" },
      { src: "photos/fixing-the-wedding/w5.jpg", alt: "Mavshi and Kaka" },
      { src: "photos/fixing-the-wedding/w7.jpg", alt: "My sister" },
      { src: "photos/with-family/f5.jpg", alt: "Her mother, the mamas and mavshi" },
    ],
    moments: [
      {
        title: "Prozone Mall, bodyguard duty",
        text: "Aai walking ahead, her future daughter-in-law stationed right behind — ready for any fall that dared to happen. Aai noticed. Aai approved.",
      },
    ],
  },

  songs: [], // the list begins the day the first song is chosen,

  usAlbum: [
    { src: "photos/album/p3.jpg", alt: "Coffee together" },
    { src: "photos/album/p6.jpg", alt: "Mid-laugh" },
    { src: "photos/engagement/e1.jpg", alt: "The engagement, 13 September 2026" },
    { src: "photos/engagement/e2.jpg", alt: "The two of us, her in the saree" },
    { src: "photos/engagement/e4.jpg", alt: "Mid-conversation" },
    { src: "photos/engagement/e5.jpg", alt: "A kiss on her hand" },
    { src: "photos/engagement/e3.jpg", alt: "At the reception" },
    { src: "photos/engagement/e6.jpg", alt: "Her gown" },
    { src: "photos/engagement/e7.jpg", alt: "Walking in" },
    { src: "photos/engagement/e8.jpg", alt: "The twirl" },
    { src: "photos/engagement/e9.jpg", alt: "Rings on, R & S in mehendi" },
    { src: "photos/album/p2.jpg", alt: "Our hands, her birthday, 2 July 2026" },
  ],
};
