import { box, project, qx, worldOffset, type Face } from "../iso";
import { BUCKY } from "../palettes";
import { BUCKY_LAYOUT } from "../roomContent";
import { Faces, SceneObject } from "./primitives";

// Bucky is designed lying along world y inside BUCKY_LAYOUT.raw, head at +y.
// Swapping x and y turns him to lie along x with his head at +x, so his face
// is on a +x face, which the camera sees. The drawing is symmetric along his
// spine, so the swap does not mirror anything visible.
function sbox(x: number, y: number, z: number, w: number, d: number, h: number, color: string): Face[] {
  return box(y, x, z, d, w, h, color);
}

// The swapped box is scaled about its floor center, moved so that center lands
// on BUCKY_LAYOUT.center and lifted onto the seat. The projection is affine,
// so a screen scale about a floor point is a world scale.
const { raw, scale, center, lift } = BUCKY_LAYOUT;
const RAW_CENTER = [(raw.y0 + raw.y1) / 2, (raw.x0 + raw.x1) / 2] as const;
const PIVOT = project(RAW_CENTER[0], RAW_CENTER[1], 0);
const MOVE = worldOffset(center[0] - RAW_CENTER[0], center[1] - RAW_CENTER[1], lift);
const TRANSFORM = `translate(${(PIVOT[0] + MOVE[0]).toFixed(1)},${(PIVOT[1] + MOVE[1]).toFixed(1)}) scale(${scale}) translate(${(-PIVOT[0]).toFixed(1)},${(-PIVOT[1]).toFixed(1)})`;

function buckyFaces(): Face[] {
  const c = BUCKY;
  return [
    // Tail.
    ...sbox(4.3, 5.0, 0.05, 0.2, 0.45, 0.18, c.coat),
    ...sbox(4.3, 4.9, 0.05, 0.2, 0.15, 0.18, c.white),
    // Body.
    ...sbox(4.1, 5.4, 0, 0.7, 1.2, 0.55, c.coat),
    ...sbox(4.1, 5.4, 0, 0.7, 0.5, 0.3, c.tan),
    ...sbox(4.1, 6.2, 0, 0.7, 0.4, 0.5, c.white),
    // Front paws.
    ...sbox(4.15, 6.6, 0, 0.14, 0.6, 0.2, c.white),
    ...sbox(4.61, 6.6, 0, 0.14, 0.6, 0.2, c.white),
    // Head, muzzle and nose.
    ...sbox(4.15, 6.6, 0.2, 0.6, 0.5, 0.5, c.coat),
    ...sbox(4.25, 7.1, 0.2, 0.36, 0.32, 0.26, c.white),
    ...sbox(4.35, 7.42, 0.42, 0.14, 0.08, 0.1, c.features),
    // Ears.
    ...sbox(4.05, 6.7, 0.3, 0.1, 0.3, 0.4, c.coat),
    ...sbox(4.75, 6.7, 0.3, 0.1, 0.3, 0.4, c.coat),
    // Eyes and brows, on the front of the head (the +x face after the swap).
    qx(7.101, 4.18, 4.25, 0.5, 0.58, c.features),
    qx(7.101, 4.65, 4.72, 0.5, 0.58, c.features),
    qx(7.102, 4.16, 4.3, 0.62, 0.66, c.tan),
    qx(7.102, 4.6, 4.74, 0.62, 0.66, c.tan),
  ];
}

const FACES = buckyFaces();

// Drawn by the front sofa section, between its seat and its backrest.
export function Bucky() {
  return (
    <SceneObject objectKey="bucky">
      <g transform={TRANSFORM}>
        <Faces faces={FACES} />
      </g>
    </SceneObject>
  );
}
