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

// Text lying flat on a horizontal surface at height z, `h` world units tall.
// "x": reads along world +x, letter tops toward -y (for a reader at +y).
// "-y": reads along world -y, letter tops toward -x (for a reader at +x).
export function ZText({
  x,
  y,
  z,
  h,
  fill,
  reads = "x",
  children,
}: {
  x: number;
  y: number;
  z: number;
  h: number;
  fill: string;
  reads?: "x" | "-y";
  children: string;
}) {
  const [sx, sy] = project(x, y, z);
  const k = h / 70;
  const basis = reads === "x" ? [k * U, k * V, -k * U, k * V] : [k * U, -k * V, k * U, k * V];
  const m = basis.map((v) => v.toFixed(4)).join(",");
  return (
    <text className="room-svg-text" transform={`matrix(${m},${sx.toFixed(1)},${sy.toFixed(1)})`} textAnchor="middle" fontSize="100" fill={fill}>
      {children}
    </text>
  );
}

// Shapes painted on a plane of constant x (facing +x), like XText. Children are
// drawn in a local 100 x 100 box centered on (0, 0), y down, which maps to `h`
// world units; (x, y, z) is the center.
export function XIcon({ x, y, z, h, children }: { x: number; y: number; z: number; h: number; children: ReactNode }) {
  const [sx, sy] = project(x, y, z);
  const k = h / 100;
  const m = [k * U, -k * V, 0, k * Z].map((v) => v.toFixed(4)).join(",");
  return <g transform={`matrix(${m},${sx.toFixed(1)},${sy.toFixed(1)})`}>{children}</g>;
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
