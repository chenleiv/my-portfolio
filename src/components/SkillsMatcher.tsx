import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFocus } from "../utils/useFocus";

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
            "REST API",
            "Git",
            "Jira",
            "Node.js",
            "Nx",
        ],
    },
    {
        id: "other",
        title: "Other skills",
        skills: [
            "Curiosity",
            "Quick learning",
            "Detail-oriented",
            "Ownership",
            "Problem solving",
            "Team player",
            "Time management",

        ],
    },
];

const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

type Props = {
    scrollTargetId?: string;
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

    useEffect(() => {
        if (!exposeGlobalOpener) return;

        window.openSkillMatcher = openModal;

        return () => {
            delete window.openSkillMatcher;
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
            setSearchProgress((prev) => Math.min(prev + 4, 100));
        }, 60);

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
                                            ? "Tap skills to add them"
                                            : "Click or drag to input to add skills"}
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

                                    <div className="skills-groups-container">
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
                                    </div>
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

                                        <div className="search-slot" aria-live="polite">
                                            <AnimatePresence mode="wait">
                                                {isSearching ? (
                                                    <motion.div
                                                        key="progress"
                                                        className="search-slot__item"
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -6 }}
                                                        transition={{ duration: 0.18, ease: "easeOut" }}
                                                    >
                                                        <div className="search-progress" aria-label="Search progress">
                                                            <div className="search-progress__track">
                                                                <div
                                                                    className="search-progress__bar"
                                                                    style={{ width: `${searchProgress}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ) : isMatch ? (
                                                    <motion.div
                                                        key="match"
                                                        className="search-slot__item match-message"
                                                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                                        transition={{ duration: 0.22, ease: "easeOut" }}
                                                    >
                                                        <motion.span
                                                            className="match-message__glow"
                                                            initial={{ opacity: 0, scale: 0.85 }}
                                                            animate={{ opacity: [0, 1, 0], scale: [0.85, 1.15, 1.25] }}
                                                            transition={{ duration: 0.9, ease: "easeOut" }}
                                                        />

                                                        <span className="match-message__text">Found the perfect match → </span>

                                                        <motion.button
                                                            type="button"
                                                            className="match-link"
                                                            onClick={goToProfile}
                                                            whileHover={{ y: -1 }}
                                                            whileTap={{ scale: 0.98 }}
                                                        >
                                                            View profile
                                                        </motion.button>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="empty"
                                                        className="search-slot__item"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                    />
                                                )}
                                            </AnimatePresence>
                                        </div>
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