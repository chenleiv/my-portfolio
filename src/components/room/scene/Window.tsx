import { project, qy } from "../iso";
import type { ScenePalette } from "../palettes";
import { Faces } from "./primitives";

// Window to the beach on the back wall, above the computer. Decoration only.
export function Window({ p }: { p: ScenePalette }) {
  const [sx, sy] = project(8.1, 0, 3.95);
  return (
    <g>
      <Faces
        faces={[
          qy(0, 5.95, 8.85, 2.75, 4.4, p.frame),
          qy(0, 6.05, 8.75, 3.55, 4.3, p.sky),
          qy(0, 6.05, 8.75, 3.2, 3.55, p.sea),
          qy(0, 6.05, 8.75, 2.85, 3.2, p.sand),
        ]}
      />
      <circle cx={sx.toFixed(1)} cy={sy.toFixed(1)} r={9} fill={p.sun} />
      <Faces
        faces={[
          qy(0, 7.38, 7.42, 2.85, 4.3, p.frame),
          qy(0, 6.05, 8.75, 3.53, 3.57, p.frame),
          qy(0, 5.75, 6.25, 2.6, 4.5, p.curtain),
          qy(0, 8.55, 9.05, 2.6, 4.5, p.curtain),
          qy(0, 5.6, 9.2, 4.45, 4.52, p.brass),
        ]}
      />
    </g>
  );
}
