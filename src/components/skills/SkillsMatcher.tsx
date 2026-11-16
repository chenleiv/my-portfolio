"use client";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type AnimationEvent,
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    // While closing, the modal stays mounted until its exit animation ends.
    const [isClosing, setIsClosing] = useState(false);

    const modalRef = useRef<HTMLDivElement>(null);
    const lastActiveElementRef = useRef<HTMLElement | null>(null);

    const openModal = () => {
        lastActiveElementRef.current = document.activeElement as HTMLElement | null;
        setIsClosing(false);
        setIsModalOpen(true);
        window.setTimeout(() => modalRef.current?.focus(), 0);
    };

    const closeModal = () => {
        setIsClosing(true);
        window.setTimeout(() => lastActiveElementRef.current?.focus(), 0);
    };

    const finishClosing = useCallback(() => {
        setIsModalOpen(false);
        setIsClosing(false);
    }, []);

    const onModalAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
        if (isClosing && e.target === e.currentTarget) finishClosing();
    };

    // Fallback in case animationend never fires; the exit animation takes 0.22s.
    useEffect(() => {
        if (!isClosing) return;
        const id = window.setTimeout(finishClosing, 400);
        return () => window.clearTimeout(id);
    }, [isClosing, finishClosing]);

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
            {isModalOpen && (
                <div
                    className={`skills-modalOverlay${isClosing ? " is-closing" : ""}`}
                    onMouseDown={(e: MouseEvent<HTMLDivElement>) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div
                        className="skills-modal"
                        ref={modalRef}
                        tabIndex={-1}
                        onKeyDown={(e) => trapFocus(e, modalRef.current)}
                        onAnimationEnd={onModalAnimationEnd}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Skills"
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
                                <Skills />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
