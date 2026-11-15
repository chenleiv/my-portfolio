import { qx, qy, qz, shade, WALL_H, type Face } from "../iso";
import type { ScenePalette } from "../palettes";
import { RUG } from "../roomContent";
import { Faces } from "./primitives";

function backgroundFaces(p: ScenePalette): Face[] {
  const f: Face[] = [];
  // Floor boards.
  for (let j = 0; j < 20; j++) f.push(qz(0, 0, 10, j * 0.5, j * 0.5 + 0.5, j % 2 ? p.floorA : p.floorB));
  // Walls.
  f.push(qy(0, 0, 10, 0, WALL_H, p.wallR), qx(0, 0, 10, 0, WALL_H, p.wallL));
  // Wainscoting with a top rail and panel lines.
  f.push(qy(0, 0, 10, 0, 1.6, p.wains), qx(0, 0, 10, 0, 1.6, shade(p.wains, 0.86)));
  f.push(qy(0, 0, 10, 1.6, 1.75, shade(p.wains, 1.15)), qx(0, 0, 10, 1.6, 1.75, shade(p.wains, 1.0)));
  for (let i = 0.6; i < 10; i += 1.6) {
    f.push(qy(0, i, i + 0.04, 0.3, 1.45, shade(p.wains, 0.8)));
    f.push(qx(0, i, i + 0.04, 0.3, 1.45, shade(p.wains, 0.7)));
  }
  // Skirting and ceiling trim.
  f.push(qy(0, 0, 10, 0, 0.25, shade(p.wains, 0.7)), qx(0, 0, 10, 0, 0.25, shade(p.wains, 0.62)));
  f.push(qy(0, 0, 10, WALL_H - 0.3, WALL_H, shade(p.wallR, 1.05)), qx(0, 0, 10, WALL_H - 0.3, WALL_H, shade(p.wallL, 1.0)));
  // One large rug: border, field, inner stripe and inner field.
  const inset = (d: number) => [RUG.x0 + d, RUG.x1 - d, RUG.y0 + d, RUG.y1 - d] as const;
  f.push(
    qz(0.03, ...inset(0), p.rugB),
    qz(0.04, ...inset(0.25), p.rug),
    qz(0.05, ...inset(0.7), shade(p.rugB, 0.9)),
    qz(0.06, ...inset(0.85), p.rug),
  );
  return f;
}

export function Background({ p }: { p: ScenePalette }) {
  return <Faces faces={backgroundFaces(p)} />;
}
