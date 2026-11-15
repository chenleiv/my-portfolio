import { box, qx, shade, type Face } from "../iso";
import type { ScenePalette } from "../palettes";
import { Faces, SceneObject, XText } from "./primitives";

interface SkillBook {
  readonly letters: string;
  readonly color: string;
  readonly text: string;
}

// Thick books with skill letters on the spine, two per shelf, between the
// ordinary books. Letter colors pass 4.5:1 on their spine color.
function skillBooks(p: ScenePalette): SkillBook[][] {
  return [
    [
      { letters: "Ng", color: "#dd0031", text: "#ffffff" },
      { letters: "TS", color: "#3178c6", text: "#ffffff" },
    ],
    [
      { letters: "Re", color: "#61dafb", text: "#10202a" },
      { letters: "Sc", color: "#cd6799", text: "#10202a" },
    ],
    [
      { letters: "No", color: "#6cc24a", text: "#0a1408" },
      { letters: "AS", color: p.accent, text: p.spineOnAccent },
    ],
  ];
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
        {letters.map(({ book, y: cy }) => (
          <XText key={book.letters} x={0.905} y={cy} z={z0 + 0.34} h={0.2} fill={book.text}>
            {book.letters}
          </XText>
        ))}
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
