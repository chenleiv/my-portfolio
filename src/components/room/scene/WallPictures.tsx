import { leftWallPoints, project, qx } from "../iso";
import type { ScenePalette } from "../palettes";
import { Faces } from "./primitives";

// Code-bracket frame on the left wall near the front corner, past the paw frame.
const CODE = { y0: 9.0, y1: 9.85 } as const;
const CODE_DESIGN_WIDTH = 0.9;

// Places the "</>" mark, designed left to right on a 0.9-wide frame, on the left
// wall. Larger y is further left on screen, so it is mirrored to read the same way.
function codeMark(list: readonly (readonly [number, number])[]): string {
  const k = (CODE.y1 - CODE.y0) / CODE_DESIGN_WIDTH;
  return leftWallPoints(list.map(([d, z]) => [CODE.y1 - d * k, z] as const));
}

// Decorative frames: a tree near the back corner of the left wall, a code
// bracket near the front corner of the left wall, and a paw print above the TV.
export function WallPictures({ p }: { p: ScenePalette }) {
  const paw = project(0, 7.7, 3.4);
  const toes = [project(0, 7.3, 3.9), project(0, 7.55, 4.0), project(0, 7.85, 4.0), project(0, 8.1, 3.9)];
  return (
    <>
      <Faces faces={[qx(0, 0.7, 1.7, 2.9, 4.1, p.frame), qx(0, 0.8, 1.6, 3.0, 4.0, p.paper)]} />
      <polygon
        points={leftWallPoints([[1.2, 3.88], [1.5, 3.76], [1.5, 3.4], [1.2, 3.08], [0.9, 3.4], [0.9, 3.76]])}
        fill={p.art1}
      />
      <Faces faces={[qx(0, 1.18, 1.22, 3.3, 3.55, p.paper)]} />

      <Faces faces={[qx(0, CODE.y0, CODE.y1, 2.9, 4.1, p.frame), qx(0, CODE.y0 + 0.08, CODE.y1 - 0.08, 3.0, 4.0, p.paper)]} />
      <g fill="none" stroke={p.art2} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
        <polyline points={codeMark([[0.3, 3.75], [0.15, 3.5], [0.3, 3.25]])} />
        <polyline points={codeMark([[0.6, 3.75], [0.75, 3.5], [0.6, 3.25]])} />
        <polyline points={codeMark([[0.52, 3.82], [0.42, 3.18]])} />
      </g>

      <Faces faces={[qx(0, 6.6, 8.8, 3.0, 4.3, p.frame), qx(0, 6.7, 8.7, 3.1, 4.2, p.paper)]} />
      <g fill={p.art2}>
        <ellipse cx={paw[0].toFixed(1)} cy={paw[1].toFixed(1)} rx={11} ry={8} />
        {toes.map(([cx, cy], i) => (
          <ellipse key={i} cx={cx.toFixed(1)} cy={cy.toFixed(1)} rx={5} ry={4} />
        ))}
      </g>
    </>
  );
}
