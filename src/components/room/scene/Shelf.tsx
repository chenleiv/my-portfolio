import { box, qx, shade, type Face } from "../iso";
import type { ScenePalette } from "../palettes";
import { Faces, SceneObject, XText } from "./primitives";

interface Tile {
  readonly letters: string;
  readonly color: string;
  readonly text: string;
}

// Skill tiles on the bottom shelf. Letter colors pass 4.5:1 on the shaded side face.
function tiles(p: ScenePalette): Tile[] {
  return [
    { letters: "Ng", color: "#dd0031", text: "#ffffff" },
    { letters: "Re", color: "#61dafb", text: "#10202a" },
    { letters: "TS", color: "#3178c6", text: "#ffffff" },
    { letters: "Sc", color: "#cd6799", text: "#ffffff" },
    { letters: "No", color: "#6cc24a", text: "#0a1408" },
    { letters: "AS", color: p.accent, text: p.tileOnAccent },
  ];
}

const SHELF_ROWS = [0.25, 1.35, 2.45];
const BOOK_WIDTHS = [0.22, 0.3, 0.18, 0.26, 0.2, 0.28, 0.24, 0.2, 0.3];

export function Shelf({ p }: { p: ScenePalette }) {
  const frame: Face[] = [...box(0, 2.2, 0, 0.9, 3.0, 3.6, p.shelf), qx(0.9, 2.3, 5.1, 0.1, 3.5, shade(p.shelf, 0.82))];
  const rows = SHELF_ROWS.map((z0, r) => {
    const board = qx(0.9, 2.2, 5.2, z0 - 0.09, z0, shade(p.shelf, 1.05));
    if (r === 0) {
      return (
        <g key={r}>
          <Faces faces={[board]} />
          {tiles(p).map((t, i) => {
            const ty = 2.4 + i * 0.46;
            return (
              <g key={t.letters}>
                <Faces faces={box(0.5, ty, z0, 0.4, 0.42, 0.5, t.color)} />
                <XText x={0.905} y={ty + 0.21} z={z0 + 0.16} h={0.19} fill={t.text}>
                  {t.letters}
                </XText>
              </g>
            );
          })}
        </g>
      );
    }
    const books: Face[] = [board];
    let y = 2.38;
    let k = r * 3;
    while (y < 4.9) {
      const w = BOOK_WIDTHS[k % BOOK_WIDTHS.length];
      const h = 0.6 + ((k * 37) % 30) / 100;
      books.push(qx(0.9, y, y + w, z0, z0 + h, p.books[k % p.books.length]));
      y += w + 0.02;
      k++;
    }
    return <Faces key={r} faces={books} />;
  });

  return (
    <SceneObject objectKey="shelf">
      <Faces faces={frame} />
      {rows}
    </SceneObject>
  );
}
