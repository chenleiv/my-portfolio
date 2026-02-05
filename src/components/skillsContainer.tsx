import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type DragEvent, type MouseEvent } from "react";
import { useFocus } from "../utils/useFocus";

type SkillGroup = {
  id: "technical" | "other";
  title: string;
  subtitle?: string;
  skills: string[];
};

const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "technical",
    title: "Technical",
    skills: ["TypeScript", "React", "Angular", "JavaScript", "HTML", "SASS", "Regex", "REST API", "Git", "Node.js", "Nx"
    ],
  },

  {
    id: "other",
    title: "Other skills",
    skills: [
      "Curiosity",
      "Quick learning",
      "Detail-oriented",
      "Communication",
      "Ownership",
      "Problem solving",
      "Team player",
      "Leadership",
    ],
  },
];

const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

const SkillsContainer = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [isMatch, setIsMatch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedSkill, setDraggedSkill] = useState<string | null>(null);

  const { focusConsoleInput } = useFocus();

  const addSkill = (skill: string) => {
    setSelected((prev) => (prev.includes(skill) ? prev : [...prev, skill]));
  };

  const removeSkill = (skill: string) => {
    setSelected((prev) => prev.filter((s) => s !== skill));
  };

  const clearAll = () => {
    setSelected([]);
    setIsMatch(false);
    setIsSearching(false);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSearch = () => {
    if (selected.length === 0) return;

    setIsSearching(true);
    setIsMatch(false);

    window.setTimeout(() => {
      setIsSearching(false);
      setIsMatch(true);

      focusConsoleInput();
    }, 700);
  };

  useEffect(() => {
    window.openSkillMatcher = openModal;
    return () => {
      delete window.openSkillMatcher;
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen]);

  // Drag support (desktop)
  const handleDropToSelected = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedSkill) return;
    addSkill(draggedSkill);
  };

  return (
    <div className="skills-root" id="skills">
      {/* FLOATING BUTTON */}
      <button
        type="button"
        className="skills-fab"
        onClick={openModal}
        aria-label="Recruiter mode"
        title="Recruiter mode"
      >
        Recruiter mode
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="skills-modalOverlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e: MouseEvent<HTMLDivElement>) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <motion.div
              className="skills-modal"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* HEADER */}
              <div className="skills-modal__header">
                <div>
                  <div className="skills-modal__title">Build your ideal candidate</div>
                  <div className="skills-modal__sub">
                    {isMobile()
                      ? "Tap skills to add them. Tap again to remove."
                      : "Click or drag skills into Selected."}
                  </div>
                </div>

                <button
                  type="button"
                  className="skills-modal__close"
                  onClick={closeModal}
                >
                  ✕
                </button>
              </div>

              {/* CONTENT */}
              <div className="skills-modal__content">
                {/* LEFT: PICK SKILLS (GROUPED) */}
                <div className="skills-modal__section">
                  <div className="skills-modal__sectionTitle">1) Pick skills</div>

                  <div className="skills-modal__pool">
                    {SKILL_GROUPS.map((group) => (
                      <div key={group.id} className="skills-group">
                        <div className="skills-group__header">
                          <div className="skills-group__title">{group.title}</div>
                          {group.subtitle ? (
                            <div className="skills-group__sub">{group.subtitle}</div>
                          ) : null}
                        </div>

                        <div className="skills-group__pool">
                          {group.skills.map((skill) => {
                            const picked = selected.includes(skill);

                            return (
                              <motion.button
                                key={skill}
                                type="button"
                                draggable={!isMobile()}
                                onDragStart={() => setDraggedSkill(skill)}
                                onDragEnd={() => setDraggedSkill(null)}
                                onClick={() => addSkill(skill)}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                className={`skills-modal__chip ${picked ? "is-picked" : ""}`}
                                aria-pressed={picked}
                              >
                                {skill}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: SELECTED + RESULT + ACTIONS */}
                <div
                  className="skills-modal__section skills-modal__section--right"
                  onDrop={!isMobile() ? handleDropToSelected : undefined}
                  onDragOver={!isMobile() ? (e: DragEvent<HTMLDivElement>) => e.preventDefault() : undefined}
                >
                  <div className="skills-modal__sectionTitle">
                    2) Selected {selected.length ? `(${selected.length})` : ""}
                  </div>

                  {selected.length === 0 ? (
                    <div className="skills-modal__empty">No skills selected yet</div>
                  ) : (
                    <div className="skills-modal__selectedChips">
                      {selected.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="skills-modal__selectedChip"
                          onClick={() => removeSkill(s)}
                          title="Remove"
                        >
                          {s} <span aria-hidden>×</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* RESULT AREA (CENTER) */}
                  <div className="skills-resultArea">
                    <AnimatePresence>
                      {isMatch && !isSearching && (
                        <motion.div
                          key="match-card"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="match-card"
                        >
                          <div className="match-card__title">Found the perfect match</div>
                          <div className="match-card__name">Chen Leiv</div>

                          <button
                            type="button"
                            className="match-card__cta"
                            onClick={() => {
                              closeModal();
                              document.getElementById("about")?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                            }}
                          >
                            View profile →
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!isMatch && !isSearching && (
                      <div className="skills-hint">Run match to see the result</div>
                    )}

                    {isSearching && <div className="skills-hint">Matching…</div>}
                  </div>

                  {/* ACTIONS BOTTOM */}
                  <div className="skills-actionsBottom">
                    <button
                      type="button"
                      className="skills-runMatch"
                      onClick={handleSearch}
                      disabled={selected.length === 0 || isSearching}
                    >
                      {isSearching ? "Matching…" : "Run match"}
                    </button>

                    <button
                      type="button"
                      className="skills-clearAll"
                      onClick={clearAll}
                      disabled={isSearching && selected.length === 0}
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillsContainer;