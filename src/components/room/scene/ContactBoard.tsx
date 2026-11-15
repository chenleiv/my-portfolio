import { qy } from "../iso";
import type { ScenePalette } from "../palettes";
import { Faces, SceneObject, YText } from "./primitives";

// One emoji per way to reach Chen, with a caption under each. The popup has the links.
const ITEMS = [
  { emoji: "✉️", caption: "Email", x: 1.85 },
  { emoji: "💼", caption: "LinkedIn", x: 2.8 },
  { emoji: "💻", caption: "GitHub", x: 3.75 },
] as const;

// Framed board on the back wall, where the window used to be.
export function ContactBoard({ p }: { p: ScenePalette }) {
  return (
    <SceneObject objectKey="contact">
      <Faces faces={[qy(0, 1.2, 4.4, 1.8, 4.05, p.frame), qy(0, 1.3, 4.3, 1.9, 3.95, p.paper)]} />
      {ITEMS.map((item) => (
        <g key={item.caption}>
          <YText x={item.x} z={3.15} h={0.75} className="room-svg-emoji">
            {item.emoji}
          </YText>
          <YText x={item.x} z={2.25} h={0.28} fill={p.boardText}>
            {item.caption}
          </YText>
        </g>
      ))}
    </SceneObject>
  );
}
