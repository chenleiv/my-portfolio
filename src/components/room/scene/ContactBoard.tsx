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

function EmailIcon({ x, p }: { x: number; p: ScenePalette }) {
  const top = ICON_Z + HALF * 0.8;
  const bottom = ICON_Z - HALF * 0.8;
  return (
    <g stroke={p.boardText} strokeWidth={2.5} strokeLinejoin="round">
      <polygon points={wallPoints([[x - HALF, bottom], [x + HALF, bottom], [x + HALF, top], [x - HALF, top]])} fill={p.accent} />
      <polyline points={wallPoints([[x - HALF, top], [x, ICON_Z - 0.05], [x + HALF, top]])} fill="none" />
    </g>
  );
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

const ITEMS = [
  { caption: "Email", x: 1.85 },
  { caption: "LinkedIn", x: 2.8 },
  { caption: "GitHub", x: 3.75 },
] as const;

// Framed board on the back wall with one icon per way to reach Chen. The popup has the links.
export function ContactBoard({ p }: { p: ScenePalette }) {
  return (
    <SceneObject objectKey="contact">
      <Faces faces={[qy(0, 1.2, 4.4, 1.8, 4.05, p.frame), qy(0, 1.3, 4.3, 1.9, 3.95, p.paper)]} />
      <EmailIcon x={ITEMS[0].x} p={p} />
      <LinkedInIcon x={ITEMS[1].x} p={p} />
      <GitHubIcon x={ITEMS[2].x} p={p} />
      {ITEMS.map((item) => (
        <YText key={item.caption} x={item.x} z={2.3} h={0.28} fill={p.boardText}>
          {item.caption}
        </YText>
      ))}
    </SceneObject>
  );
}
