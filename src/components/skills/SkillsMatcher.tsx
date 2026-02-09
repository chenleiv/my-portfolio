"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type DragEvent,
    type MouseEvent,
} from "react";
import { useFocus } from "../../utils/useFocus";
import { SKILL_GROUPS, SkillGroup } from "./skillsData";
import { useIsMobile } from "../../hooks/useIsMobile";


type Props = {
    scrollTargetId?: string;
    exposeGlobalOpener?: boolean;
};

const trapFocus = (e: React.KeyboardEvent, container: HTMLDivElement | null) => {
    if (e.key !== "Tab" || !container) return;

    const focusable = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (!e.shiftKey && active === last) {
        e.preventDefault();
        first?.focus();
    }

    if (e.shiftKey && active === first) {
        e.preventDefault();
        last?.focus();
    }
};

export default function SkillsMatcher({
    scrollTargetId = "home",
    exposeGlobalOpener = true,
}: Props) {
    const isMobile = useIsMobile(768);
    const skillGroups = useMemo(() => SKILL_GROUPS, []);
    const { focusConsoleInput } = useFocus();
    const shouldReduceMotion = useReducedMotion();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchProgress, setSearchProgress] = useState(0);
    const [isMatch, setIsMatch] = useState(false);
    const [draggedSkill, setDraggedSkill] = useState<string | null>(null);

    const progressIntervalRef = useRef<number | null>(null);
    const searchTimeoutRef = useRef<number | null>(null);

    const modalRef = useRef<HTMLDivElement>(null);
    const lastActiveElementRef = useRef<HTMLElement | null>(null);

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

    const openModal = () => {
        lastActiveElementRef.current = document.activeElement as HTMLElement | null;
        setIsModalOpen(true);

        window.setTimeout(() => modalRef.current?.focus(), 0);
    };

    const closeModal = () => {
        setIsModalOpen(false);

        window.setTimeout(() => lastActiveElementRef.current?.focus(), 0);
    };

    useEffect(() => {
        if (!exposeGlobalOpener) return;

        window.openSkillMatcher = openModal;

        return () => {
            delete window.openSkillMatcher;
        };
    }, [exposeGlobalOpener]);

    useEffect(() => {
        if (!isModalOpen) return;

        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        });
        return () => window.removeEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        });
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

    const canDrag = !isMobile;

    const handleDropToInput = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!draggedSkill) return;
        addSkill(draggedSkill);
    };

    const goToProfile = () => {
        closeModal();

        const target =
            document.getElementById(scrollTargetId) ??
            document.getElementById("console") ??
            document.getElementById("about");

        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

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

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="skills-modalOverlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        {...(!shouldReduceMotion && {
                            transition: { duration: 0.18, ease: "easeOut" },
                        })}
                        onMouseDown={(e: MouseEvent<HTMLDivElement>) => {
                            if (e.target === e.currentTarget) closeModal();
                        }}
                    >
                        <motion.div
                            className="skills-modal"
                            ref={modalRef}
                            tabIndex={-1}
                            onKeyDown={(e) => trapFocus(e, modalRef.current)}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Recruiter mode"
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18, scale: shouldReduceMotion ? 1 : 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 18, scale: shouldReduceMotion ? 1 : 0.98 }}
                            {...(!shouldReduceMotion && {
                                transition: { duration: 0.18, ease: "easeOut" },
                            })}
                        >
                            <div className="skills-modal__header">
                                <div>
                                    <div className="skills-modal__title">
                                        What skills should your ideal candidate have?
                                    </div>
                                    <div className="skills-modal__sub">
                                        {isMobile
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
                                        {skillGroups.map((group: SkillGroup) => (
                                            <div key={group.id} className="skills-group">
                                                <h3 className="skills-group__title">{group.title}</h3>

                                                <div className="skills-list">
                                                    {group.skills.map((skill: string) => {
                                                        const selected = selectedSkills.includes(skill);

                                                        return (
                                                            <motion.button
                                                                key={skill}
                                                                type="button"
                                                                draggable={canDrag && !selected}
                                                                onDragStart={() => setDraggedSkill(skill)}
                                                                onDragEnd={() => setDraggedSkill(null)}
                                                                onClick={() => addSkill(skill)}
                                                                className={`skill-item ${selected ? "selected" : ""}`}
                                                                aria-pressed={selected}
                                                                style={{ cursor: "pointer" }}
                                                                {...(!shouldReduceMotion && {
                                                                    whileHover: { scale: 1.05 },
                                                                    whileTap: { scale: 0.95 },
                                                                })}
                                                            >
                                                                {skill}
                                                            </motion.button>
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
                                            onDragOver={
                                                canDrag
                                                    ? (e: DragEvent<HTMLDivElement>) => e.preventDefault()
                                                    : undefined
                                            }
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
                                                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -6 }}
                                                        {...(!shouldReduceMotion && {
                                                            transition: { duration: 0.18, ease: "easeOut" },
                                                        })}
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
                                                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8, scale: shouldReduceMotion ? 1 : 0.98 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8, scale: shouldReduceMotion ? 1 : 0.98 }}
                                                        {...(!shouldReduceMotion && {
                                                            transition: { duration: 0.22, ease: "easeOut" },
                                                        })}
                                                    >
                                                        <motion.span
                                                            className="match-message__glow"
                                                            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.85 }}
                                                            animate={
                                                                shouldReduceMotion
                                                                    ? { opacity: 0 }
                                                                    : { opacity: [0, 1, 0], scale: [0.85, 1.15, 1.25] }
                                                            }
                                                            {...(!shouldReduceMotion && {
                                                                transition: { duration: 0.9, ease: "easeOut" },
                                                            })}
                                                        />

                                                        <span className="match-message__text">Found the perfect match → </span>

                                                        <motion.button
                                                            type="button"
                                                            className="match-link"
                                                            onClick={goToProfile}
                                                            {...(!shouldReduceMotion && {
                                                                whileHover: { y: -1 },
                                                                whileTap: { scale: 0.98 },
                                                            })}
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
            </AnimatePresence>
        </div>
    );
}