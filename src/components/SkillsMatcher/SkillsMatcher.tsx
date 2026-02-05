import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFocus } from "../../utils/useFocus";

type SkillGroup = {
    id: "technical" | "other";
    title: string;
    skills: string[];
};

const SKILL_GROUPS: SkillGroup[] = [
    {
        id: "technical",
        title: "Technical skills",
        skills: [
            "TypeScript",
            "React",
            "Angular",
            "JavaScript",
            "SASS",
            "HTML",
            "Regex",
            "REST API",
            "Git",
            "Node.js",
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
        ],
    },
];

const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

type Props = {
    /** where to scroll when clicking "View profile" (defaults to "home") */
    scrollTargetId?: string;
    /** optional: keep backwards compat for console commands */
    exposeGlobalOpener?: boolean;
};

export default function SkillsMatcher({
    scrollTargetId = "home",
    exposeGlobalOpener = true,
}: Props) {
    const skillGroups = useMemo(() => SKILL_GROUPS, []);
    const { focusConsoleInput } = useFocus();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchProgress, setSearchProgress] = useState(0);
    const [isMatch, setIsMatch] = useState(false);

    const [draggedSkill, setDraggedSkill] = useState<string | null>(null);

    const progressIntervalRef = useRef<number | null>(null);
    const searchTimeoutRef = useRef<number | null>(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const clearTimers = () => {
        if (progressIntervalRef.current !== null) {
            window.clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
        if (searchTimeoutRef.current !== null) {
            window.clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = null;
        }
    };

    useEffect(() => {
        return () => clearTimers();
    }, []);

    // Optional: expose opener for console commands
    useEffect(() => {
        if (!exposeGlobalOpener) return;

        (window as any).openSkillMatcher = openModal;
        return () => {
            delete (window as any).openSkillMatcher;
        };
    }, [exposeGlobalOpener]);

    // Close on Escape
    useEffect(() => {
        if (!isModalOpen) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isModalOpen]);

    const inputValue = useMemo(() => selectedSkills.join(", "), [selectedSkills]);

    const addSkill = (skill: string) => {
        setSelectedSkills((prev) => (prev.includes(skill) ? prev : [...prev, skill]));
    };

    const clearAll = () => {
        clearTimers();
        setSelectedSkills([]);
        setIsSearching(false);
        setSearchProgress(0);
        setIsMatch(false);
    };

    const handleSearch = () => {
        if (selectedSkills.length === 0) return;

        clearTimers();
        setIsSearching(true);
        setIsMatch(false);
        setSearchProgress(0);

        progressIntervalRef.current = window.setInterval(() => {
            setSearchProgress((prev) => {
                if (prev >= 100) return 100;
                return prev + 10;
            });
        }, 100);

        searchTimeoutRef.current = window.setTimeout(() => {
            clearTimers();
            setIsSearching(false);
            setSearchProgress(100);
            setIsMatch(true);
        }, 1000);
    };

    const canDrag = !isMobile();

    const handleDropToInput = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!draggedSkill) return;
        addSkill(draggedSkill);
    };

    const goToProfile = () => {
        // close modal, scroll to top/main, focus console
        closeModal();

        // Try: provided target id -> console -> about -> top
        const target =
            document.getElementById(scrollTargetId) ??
            document.getElementById("console") ??
            document.getElementById("about");

        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        // Focus your console input (existing behavior)
        window.setTimeout(() => {
            focusConsoleInput();
        }, 250);
    };

    return (
        <div className="skills-root">
            <button
                type="button"
                className="skills-fab"
                onClick={openModal}
                aria-label="Recruiter mode"
                title="Recruiter mode"
            >
                Recruiter mode
            </button>

            <div>
                {isModalOpen && (
                    <motion.div
                        className="skills-modalOverlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onMouseDown={(e) => {
                            if (e.target === e.currentTarget) closeModal();
                        }}
                    >
                        <motion.div
                            className="skills-modal"
                            initial={{ opacity: 0, y: 18, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 18, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                        >
                            <div className="skills-modal__header">
                                <div>
                                    <div className="skills-modal__title">
                                        What skills should your ideal candidate have?
                                    </div>
                                    <div className="skills-modal__sub">
                                        {isMobile()
                                            ? "Tap skills to add them."
                                            : "Click or drag to input to add skills."}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="skills-modal__close"
                                    onClick={closeModal}
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="skills-modal__content">
                                <div className="skills-section-container" id="skills">
                                    {skillGroups.map((group) => (
                                        <div key={group.id} className="skills-group">
                                            <h3 className="skills-group__title">{group.title}</h3>

                                            <div className="skills-list">
                                                {group.skills.map((skill) => {
                                                    const selected = selectedSkills.includes(skill);

                                                    return (
                                                        <motion.div
                                                            key={skill}
                                                            draggable={canDrag && !selected}
                                                            onDragStart={() => setDraggedSkill(skill)}
                                                            onDragEnd={() => setDraggedSkill(null)}
                                                            onClick={() => addSkill(skill)}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className={`skill-item ${selected ? "selected" : ""}`}
                                                            style={{ cursor: "pointer" }}
                                                            aria-pressed={selected}
                                                            role="button"
                                                        >
                                                            {skill}
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="skills-inputs-container">
                                        <div
                                            className="skills-input-container"
                                            onDrop={canDrag ? handleDropToInput : undefined}
                                            onDragOver={canDrag ? (e) => e.preventDefault() : undefined}
                                        >
                                            <input
                                                type="text"
                                                value={inputValue}
                                                placeholder="* required"
                                                readOnly
                                                className="skills-input"
                                                aria-label="Required skills"
                                            />
                                        </div>
                                    </div>

                                    <div className="search-container">
                                        <div className="button-group">
                                            <button
                                                type="button"
                                                className="search-button"
                                                onClick={handleSearch}
                                                disabled={selectedSkills.length === 0 || isSearching}
                                            >
                                                {isSearching ? "Searching..." : "Search Matches"}
                                            </button>

                                            {(selectedSkills.length > 0 || isMatch) && (
                                                <button
                                                    type="button"
                                                    className="clear-button"
                                                    onClick={clearAll}
                                                    disabled={isSearching}
                                                >
                                                    Clear Selection
                                                </button>
                                            )}
                                        </div>





                                        <AnimatePresence>
                                            <motion.div
                                                key="match"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="match-message"
                                            >

                                                <div>
                                                    {isSearching && (
                                                        <div className="search-progress" aria-label="Search progress">
                                                            <div className="progress-bar" style={{ width: `${searchProgress}%` }} />
                                                            <span className="progress-text">{searchProgress}%</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {!isSearching && isMatch && (
                                                    <div className="match-message">
                                                        <div>Perfect match detected 🤖</div>

                                                        <button
                                                            type="button"
                                                            className="match-link"
                                                            onClick={goToProfile}
                                                        >
                                                            View profile →
                                                        </button>

                                                    </div>
                                                )}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}