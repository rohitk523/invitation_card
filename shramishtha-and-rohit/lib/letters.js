/* Letter bodies live here rather than in data.js on purpose: middleware 404s
   everything under /lib/, so this file is never served to a browser. A letter
   is only readable through api/letter.js, and only once its date has passed.
   That makes the seal real -- you cannot read one early by viewing source. */

export const LETTERS = {
  "rohit-first-anniversary": {
    from: "Rohit",
    openOn: "2028-01-29",              // first wedding anniversary
    note: "Sealed. To be opened on our first anniversary.",
    body: [
      "PLACEHOLDER — Rohit, replace this with the real letter.",
      "Nothing here is served until the date above, so you can write it now and it stays shut.",
    ],
  },
};

export const sealed = (letter, now = new Date()) =>
  now < new Date(`${letter.openOn}T00:00:00+05:30`);

/* What the page is allowed to know before a letter opens. */
export const publicFace = (id, letter, now = new Date()) => ({
  id,
  from: letter.from,
  note: letter.note,
  openOn: letter.openOn,
  sealed: sealed(letter, now),
});
