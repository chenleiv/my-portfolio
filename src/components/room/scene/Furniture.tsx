import { box, project, qx, qy, qz, shade, type Face } from "../iso";
import type { ScenePalette } from "../palettes";
import { FOOTPRINT_BY_ID, SOFA_SEAT_HEIGHT } from "../roomContent";
import { Bucky } from "./Bucky";
import { Faces, SceneObject, ZText } from "./primitives";

const PS5_WHITE = "#f2f2f2";

export function Tv({ p }: { p: ScenePalette }) {
  return (
    <SceneObject objectKey="tv">
      <Faces
        faces={[
          ...box(0, 6.2, 0, 1.2, 3.0, 0.9, p.cab),
          ...box(0.15, 6.7, 0.9, 0.22, 2.0, 1.4, p.tv),
          qx(0.37, 6.8, 8.6, 1.0, 2.2, p.screen),
          ...box(0.3, 9.0, 0.9, 0.3, 0.25, 0.65, PS5_WHITE),
        ]}
      />
    </SceneObject>
  );
}

const DESK_TOP_Z = 1.4;
// Where the drawer pedestal starts; it runs to the desk's right end.
const PEDESTAL_X = 9.0;

export function Desk({ p }: { p: ScenePalette }) {
  const { x0, y0, x1, y1 } = FOOTPRINT_BY_ID.desk;
  const body = shade(p.wood, 0.9);
  const seam = shade(p.wood, 0.6);
  const faces: Face[] = [
    // One unit, drawn back to front and base before top, so no part paints
    // over the desk top: a back panel, a full-depth side panel at the left end
    // and a drawer pedestal flush with the top's right end and front edge.
    ...box(x0 + 0.15, y0, 0.5, PEDESTAL_X - x0 - 0.15, 0.1, 0.9, shade(p.wood, 0.75)),
    ...box(x0, y0, 0, 0.15, y1 - y0, DESK_TOP_Z, body),
    ...box(PEDESTAL_X, y0, 0, x1 - PEDESTAL_X, y1 - y0, DESK_TOP_Z, body),
    // Three drawers: two seams and a brass handle on each front.
    ...[0.47, 0.94].map((z) => qy(y1 + 0.001, PEDESTAL_X + 0.05, x1 - 0.05, z - 0.015, z + 0.015, seam)),
    ...[0.22, 0.69, 1.16].map((z) => qy(y1 + 0.002, PEDESTAL_X + 0.4, PEDESTAL_X + 0.6, z, z + 0.04, p.brass)),
    // Desk top running to the end of the back wall.
    ...box(x0, y0, DESK_TOP_Z, x1 - x0, y1 - y0, 0.2, p.wood),
    // Dual monitors side by side, centered over the chair: a landscape screen
    // under the window sill and a portrait screen between the two curtains.
    ...box(7.05, 0.5, 1.6, 0.3, 0.3, 0.15, p.tv),
    ...box(6.4, 0.6, 1.6, 1.6, 0.14, 1.0, p.tv),
    qy(0.74, 6.5, 7.9, 1.7, 2.5, p.screen),
    ...box(8.35, 0.5, 1.6, 0.3, 0.3, 0.15, p.tv),
    ...box(8.15, 0.6, 1.6, 0.7, 0.14, 1.6, p.tv),
    qy(0.74, 8.22, 8.78, 1.7, 3.1, p.screen),
    // Keyboard under the landscape screen, mouse to its right.
    ...box(6.6, 1.0, 1.6, 1.2, 0.35, 0.05, shade(p.tv, 1.6)),
    ...box(7.95, 1.05, 1.6, 0.17, 0.23, 0.06, p.tv),
    // Small potted plant to the right of the portrait monitor, the same pot and
    // leaf colors as the floor plant; its top stays under the window.
    ...box(9.1, 0.55, 1.6, 0.32, 0.32, 0.26, p.pot),
    ...box(9.13, 0.58, 1.86, 0.26, 0.26, 0.2, p.leaf),
    ...box(9.09, 0.54, 2.02, 0.34, 0.34, 0.16, shade(p.leaf, 1.15)),
    ...box(9.16, 0.61, 2.18, 0.2, 0.2, 0.12, p.leaf),
    // Mug at the front-left corner of the desk, where its steam clears the Projects label.
    ...box(MUG.x, MUG.y, 1.6, 0.2, 0.2, 0.22, p.mug),
    ...box(MUG.x + 0.2, MUG.y + 0.07, 1.65, 0.05, 0.06, 0.12, p.mug),
    qz(1.821, MUG.x + 0.03, MUG.x + 0.17, MUG.y + 0.03, MUG.y + 0.17, COFFEE),
  ];
  return (
    <SceneObject objectKey="desk">
      <Faces faces={faces} />
      <g fill="none" stroke={p.steam} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        {[MUG.x + 0.06, MUG.x + 0.14].map((sx, i) => (
          <polyline key={i} points={steamPoints(sx, MUG.y + 0.1, i)} />
        ))}
      </g>
    </SceneObject>
  );
}

