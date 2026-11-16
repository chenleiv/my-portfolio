import { box, qx, shade, type Face } from "../iso";
import type { ScenePalette } from "../palettes";
import { Faces, SceneObject, XIcon, XText } from "./primitives";

type SpineIconId = "angular" | "react" | "node" | "shield";

interface SkillBook {
  // Unique key, and the spine text when the book has no icon.
  readonly letters: string;
  // Simple mark instead of the letters. TypeScript and SCSS keep letters:
  // the TS mark is the letters, and the Sass mark is not readable this small.
  readonly icon?: SpineIconId;
  readonly color: string;
  readonly text: string;
}

// Thick books for skills from skillsData.ts, two per shelf, between the
// ordinary books. Mark and letter colors pass 4.5:1 on their spine color.
function skillBooks(p: ScenePalette): SkillBook[][] {
  return [
    [
      { letters: "Ng", icon: "angular", color: "#dd0031", text: "#ffffff" },
      { letters: "TS", color: "#3178c6", text: "#ffffff" },
    ],
    [
      { letters: "Re", icon: "react", color: "#61dafb", text: "#10202a" },
      { letters: "Sc", color: "#cd6799", text: "#10202a" },
    ],
    [
      { letters: "No", icon: "node", color: "#6cc24a", text: "#0a1408" },
      // Application Security.
      { letters: "AS", icon: "shield", color: p.accent, text: p.spineOnAccent },
    ],
  ];
}

// Marks drawn in a 100 x 100 box centered on (0, 0), in the spine's text
// color, with the spine color for cut-outs. Kept to a few thick shapes.
function SpineIcon({ id, ink, paper }: { id: SpineIconId; ink: string; paper: string }) {
  switch (id) {
    case "angular":
      // Filled angular shield with an "A".
      return (
        <>
          <polygon points="0,-48 44,-32 37,30 0,50 -37,30 -44,-32" fill={ink} />
          <path d="M-19,30 L0,-28 L19,30 M-10,8 L10,8" fill="none" stroke={paper} strokeWidth={10} strokeLinejoin="round" />
        </>
      );
    case "react":
      // Atom: three orbits and a nucleus.
      return (
        <g fill="none" stroke={ink} strokeWidth={7}>
          <ellipse rx={46} ry={17} />
          <ellipse rx={46} ry={17} transform="rotate(60)" />
          <ellipse rx={46} ry={17} transform="rotate(-60)" />
          <circle r={9} fill={ink} stroke="none" />
        </g>
      );
    case "node":
      // Hexagon outline.
      return <polygon points="0,-46 40,-23 40,23 0,46 -40,23 -40,-23" fill="none" stroke={ink} strokeWidth={10} strokeLinejoin="round" />;
    case "shield":
      // Rounded shield outline with a check mark.
      return (
        <g fill="none" stroke={ink} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
          <path d="M0,-44 L38,-30 L38,0 C38,24 20,38 0,46 C-20,38 -38,24 -38,0 L-38,-30 Z" />
          <path d="M-17,2 L-5,15 L19,-14" />
        </g>
      );
  }
}

const SHELF_ROWS = [0.25, 1.35, 2.45];
const BOOK_WIDTHS = [0.22, 0.3, 0.18, 0.26, 0.2, 0.28, 0.24, 0.2, 0.3];
const SKILL_WIDTH = 0.44;
const SKILL_HEIGHT = 0.86;
// Where the two skill books go in each row, counted in books from the left end.
const SKILL_SLOTS = [
  [1, 5],
  [0, 4],
  [2, 6],
];
const ROW_END = 5.0;

export function Shelf({ p }: { p: ScenePalette }) {
  const frame: Face[] = [...box(0, 2.2, 0, 0.9, 3.0, 3.6, p.shelf), qx(0.9, 2.3, 5.1, 0.1, 3.5, shade(p.shelf, 0.82))];
  const skills = skillBooks(p);

  const rows = SHELF_ROWS.map((z0, r) => {
    const faces: Face[] = [qx(0.9, 2.2, 5.2, z0 - 0.09, z0, shade(p.shelf, 1.05))];
    const letters: { book: SkillBook; y: number }[] = [];
    const queue = [...skills[r]];
    let y = 2.38;
    let k = r * 3;
    for (let slot = 0; y < ROW_END; slot++) {
      if (SKILL_SLOTS[r].includes(slot) && queue.length > 0 && y + SKILL_WIDTH <= ROW_END) {
        const book = queue.shift()!;
        faces.push(qx(0.9, y, y + SKILL_WIDTH, z0, z0 + SKILL_HEIGHT, book.color));
        letters.push({ book, y: y + SKILL_WIDTH / 2 });
        y += SKILL_WIDTH + 0.02;
        continue;
      }
      const w = BOOK_WIDTHS[k % BOOK_WIDTHS.length];
      if (y + w > ROW_END) break;
      const h = 0.6 + ((k * 37) % 30) / 100;
      faces.push(qx(0.9, y, y + w, z0, z0 + h, p.books[k % p.books.length]));
      y += w + 0.02;
      k++;
    }
    return (
      <g key={r}>
        <Faces faces={faces} />
        {letters.map(({ book, y: cy }) =>
          book.icon ? (
            <XIcon key={book.letters} x={0.905} y={cy} z={z0 + SKILL_HEIGHT / 2} h={0.38}>
              <SpineIcon id={book.icon} ink={book.text} paper={book.color} />
            </XIcon>
          ) : (
            <XText key={book.letters} x={0.905} y={cy} z={z0 + 0.34} h={0.2} fill={book.text}>
              {book.letters}
            </XText>
          ),
        )}
      </g>
    );
  });

  return (
    <SceneObject objectKey="shelf">
      <Faces faces={frame} />
      {rows}
    </SceneObject>
  );
}
