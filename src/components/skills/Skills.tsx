import { SKILL_GROUPS } from "./skillsData";

interface SkillsProps {
  // "chips": one flat list of chips without the soft skills (room popup).
  // "groups": the four group cards with titles (skills() console command).
  variant: "chips" | "groups";
  // Class for the chip list in the "chips" variant, to match its container.
  chipsClassName?: string;
}

// The one place that renders skills, from the one data source (skillsData.ts),
// so the room popup and the skills() command always list the same skills.
export function Skills({ variant, chipsClassName = "skills-chips" }: SkillsProps) {
  if (variant === "chips") {
    const chips = SKILL_GROUPS.filter((g) => g.id !== "other").flatMap((g) => g.skills);
    return (
      <ul className={chipsClassName}>
        {chips.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="skills-groups-container">
      {SKILL_GROUPS.map((group) => (
        <div key={group.id} className="skills-group" data-group-id={group.id}>
          <h3 className="skills-group__title">
            <span className="skills-group__icon">{group.icon}</span>
            {group.title}
          </h3>
          <div className="skills-list">
            {group.skills.map((skill) => (
              <span key={skill} className="skill-item">
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
