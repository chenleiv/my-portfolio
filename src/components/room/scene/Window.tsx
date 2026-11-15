import { project, qy } from "../iso";
import type { ScenePalette } from "../palettes";
import { Faces, SceneObject } from "./primitives";

// Window to the beach on the back wall.
export function Window({ p }: { p: ScenePalette }) {
  const [sx, sy] = project(3.7, 0, 3.45);
  return (
    <SceneObject objectKey="win">
      <Faces
        faces={[
          qy(0, 1.1, 4.5, 1.5, 4.1, p.frame),
          qy(0, 1.25, 4.35, 2.9, 3.95, p.sky),
          qy(0, 1.25, 4.35, 2.35, 2.9, p.sea),
          qy(0, 1.25, 4.35, 1.65, 2.35, p.sand),
        ]}
      />
      <circle cx={sx.toFixed(1)} cy={sy.toFixed(1)} r={11} fill={p.sun} />
      <Faces
        faces={[
          qy(0, 2.78, 2.82, 1.65, 3.95, p.frame),
          qy(0, 1.25, 4.35, 2.77, 2.81, p.frame),
          qy(0, 0.95, 1.55, 1.2, 4.4, p.curtain),
          qy(0, 4.05, 4.65, 1.2, 4.4, p.curtain),
          qy(0, 0.8, 4.8, 4.35, 4.42, p.brass),
        ]}
      />
    </SceneObject>
  );
}
