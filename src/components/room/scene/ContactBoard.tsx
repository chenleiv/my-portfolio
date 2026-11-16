import { qy, wallPoints } from "../iso";
import type { ScenePalette } from "../palettes";
import { Faces, SceneObject, YText } from "./primitives";

// Everything is drawn in the scene's flat style on the back wall, so it looks
// the same on every system. Coordinates are [x, z] on the wall plane.

// Paper area of the board: a resume sheet in the middle, LinkedIn on the left
// and GitHub on the right, symmetric about the center and vertically centered.
const BOARD = { x0: 1.1, x1: 4.4, z0: 1.6, z1: 4.2 } as const;
const CENTER_X = (BOARD.x0 + BOARD.x1) / 2;
const CENTER_Z = (BOARD.z0 + BOARD.z1) / 2;
const ICON_OFFSET = 1.1;

// Half the size of each logo. Inner details scale with it.
const HALF = 0.35;
const S = HALF / 0.3;
const LINKEDIN_BLUE = "#0a66c2";

const SHEET = { w: 0.9, h: 1.3 } as const;
const SHEET_WHITE = "#ffffff";
const SHEET_LINE = "#b8b2a7";
// Lengths of the text lines on the sheet, as a share of the usable width.
const SHEET_LINES = [0.85, 0.65, 0.8, 0.7, 0.5];

const OUTLINE = { strokeWidth: 2.5, strokeLinejoin: "round" } as const;

type WallPoint = readonly [number, number];

function circle(cx: number, cz: number, r: number, steps = 24): WallPoint[] {
  return Array.from({ length: steps }, (_, i) => {
    const a = (i / steps) * Math.PI * 2;
    return [cx + r * Math.cos(a), cz + r * Math.sin(a)] as const;
  });
}

function rect(x0: number, x1: number, z0: number, z1: number): WallPoint[] {
  return [
    [x0, z0],
    [x1, z0],
    [x1, z1],
    [x0, z1],
  ];
}

// A hung resume: white page with an accent header, grey text lines and a brass clip.
// The outline keeps the white page visible on the light board's off-white paper.
function ResumeSheet({ p }: { p: ScenePalette }) {
  const x0 = CENTER_X - SHEET.w / 2;
  const x1 = CENTER_X + SHEET.w / 2;
  const z0 = CENTER_Z - SHEET.h / 2;
  const z1 = CENTER_Z + SHEET.h / 2;
  const pad = 0.12;
  const usable = SHEET.w - pad * 2;
  return (
    <>
      <polygon points={wallPoints(rect(x0, x1, z0, z1))} fill={SHEET_WHITE} stroke={p.boardText} {...OUTLINE} />
      <polygon points={wallPoints(rect(x0 + pad, x1 - pad, z1 - 0.28, z1 - 0.16))} fill={p.accent} />
      {SHEET_LINES.map((share, i) => {
        const z = z1 - 0.45 - i * 0.16;
        return <polygon key={i} points={wallPoints(rect(x0 + pad, x0 + pad + usable * share, z - 0.03, z))} fill={SHEET_LINE} />;
      })}
      <polygon points={wallPoints(rect(CENTER_X - 0.12, CENTER_X + 0.12, z1 - 0.06, z1 + 0.1))} fill={p.brass} />
    </>
  );
}

// The outline keeps the square visible on the dark board, where the blue alone is too close to the paper.
function LinkedInIcon({ x, p }: { x: number; p: ScenePalette }) {
  return (
    <>
      <polygon points={wallPoints(rect(x - HALF, x + HALF, CENTER_Z - HALF, CENTER_Z + HALF))} fill={LINKEDIN_BLUE} stroke={p.boardText} {...OUTLINE} />
      <YText x={x} z={CENTER_Z - 0.16 * S} h={0.42 * S} fill="#ffffff">
        in
      </YText>
    </>
  );
}

// A simple cat head in a circle.
function GitHubIcon({ x, p }: { x: number; p: ScenePalette }) {
  const z = CENTER_Z;
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

// Framed board on the back wall for the Contact & CV object. Its accessible name
// comes from the "Contact & CV" label, and the popup has the links.
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
      <ResumeSheet p={p} />
      <GitHubIcon x={CENTER_X + ICON_OFFSET} p={p} />
    </SceneObject>
  );
}
