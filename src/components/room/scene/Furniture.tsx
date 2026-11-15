import { box, project, qx, qy, qz, shade, type Face } from "../iso";
import type { ScenePalette } from "../palettes";
import { Faces, SceneObject } from "./primitives";

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
    // Chair.
    ...box(6.9, 2.3, 0, 1.0, 1.0, 0.5, p.cab),
    ...box(6.9, 2.3, 0.5, 1.0, 1.0, 0.3, p.sofa),
    ...box(6.9, 2.15, 0.8, 1.0, 0.15, 1.2, p.cab),
  ];
  return (
    <SceneObject objectKey="desk">
      <Faces faces={faces} />
    </SceneObject>
  );
}

export function CoffeeTable({ p }: { p: ScenePalette }) {
  const legs: [number, number][] = [[2.65, 7.25], [3.85, 7.25], [2.65, 8.65], [3.85, 8.65]];
  const faces: Face[] = [
    ...box(2.6, 7.2, 0.5, 1.4, 1.6, 0.12, p.wood),
    ...legs.flatMap(([x, y]) => box(x, y, 0, 0.1, 0.1, 0.5, shade(p.wood, 0.8))),
    // The CV: a sheet of paper with an accent header stripe.
    qz(0.63, 3.0, 3.6, 7.6, 8.4, "#ffffff"),
    qz(0.64, 3.05, 3.5, 7.7, 7.78, p.accent),
  ];
  return (
    <SceneObject objectKey="cv">
      <Faces faces={faces} />
    </SceneObject>
  );
}

export function Sofa({ p }: { p: ScenePalette }) {
  return (
    <SceneObject objectKey="tv">
      <Faces
        faces={[
          ...box(6.4, 6.4, 0, 1.5, 3.0, 0.8, p.sofa),
          ...box(6.4, 6.4, 0.8, 1.1, 0.3, 0.4, p.sofa),
          ...box(6.4, 9.1, 0.8, 1.1, 0.3, 0.4, p.sofa),
          ...box(7.5, 6.4, 0.8, 0.4, 3.0, 0.9, shade(p.sofa, 0.9)),
          ...box(6.6, 8.4, 0.8, 0.5, 0.6, 0.35, p.rugB),
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
