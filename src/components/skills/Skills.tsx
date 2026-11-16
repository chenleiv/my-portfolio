import { SKILL_GROUPS } from "./skillsData";

// The one place that renders skills: the four group cards with titles and
// icons, from the one data source (skillsData.ts). Used by the room's Skills
// popup and the skills() console command, so both always show the same.
export function Skills() {
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
