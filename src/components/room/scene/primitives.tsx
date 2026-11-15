import type { ReactNode } from "react";
import { project, type Face, U, V, Z } from "../iso";
import type { ObjectKey } from "../roomContent";

export function Faces({ faces }: { faces: readonly Face[] }) {
  return (
    <>
      {faces.map((f, i) => (
        <polygon key={i} points={f.points} fill={f.fill} />
      ))}
    </>
  );
}

// A clickable scene object. Pointer only: the HTML labels are the keyboard
// and screen reader controls, so this stays out of the tab order.
export function SceneObject({ objectKey, children }: { objectKey: ObjectKey; children: ReactNode }) {
  return (
    <g className="room-obj" data-room-key={objectKey}>
      {children}
    </g>
  );
}

// Text painted on the back wall plane (y = 0, facing +y), `h` world units tall.
export function YText({ x, z, h, fill, children }: { x: number; z: number; h: number; fill: string; children: string }) {
  const [sx, sy] = project(x, 0, z);
  const k = h / 70;
  const m = [k * U, k * V, 0, k * Z].map((v) => v.toFixed(4)).join(",");
  return (
    <text className="room-svg-text" transform={`matrix(${m},${sx.toFixed(1)},${sy.toFixed(1)})`} textAnchor="middle" fontSize="100" fill={fill}>
      {children}
    </text>
  );
}

// Text painted on a wall plane of constant x (facing +x), `h` world units tall.
export function XText({ x, y, z, h, fill, children }: { x: number; y: number; z: number; h: number; fill: string; children: string }) {
  const [sx, sy] = project(x, y, z);
  const k = h / 70;
  const m = [k * U, -k * V, 0, k * Z].map((v) => v.toFixed(4)).join(",");
  return (
    <text
      className="room-svg-text"
      transform={`matrix(${m},${sx.toFixed(1)},${sy.toFixed(1)})`}
      textAnchor="middle"
      fontSize="100"
      fill={fill}
    >
      {children}
    </text>
  );
}
