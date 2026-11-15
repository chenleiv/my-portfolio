import { leftWallPoints, project, qx, qy, wallPoints } from "../iso";
import type { ScenePalette } from "../palettes";
import { Faces } from "./primitives";

// Decorative frames: a tree near the back corner of the left wall, a code
// bracket on the back wall between the contact board and the window, and a
// paw print above the TV.
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

      <Faces faces={[qy(0, 4.6, 5.5, 2.9, 4.1, p.frame), qy(0, 4.68, 5.42, 3.0, 4.0, p.paper)]} />
      <g fill="none" stroke={p.art2} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
        <polyline points={wallPoints([[4.9, 3.75], [4.75, 3.5], [4.9, 3.25]])} />
        <polyline points={wallPoints([[5.2, 3.75], [5.35, 3.5], [5.2, 3.25]])} />
        <polyline points={wallPoints([[5.12, 3.82], [5.02, 3.18]])} />
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
