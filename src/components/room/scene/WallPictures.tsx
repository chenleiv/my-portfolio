import { project, qx, qy, wallPoints } from "../iso";
import type { ScenePalette } from "../palettes";
import { Faces } from "./primitives";

// Decorative frames: a tree and a code bracket on the back wall, a paw print on the left wall.
export function WallPictures({ p }: { p: ScenePalette }) {
  const paw = project(0, 7.7, 3.4);
  const toes = [project(0, 7.3, 3.9), project(0, 7.55, 4.0), project(0, 7.85, 4.0), project(0, 8.1, 3.9)];
  return (
    <>
      <Faces faces={[qy(0, 5.8, 6.8, 2.9, 4.1, p.frame), qy(0, 5.9, 6.7, 3.0, 4.0, p.paper)]} />
      <polygon
        points={wallPoints([[6.3, 3.88], [6.6, 3.76], [6.6, 3.4], [6.3, 3.08], [6.0, 3.4], [6.0, 3.76]])}
        fill={p.art1}
      />
      <Faces faces={[qy(0, 6.28, 6.32, 3.3, 3.55, p.paper)]} />

      <Faces faces={[qy(0, 8.2, 9.1, 2.9, 4.1, p.frame), qy(0, 8.28, 9.02, 3.0, 4.0, p.paper)]} />
      <g fill="none" stroke={p.art2} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
        <polyline points={wallPoints([[8.5, 3.75], [8.35, 3.5], [8.5, 3.25]])} />
        <polyline points={wallPoints([[8.8, 3.75], [8.95, 3.5], [8.8, 3.25]])} />
        <polyline points={wallPoints([[8.72, 3.82], [8.62, 3.18]])} />
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
