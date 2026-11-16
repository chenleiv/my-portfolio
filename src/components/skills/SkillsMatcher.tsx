"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    useEffect,
    useRef,
    useState,
    type MouseEvent,
} from "react";
import { Skills } from "./Skills";

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
        // Opened only through window.openSkillMatcher, from the skills() console command.
        <div className="skills-root">
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
                            aria-label="Skills"
                            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24, scale: shouldReduceMotion ? 1 : 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 24, scale: shouldReduceMotion ? 1 : 0.97 }}
                            transition={!shouldReduceMotion ? { duration: 0.22, ease: [0.16, 1, 0.3, 1] } : undefined}
                        >
                            <div className="skills-modal__header">
                                <div>
                                    <h2 className="skills-modal__title">
                                        Skills
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
                                    <Skills variant="groups" />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