const MUG = { x: 5.68, y: 1.5 } as const;
const COFFEE = "#5a3a26";

// A short wavy line rising from the mug, offset per strand so the two do not mirror.
function steamPoints(x: number, y: number, strand: number): string {
  const wave = [0, 0.03, -0.03, 0.02];
  return wave
    .map((dx, i) => {
      const [sx, sy] = project(x + (strand ? -dx : dx), y, 1.9 + i * 0.13);
      return `${sx.toFixed(1)},${sy.toFixed(1)}`;
    })
    .join(" ");
}

// Gaming chair facing the desk: the seat is on the desk side and the tall back,
// side wings and headrest are at the rear (+y). Soft coral with dark trim. A separate
// scene item from the desk so Chen can stand in front of the desk and behind the
// chair. Clicking it still opens Projects. Headphones hang on the left wing.
export function Chair({ p }: { p: ScenePalette }) {
  const { x0: x, y0: y } = FOOTPRINT_BY_ID.chair;
  const trim = p.tv;
  const body = p.chair;
  const wing = shade(p.chair, 0.85);
  const backY = y + 0.77;
  return (
    <SceneObject objectKey="desk">
      <Faces
        faces={[
          // Base and post.
          ...box(x + 0.1, y + 0.1, 0, 0.8, 0.7, 0.06, trim),
          ...box(x + 0.45, y + 0.4, 0.06, 0.1, 0.1, 0.4, trim),
          // Seat.
          ...box(x + 0.05, y, 0.46, 0.9, 0.8, 0.18, body),
          // Armrests on short posts.
          ...box(x + 0.02, y + 0.4, 0.64, 0.04, 0.06, 0.16, trim),
          ...box(x + 0.94, y + 0.4, 0.64, 0.04, 0.06, 0.16, trim),
          ...box(x, y + 0.15, 0.8, 0.08, 0.55, 0.06, trim),
          ...box(x + 0.92, y + 0.15, 0.8, 0.08, 0.55, 0.06, trim),
          // Tall back with a racing stripe, then the side wings and the headrest.
          ...box(x + 0.05, backY, 0.64, 0.9, 0.18, 1.6, body),
          qy(backY + 0.181, x + 0.4, x + 0.6, 0.8, 2.1, trim),
          ...box(x, backY - 0.12, 0.9, 0.1, 0.3, 1.2, wing),
          ...box(x + 0.9, backY - 0.12, 0.9, 0.1, 0.3, 1.2, wing),
          ...box(x + 0.25, backY - 0.02, 2.24, 0.5, 0.2, 0.3, body),
          // Headphones over the top of the left wing: band on top, one cup on its front.
          ...box(x - 0.02, backY - 0.06, 2.1, 0.14, 0.18, 0.05, trim),
          ...box(x - 0.02, backY + 0.18, 1.78, 0.14, 0.06, 0.24, trim),
          ...box(x + 0.01, backY + 0.24, 1.83, 0.08, 0.01, 0.14, p.screen),
        ]}
      />
    </SceneObject>
  );
}

