import { qy, wallPoints } from "../iso";
import type { ScenePalette } from "../palettes";
import { Faces, SceneObject, YText } from "./primitives";

// Icons are drawn in the scene's flat style on the back wall, so they look the
// same on every system. Coordinates are [x, z] on the wall plane.
const ICON_Z = 3.15;
const HALF = 0.3;
const LINKEDIN_BLUE = "#0a66c2";

type WallPoint = readonly [number, number];

function circle(cx: number, cz: number, r: number, steps = 20): WallPoint[] {
  return Array.from({ length: steps }, (_, i) => {
    const a = (i / steps) * Math.PI * 2;
    return [cx + r * Math.cos(a), cz + r * Math.sin(a)] as const;
  });
}

function square(cx: number, cz: number, half: number): WallPoint[] {
  return [
    [cx - half, cz - half],
    [cx + half, cz - half],
    [cx + half, cz + half],
    [cx - half, cz + half],
  ];
}

// The outline keeps the square visible on the dark board, where the blue alone is too close to the paper.
function LinkedInIcon({ x, p }: { x: number; p: ScenePalette }) {
  return (
    <>
      <polygon
        points={wallPoints(square(x, ICON_Z, HALF))}
        fill={LINKEDIN_BLUE}
        stroke={p.boardText}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <YText x={x} z={ICON_Z - 0.16} h={0.42} fill="#ffffff">
        in
      </YText>
    </>
  );
}

// A simple cat head in a circle.
function GitHubIcon({ x, p }: { x: number; p: ScenePalette }) {
  const z = ICON_Z;
  const head: WallPoint[] = [
    [x - 0.15, z - 0.15],
    [x + 0.15, z - 0.15],
    [x + 0.19, z],
    [x + 0.16, z + 0.19],
    [x + 0.08, z + 0.09],
    [x - 0.08, z + 0.09],
    [x - 0.16, z + 0.19],
    [x - 0.19, z],
  ];
  return (
    <>
      <polygon points={wallPoints(circle(x, z, HALF))} fill={p.boardText} />
      <polygon points={wallPoints(head)} fill={p.paper} />
    </>
  );
}

// Paper area of the board on the back wall. The two icons sit symmetrically
// about its center, with equal space to each edge.
const BOARD = { x0: 1.3, x1: 4.3 } as const;
const BOARD_CENTER = (BOARD.x0 + BOARD.x1) / 2;
const ICON_OFFSET = 0.6;

const ITEMS = [
  { caption: "LinkedIn", x: BOARD_CENTER - ICON_OFFSET },
  { caption: "GitHub", x: BOARD_CENTER + ICON_OFFSET },
] as const;

// Framed board on the back wall with LinkedIn and GitHub. The popup has the links.
export function ContactBoard({ p }: { p: ScenePalette }) {
  return (
    <SceneObject objectKey="contact">
      <Faces faces={[qy(0, BOARD.x0 - 0.1, BOARD.x1 + 0.1, 1.8, 4.05, p.frame), qy(0, BOARD.x0, BOARD.x1, 1.9, 3.95, p.paper)]} />
      <LinkedInIcon x={ITEMS[0].x} p={p} />
      <GitHubIcon x={ITEMS[1].x} p={p} />
      {ITEMS.map((item) => (
        <YText key={item.caption} x={item.x} z={2.3} h={0.28} fill={p.boardText}>
          {item.caption}
        </YText>
      ))}
    </SceneObject>
  );
}
