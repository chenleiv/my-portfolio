import { qy, wallPoints } from "../iso";
import type { ScenePalette } from "../palettes";
import { Faces, SceneObject, YText } from "./primitives";

// Icons are drawn in the scene's flat style on the back wall, so they look the
// same on every system. Coordinates are [x, z] on the wall plane.

// Paper area of the board. The two icons sit symmetrically about its center,
// with equal space to each side edge and to the top and bottom.
const BOARD = { x0: 1.3, x1: 4.3, z0: 1.9, z1: 3.95 } as const;
const CENTER_X = (BOARD.x0 + BOARD.x1) / 2;
const ICON_Z = (BOARD.z0 + BOARD.z1) / 2;
const ICON_OFFSET = 0.7;

// Half the size of each icon. Inner details scale with it.
const HALF = 0.4;
const S = HALF / 0.3;
const LINKEDIN_BLUE = "#0a66c2";

type WallPoint = readonly [number, number];

function circle(cx: number, cz: number, r: number, steps = 24): WallPoint[] {
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
      <YText x={x} z={ICON_Z - 0.16 * S} h={0.42 * S} fill="#ffffff">
        in
      </YText>
    </>
  );
}

// A simple cat head in a circle.
function GitHubIcon({ x, p }: { x: number; p: ScenePalette }) {
  const z = ICON_Z;
  const head: WallPoint[] = (
    [
      [-0.15, -0.15],
      [0.15, -0.15],
      [0.19, 0],
      [0.16, 0.19],
      [0.08, 0.09],
      [-0.08, 0.09],
      [-0.16, 0.19],
      [-0.19, 0],
    ] as const
  ).map(([dx, dz]) => [x + dx * S, z + dz * S] as const);
  return (
    <>
      <polygon points={wallPoints(circle(x, z, HALF))} fill={p.boardText} />
      <polygon points={wallPoints(head)} fill={p.paper} />
    </>
  );
}

// Framed board on the back wall with the LinkedIn and GitHub logos only. The
// accessible name comes from the "Contact" label, and the popup has the links.
export function ContactBoard({ p }: { p: ScenePalette }) {
  return (
    <SceneObject objectKey="contact">
      <Faces
        faces={[
          qy(0, BOARD.x0 - 0.1, BOARD.x1 + 0.1, BOARD.z0 - 0.1, BOARD.z1 + 0.1, p.frame),
          qy(0, BOARD.x0, BOARD.x1, BOARD.z0, BOARD.z1, p.paper),
        ]}
      />
      <LinkedInIcon x={CENTER_X - ICON_OFFSET} p={p} />
      <GitHubIcon x={CENTER_X + ICON_OFFSET} p={p} />
    </SceneObject>
  );
}