const PAGE_WHITE = "#ffffff";
const PAGE_INK = "#2a1f2d";
const PAGE_LINE = "#b8b2a7";
// Lengths of the text lines under the title, as a share of the usable width.
const SCRIPT_LINES = [0.9, 0.75, 0.85, 0.6];

// Page size: L from the page's top edge to its bottom (along world x), W across
// the reading direction (along world y).
const PAGE_L = 0.9;
const PAGE_W = 0.7;

// A small stack of loose script pages, turned to be read from the sofa (at +x):
// the page top is toward -x and the text reads along -y. Lower pages are
// offset and slightly darker so the stack reads as several sheets.
function ScriptPages({ x, y }: { x: number; y: number }) {
  const top = 0.64;
  const pad = 0.05;
  const right = y + PAGE_W - pad; // Where each line starts, as seen from the sofa.
  return (
    <>
      <Faces
        faces={[
          qz(0.625, x + 0.04, x + 0.04 + PAGE_L, y + 0.06, y + 0.06 + PAGE_W, shade(PAGE_WHITE, 0.86)),
          qz(0.632, x - 0.03, x - 0.03 + PAGE_L, y - 0.05, y - 0.05 + PAGE_W, shade(PAGE_WHITE, 0.93)),
          qz(top, x, x + PAGE_L, y, y + PAGE_W, PAGE_WHITE),
          ...SCRIPT_LINES.map((share, i) => {
            const lx = x + 0.36 + i * 0.13;
            return qz(top + 0.001, lx, lx + 0.04, right - (PAGE_W - pad * 2) * share, right, PAGE_LINE);
          }),
        ]}
      />
      <ZText x={x + 0.24} y={y + PAGE_W / 2} z={top + 0.002} h={0.11} fill={PAGE_INK} reads="-y">
        SCRIPT
      </ZText>
    </>
  );
}

// Decoration only; the CV now hangs on the contact board. Loose script pages lie on top.
export function CoffeeTable({ p }: { p: ScenePalette }) {
  const { x0: x, y0: y, x1, y1 } = FOOTPRINT_BY_ID["coffee-table"];
  const w = x1 - x;
  const d = y1 - y;
  const legs: [number, number][] = [[x + 0.05, y + 0.05], [x + w - 0.15, y + 0.05], [x + 0.05, y + d - 0.15], [x + w - 0.15, y + d - 0.15]];
  return (
    <>
      <Faces
        faces={[
          ...box(x, y, 0.5, w, d, 0.12, p.wood),
          ...legs.flatMap(([lx, ly]) => box(lx, ly, 0, 0.1, 0.1, 0.5, shade(p.wood, 0.8))),
        ]}
      />
      {/* The stack spans x - 0.03 to x + L + 0.04 and y - 0.05 to y + W + 0.06, centered on the table. */}
      <ScriptPages x={x + (w - PAGE_L - 0.01) / 2} y={y + (d - PAGE_W - 0.01) / 2} />
    </>
  );
}

const SOFA_SEAT_Z = SOFA_SEAT_HEIGHT;
const SOFA_BACK_DEPTH = 0.4;
const SOFA_BACK_HEIGHT = 0.9;

