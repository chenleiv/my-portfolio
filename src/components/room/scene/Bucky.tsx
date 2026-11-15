import { box, project, qy, worldOffset, type Face } from "../iso";
import { BUCKY } from "../palettes";
import { Faces, SceneObject } from "./primitives";

// Bucky is drawn slightly larger than world scale around a pivot on the floor,
// then nudged onto the rug. Both are world points, so they follow the projection.
const SCALE = 1.3;
const PIVOT = project(4.142, 5.7, 0);
const NUDGE = worldOffset(0.771, 1.124);
const TRANSFORM = `translate(${(PIVOT[0] + NUDGE[0]).toFixed(1)},${(PIVOT[1] + NUDGE[1]).toFixed(1)}) scale(${SCALE}) translate(${(-PIVOT[0]).toFixed(1)},${(-PIVOT[1]).toFixed(1)})`;

function buckyFaces(): Face[] {
  const c = BUCKY;
  return [
    // Tail.
    ...box(4.3, 5.0, 0.05, 0.2, 0.45, 0.18, c.coat),
    ...box(4.3, 4.9, 0.05, 0.2, 0.15, 0.18, c.white),
    // Body.
    ...box(4.1, 5.4, 0, 0.7, 1.2, 0.55, c.coat),
    ...box(4.1, 5.4, 0, 0.7, 0.5, 0.3, c.tan),
    ...box(4.1, 6.2, 0, 0.7, 0.4, 0.5, c.white),
    // Front paws.
    ...box(4.15, 6.6, 0, 0.14, 0.6, 0.2, c.white),
    ...box(4.61, 6.6, 0, 0.14, 0.6, 0.2, c.white),
    // Head, muzzle and nose.
    ...box(4.15, 6.6, 0.2, 0.6, 0.5, 0.5, c.coat),
    ...box(4.25, 7.1, 0.2, 0.36, 0.32, 0.26, c.white),
    ...box(4.35, 7.42, 0.42, 0.14, 0.08, 0.1, c.features),
    // Ears.
    ...box(4.05, 6.7, 0.3, 0.1, 0.3, 0.4, c.coat),
    ...box(4.75, 6.7, 0.3, 0.1, 0.3, 0.4, c.coat),
    // Eyes and brows.
    qy(7.101, 4.18, 4.25, 0.5, 0.58, c.features),
    qy(7.101, 4.65, 4.72, 0.5, 0.58, c.features),
    qy(7.102, 4.16, 4.3, 0.62, 0.66, c.tan),
    qy(7.102, 4.6, 4.74, 0.62, 0.66, c.tan),
  ];
}

const FACES = buckyFaces();

export function Bucky() {
  return (
    <SceneObject objectKey="bucky">
      <g transform={TRANSFORM}>
        <Faces faces={FACES} />
      </g>
    </SceneObject>
  );
}
