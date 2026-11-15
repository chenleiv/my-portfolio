// Isometric projection and shape helpers for the room scene.
// World units: x runs down-right along the right wall, y runs down-left along
// the left wall, z is height. The room floor is 10 x 10 and the walls are 5 high.

export const U = 34;
export const V = 19;
export const Z = 38;
export const OX = 380;
export const OY = 200;
export const WALL_H = 5;

export const VIEW_W = 760;
export const VIEW_H = 620;

export type Point3 = readonly [number, number, number];

export interface Face {
  readonly points: string;
  readonly fill: string;
}

export function project(x: number, y: number, z = 0): [number, number] {
  return [OX + (x - y) * U, OY + (x + y) * V - z * Z];
}

// Screen offset for a move in world space. The projection is affine, so a
// shape drawn at the origin can be moved with a single translate.
export function worldOffset(dx: number, dy: number, dz = 0): [number, number] {
  return [(dx - dy) * U, (dx + dy) * V - dz * Z];
}

export function shade(hex: string, factor: number): string {
  const n = parseInt(hex.slice(1), 16);
  return (
    "#" +
    [n >> 16, (n >> 8) & 255, n & 255]
      .map((v) => Math.max(0, Math.min(255, Math.round(v * factor))))
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

function points(list: readonly Point3[]): string {
  return list
    .map(([x, y, z]) => {
      const [sx, sy] = project(x, y, z);
      return `${sx.toFixed(1)},${sy.toFixed(1)}`;
    })
    .join(" ");
}

export function poly(list: readonly Point3[], fill: string): Face {
  return { points: points(list), fill };
}

// A solid block: top face, front-left (+y) face and front-right (+x) face.
export function box(x: number, y: number, z: number, w: number, d: number, h: number, color: string): Face[] {
  const x1 = x + w;
  const y1 = y + d;
  const z1 = z + h;
  return [
    poly([[x, y, z1], [x1, y, z1], [x1, y1, z1], [x, y1, z1]], shade(color, 1.12)),
    poly([[x, y1, z], [x1, y1, z], [x1, y1, z1], [x, y1, z1]], shade(color, 0.92)),
    poly([[x1, y, z], [x1, y1, z], [x1, y1, z1], [x1, y, z1]], shade(color, 0.74)),
  ];
}

// Flat quads on a plane of constant x, y or z.
export function qx(x: number, ya: number, yb: number, z0: number, z1: number, fill: string): Face {
  return poly([[x, ya, z0], [x, yb, z0], [x, yb, z1], [x, ya, z1]], fill);
}

export function qy(y: number, xa: number, xb: number, z0: number, z1: number, fill: string): Face {
  return poly([[xa, y, z0], [xb, y, z0], [xb, y, z1], [xa, y, z1]], fill);
}

export function qz(z: number, xa: number, xb: number, ya: number, yb: number, fill: string): Face {
  return poly([[xa, ya, z], [xb, ya, z], [xb, yb, z], [xa, yb, z]], fill);
}

// Points of a polyline drawn on the back wall (y = 0).
export function wallPoints(list: readonly (readonly [number, number])[]): string {
  return points(list.map(([x, z]) => [x, 0, z] as const));
}
