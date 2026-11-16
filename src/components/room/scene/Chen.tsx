import { memo, type Ref } from "react";
import { box, qy, qz, type Face } from "../iso";
import { CHEN } from "../palettes";
import { Faces } from "./primitives";

// Chen is drawn once at the world origin. useWalker moves the outer group and
// swings the limb groups with transforms, so React never re-renders her per frame.
export const CHEN_PARTS = ["leg-left", "leg-right", "arm-left", "arm-right"] as const;
export type ChenPart = (typeof CHEN_PARTS)[number];

// How far each limb group swings, as a multiple of the stride offset in world y.
export const SWING: Record<ChenPart, number> = {
  "leg-left": 1,
  "leg-right": -1,
  "arm-left": -0.8,
  "arm-right": 0.8,
};

const c = CHEN;

const SHADOW: Face[] = [qz(0.02, -0.4, 0.4, -0.3, 0.3, "rgba(0,0,0,.16)")];

const LIMBS: Record<ChenPart, Face[]> = {
  "leg-left": [...box(-0.22, -0.12, 0, 0.18, 0.22, 0.64, c.jeans)],
  "leg-right": [...box(0.04, -0.12, 0, 0.18, 0.22, 0.64, c.jeans)],
  "arm-left": [...box(-0.4, -0.12, 0.7, 0.12, 0.24, 0.6, c.shirt), ...box(-0.4, -0.12, 0.62, 0.12, 0.24, 0.1, c.skin)],
  "arm-right": [...box(0.28, -0.12, 0.7, 0.12, 0.24, 0.6, c.shirt), ...box(0.28, -0.12, 0.62, 0.12, 0.24, 0.1, c.skin)],
};

const TORSO: Face[] = [
  ...box(-0.27, -0.28, 0.85, 0.54, 0.08, 1.1, c.hair), // hair behind
  ...box(-0.27, -0.2, 0.62, 0.54, 0.4, 0.78, c.shirt),
];

const HEAD: Face[] = [
  ...box(-0.24, -0.2, 1.4, 0.48, 0.4, 0.46, c.skin),
  ...box(-0.27, -0.23, 1.8, 0.54, 0.46, 0.14, c.hair),
  ...box(0.24, -0.2, 0.95, 0.06, 0.4, 0.95, c.hair),
  ...box(-0.27, 0.17, 0.95, 0.1, 0.07, 0.95, c.hair),
  ...box(0.17, 0.17, 0.95, 0.1, 0.07, 0.95, c.hair),
  ...box(-0.26, 0.18, 1.78, 0.52, 0.05, 0.1, c.hair),
  qy(0.215, -0.14, -0.08, 1.6, 1.68, c.features),
  qy(0.215, 0.08, 0.14, 1.6, 1.68, c.features),
  qy(0.215, -0.06, 0.06, 1.5, 1.53, c.mouth),
  ...box(-0.22, 0.1, 1.9, 0.44, 0.08, 0.06, c.features),
];

// Seen from behind (walking away): hair covers the head and falls down her back
// on the side the viewer sees, and there is no face.
const HEAD_BACK: Face[] = [
  ...box(-0.27, -0.23, 1.4, 0.54, 0.46, 0.54, c.hair),
  ...box(-0.27, 0.17, 0.95, 0.54, 0.08, 0.6, c.hair),
  ...box(0.24, -0.2, 0.95, 0.06, 0.4, 0.95, c.hair),
];

// Shoes point the way she faces: toes toward the viewer in the front view, away
// from it in the back view (only the heel shows behind the leg).
const SHOE_X: Partial<Record<ChenPart, number>> = { "leg-left": -0.23, "leg-right": 0.03 };
const shoe = (x: number, front: boolean): Face[] => box(x, front ? -0.1 : -0.26, 0, 0.2, 0.36, 0.1, c.shoes);

// Front of the shirt: a neckline, so the body shows which way she faces too.
const TORSO_FRONT: Face[] = [qy(0.201, -0.1, 0.1, 1.26, 1.4, c.skin)];

function Limb({ part }: { part: ChenPart }) {
  const sx = SHOE_X[part];
  return (
    <g data-part={part}>
      <Faces faces={LIMBS[part]} />
      {sx !== undefined && (
        <>
          <g data-view="front">
            <Faces faces={shoe(sx, true)} />
          </g>
          <g data-view="back" display="none">
            <Faces faces={shoe(sx, false)} />
          </g>
        </>
      )}
    </g>
  );
}

// Four ways to face: the drawing faces front-left (toward +y). useWalker mirrors
// the [data-flip] group for the right-hand directions, which swaps world x and y
// on screen, and swaps every [data-view] part (head, shoes, neckline) between
// the front and back views when she walks toward or away from the viewer.
function ChenFigure({ ref }: { ref: Ref<SVGGElement> }) {
  return (
    <g ref={ref} className="room-chen" aria-hidden="true">
      <g data-flip="">
        <Faces faces={SHADOW} />
        <Limb part="leg-left" />
        <Limb part="leg-right" />
        <Faces faces={TORSO} />
        <g data-view="front">
          <Faces faces={TORSO_FRONT} />
        </g>
        <Limb part="arm-left" />
        <Limb part="arm-right" />
        <g data-view="front">
          <Faces faces={HEAD} />
        </g>
        <g data-view="back" display="none">
          <Faces faces={HEAD_BACK} />
        </g>
      </g>
    </g>
  );
}

export const Chen = memo(ChenFigure);
