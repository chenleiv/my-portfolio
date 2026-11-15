import { box, project, qx, qy, qz, shade, type Face } from "../iso";
import type { ScenePalette } from "../palettes";
import { FOOTPRINT_BY_ID } from "../roomContent";
import { Faces, SceneObject, ZText } from "./primitives";

const PS5_WHITE = "#f2f2f2";
const PLANT_GREEN = "#2f6f4f";

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

export function Desk({ p }: { p: ScenePalette }) {
  const faces: Face[] = [
    // Desk top, leg and drawer unit.
    ...box(5.6, 0.3, 1.4, 3.4, 1.5, 0.2, p.wood),
    ...box(5.7, 1.5, 0, 0.2, 0.2, 1.4, shade(p.wood, 0.8)),
    ...box(8.0, 0.4, 0, 0.95, 1.35, 1.4, shade(p.wood, 0.9)),
    // Monitor and keyboard.
    ...box(7.2, 0.5, 1.6, 0.3, 0.3, 0.15, p.tv),
    ...box(6.6, 0.6, 1.6, 1.6, 0.14, 1.0, p.tv),
    qy(0.74, 6.7, 8.1, 1.7, 2.5, p.screen),
    ...box(6.7, 1.0, 1.6, 1.2, 0.35, 0.05, shade(p.tv, 1.6)),
    // Desk plant.
    ...box(5.9, 0.5, 1.6, 0.3, 0.3, 0.05, p.brass),
    ...box(6.0, 0.6, 1.65, 0.05, 0.05, 0.4, p.brass),
    ...box(5.9, 0.5, 2.0, 0.3, 0.25, 0.15, PLANT_GREEN),
  ];
  return (
    <SceneObject objectKey="desk">
      <Faces faces={faces} />
    </SceneObject>
  );
}

// A separate scene item from the desk so Chen can stand in front of the desk
// and behind the chair at the same time. Clicking it still opens Projects.
export function Chair({ p }: { p: ScenePalette }) {
  return (
    <SceneObject objectKey="desk">
      <Faces
        faces={[
          ...box(6.9, 2.3, 0, 1.0, 1.0, 0.5, p.cab),
          ...box(6.9, 2.3, 0.5, 1.0, 1.0, 0.3, p.sofa),
          ...box(6.9, 2.15, 0.8, 1.0, 0.15, 1.2, p.cab),
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

// A small stack of loose script pages. Lower pages are offset and slightly
// darker so the stack reads as several sheets.
function ScriptPages({ x, y }: { x: number; y: number }) {
  const w = 0.8;
  const d = 1.0;
  const top = 0.64;
  const pad = 0.05;
  return (
    <>
      <Faces
        faces={[
          qz(0.625, x + 0.06, x + 0.06 + w, y + 0.06, y + 0.06 + d, shade(PAGE_WHITE, 0.86)),
          qz(0.632, x - 0.04, x - 0.04 + w, y + 0.08, y + 0.08 + d, shade(PAGE_WHITE, 0.93)),
          qz(top, x, x + w, y, y + d, PAGE_WHITE),
          ...SCRIPT_LINES.map((share, i) => {
            const ly = y + 0.4 + i * 0.13;
            return qz(top + 0.001, x + pad, x + pad + (w - pad * 2) * share, ly, ly + 0.04, PAGE_LINE);
          }),
        ]}
      />
      <ZText x={x + w / 2} y={y + 0.27} z={top + 0.002} h={0.13} fill={PAGE_INK}>
        SCRIPT
      </ZText>
    </>
  );
}

// Decoration only; the CV now hangs on the contact board. Loose script pages lie on top.
export function CoffeeTable({ p }: { p: ScenePalette }) {
  const { x0: x, y0: y } = FOOTPRINT_BY_ID["coffee-table"];
  const legs: [number, number][] = [[x + 0.05, y + 0.05], [x + 1.25, y + 0.05], [x + 0.05, y + 1.45], [x + 1.25, y + 1.45]];
  return (
    <>
      <Faces
        faces={[
          ...box(x, y, 0.5, 1.4, 1.6, 0.12, p.wood),
          ...legs.flatMap(([lx, ly]) => box(lx, ly, 0, 0.1, 0.1, 0.5, shade(p.wood, 0.8))),
        ]}
      />
      <ScriptPages x={x + 0.3} y={y + 0.35} />
    </>
  );
}

export function Sofa({ p }: { p: ScenePalette }) {
  const { x0: x, y0: y } = FOOTPRINT_BY_ID.sofa;
  return (
    <SceneObject objectKey="tv">
      <Faces
        faces={[
          ...box(x, y, 0, 1.5, 3.0, 0.8, p.sofa),
          ...box(x, y, 0.8, 1.1, 0.3, 0.4, p.sofa),
          ...box(x, y + 2.7, 0.8, 1.1, 0.3, 0.4, p.sofa),
          ...box(x + 1.1, y, 0.8, 0.4, 3.0, 0.9, shade(p.sofa, 0.9)),
          ...box(x + 0.2, y + 2.0, 0.8, 0.5, 0.6, 0.35, p.rugB),
        ]}
      />
    </SceneObject>
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

export function Plant({ p }: { p: ScenePalette }) {
  return (
    <Faces
      faces={[
        ...box(9.0, 8.9, 0, 0.45, 0.45, 0.5, p.pot),
        ...box(9.05, 8.95, 0.5, 0.35, 0.35, 0.5, p.leaf),
        ...box(9.0, 8.9, 0.95, 0.45, 0.45, 0.45, shade(p.leaf, 1.15)),
        ...box(9.08, 8.98, 1.35, 0.3, 0.3, 0.35, p.leaf),
      ]}
    />
  );
}