// The original section of the L, which also holds the corner: seat facing the
// TV (-x), backrest along its whole +x side, an armrest at the back end. The
// chaise meets its seat side near the front end, at the same seat height.
// Decoration only: not clickable, and it opens no popup.
export function Sofa({ p }: { p: ScenePalette }) {
  const { x0: x, y0: y, x1, y1 } = FOOTPRINT_BY_ID.sofa;
  const back = shade(p.sofa, 0.9);
  return (
    <Faces
      faces={[
        ...box(x, y, 0, x1 - x, y1 - y, SOFA_SEAT_Z, p.sofa),
        ...box(x, y, SOFA_SEAT_Z, 1.1, 0.3, 0.4, p.sofa),
        ...box(x1 - SOFA_BACK_DEPTH, y, SOFA_SEAT_Z, SOFA_BACK_DEPTH, y1 - y, SOFA_BACK_HEIGHT, back),
        ...box(x + 0.2, y + 2.0, SOFA_SEAT_Z, 0.5, 0.6, 0.35, p.rugB),
      ]}
    />
  );
}

// The front part of the L: a chaise along the rug's front-left edge, one block
// at the sofa's seat height and color, with no backrest or armrest, so it
// continues the sofa seat. Bucky lies on its left end, fully in view. The
// chaise is his: a click on it opens his popup, like a click on him.
export function SofaFront({ p }: { p: ScenePalette }) {
  const { x0: x, y0: y, x1, y1 } = FOOTPRINT_BY_ID["sofa-front"];
  return (
    <>
      <SceneObject objectKey="bucky">
        <Faces faces={box(x, y, 0, x1 - x, y1 - y, SOFA_SEAT_Z, p.sofa)} />
      </SceneObject>
      <Bucky />
    </>
  );
}

export function Lamp({ p }: { p: ScenePalette }) {
  const [gx, gy] = project(0.4, 5.55, 3.1);
  return (
    <>
      <ellipse cx={gx.toFixed(1)} cy={gy.toFixed(1)} rx={62} ry={42} fill={p.glow} opacity={p.isDark ? 0.24 : 0.09} />
      <Faces
        faces={[
          ...box(0.2, 5.35, 0, 0.4, 0.4, 0.08, p.brass),
          ...box(0.35, 5.5, 0.08, 0.1, 0.1, 2.8, shade(p.brass, 0.85)),
          ...box(0.2, 5.35, 2.85, 0.4, 0.4, 0.55, p.lampShade),
        ]}
      />
    </>
  );
}

// Acoustic guitar against the back wall in the back-left corner, where nothing is drawn over it. Decoration only.
export function Guitar({ p }: { p: ScenePalette }) {
  const { x0: x, y0: y } = FOOTPRINT_BY_ID.guitar;
  const neck = shade(p.wood, 0.7);
  const front = y + 0.25;
  return (
    <Faces
      faces={[
        // Lower and upper bouts.
        ...box(x, y, 0, 0.6, 0.25, 0.55, p.guitar),
        ...box(x + 0.08, y + 0.02, 0.55, 0.44, 0.21, 0.4, p.guitar),
        // Sound hole and bridge on the front face.
        qy(front - 0.019, x + 0.22, x + 0.38, 0.66, 0.82, p.tv),
        qy(front + 0.001, x + 0.18, x + 0.42, 0.22, 0.27, p.tv),
        // Neck and headstock.
        ...box(x + 0.26, y + 0.06, 0.95, 0.08, 0.08, 1.2, neck),
        ...box(x + 0.23, y + 0.04, 2.15, 0.14, 0.1, 0.3, neck),
      ]}
    />
  );
}

// 1.4 high, so on screen its top stays clear of the gaming chair behind it.
export function Plant({ p }: { p: ScenePalette }) {
  const { x0: x, y0: y } = FOOTPRINT_BY_ID.plant;
  return (
    <Faces
      faces={[
        ...box(x, y, 0, 0.45, 0.45, 0.45, p.pot),
        ...box(x + 0.05, y + 0.05, 0.45, 0.35, 0.35, 0.4, p.leaf),
        ...box(x, y, 0.8, 0.45, 0.45, 0.35, shade(p.leaf, 1.15)),
        ...box(x + 0.08, y + 0.08, 1.12, 0.3, 0.3, 0.28, p.leaf),
      ]}
    />
  );
}
