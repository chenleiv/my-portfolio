"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    useEffect,
    useRef,
    useState,
    type MouseEvent,
} from "react";
import { SKILL_GROUPS, SkillGroup } from "./skillsData";

type Props = {
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
    if (!e.shiftKey && active === last) { e.preventDefault(); first?.focus(); }
    if (e.shiftKey && active === first) { e.preventDefault(); last?.focus(); }
};

export default function SkillsMatcher({
    exposeGlobalOpener = true,
}: Props) {
    const shouldReduceMotion = useReducedMotion();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const modalRef = useRef<HTMLDivElement>(null);
    const lastActiveElementRef = useRef<HTMLElement | null>(null);

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
        return () => { delete window.openSkillMatcher; };
    }, [exposeGlobalOpener]);

    useEffect(() => {
        if (!isModalOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isModalOpen]);

    return (
        <div className="skills-root">
            <button
                type="button"
                className="skills-fab"
                onClick={openModal}
                aria-label="Recruiter mode"
                title="Recruiter mode"
            >
                🎯 Recruiter mode
            </button>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="skills-modalOverlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={!shouldReduceMotion ? { duration: 0.18, ease: "easeOut" } : undefined}
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
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24, scale: shouldReduceMotion ? 1 : 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 24, scale: shouldReduceMotion ? 1 : 0.97 }}
                            transition={!shouldReduceMotion ? { duration: 0.22, ease: [0.16, 1, 0.3, 1] } : undefined}
                        >
                            <div className="skills-modal__header">
                                <div>
                                    <h2 className="skills-modal__title">
                                        Recruiter Mode
                                        <span className="skills-modal__title-emoji">🎯</span>
                                    </h2>
                                    <p className="skills-modal__sub">The skills I bring</p>
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

                            <div
                                className="skills-modal__content"
                                role="region"
                                aria-label="Skills"
                                tabIndex={0}
                            >
                                <div className="skills-section-container" id="skills">
                                    <div className="skills-groups-container">
                                        {SKILL_GROUPS.map((group: SkillGroup) => (
                                            <div
                                                key={group.id}
                                                className="skills-group"
                                                data-group-id={group.id}
                                            >
                                                <h3 className="skills-group__title">
                                                    <span className="skills-group__icon">{group.icon}</span>
                                                    {group.title}
                                                </h3>
                                                <div className="skills-list">
                                                    {group.skills.map((skill: string) => (
                                                        <span key={skill} className="skill-item">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
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
