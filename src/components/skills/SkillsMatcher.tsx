"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    useEffect,
    useRef,
    useState,
    useCallback,
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
    if (!e.shiftKey && active === last) { e.preventDefault(); first?.focus(); }
    if (e.shiftKey && active === first) { e.preventDefault(); last?.focus(); }
};

const SCRATCH_THRESHOLD = 0.42;
const BRUSH_RADIUS = 40;

let runtimeRevealed = false;

export default function SkillsMatcher({
    scrollTargetId = "home",
    exposeGlobalOpener = true,
}: Props) {
    const isMobile = useIsMobile(768);
    const { focusConsoleInput } = useFocus();
    const shouldReduceMotion = useReducedMotion();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRevealed, setIsRevealed] = useState(() => runtimeRevealed);
    const [revealAnimating, setRevealAnimating] = useState(() => runtimeRevealed);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const lastActiveElementRef = useRef<HTMLElement | null>(null);
    const isDrawingRef = useRef(false);
    const isRevealedRef = useRef(runtimeRevealed);

    const drawOverlay = useCallback((canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#a4b0c4");
        grad.addColorStop(0.25, "#c8d4e6");
        grad.addColorStop(0.55, "#dce6f4");
        grad.addColorStop(0.8, "#bcc8da");
        grad.addColorStop(1, "#98a6bc");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        const sheen = ctx.createLinearGradient(0, 0, 0, h * 0.45);
        sheen.addColorStop(0, "rgba(255,255,255,0.4)");
        sheen.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = sheen;
        ctx.fillRect(0, 0, w, h * 0.45);

        ctx.save();
        ctx.globalAlpha = 0.07;
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 1.5;
        for (let x = -h; x < w + h; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + h, h);
            ctx.stroke();
        }
        ctx.restore();

        const cx = w / 2;
        const cy = h / 2;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const titleSize = Math.max(13, Math.min(20, h * 0.075));
        const subSize = Math.max(10, Math.min(13, h * 0.052));

        ctx.shadowColor = "rgba(255,255,255,0.6)";
        ctx.shadowBlur = 4;

        ctx.font = `bold ${titleSize}px system-ui, -apple-system, sans-serif`;
        ctx.fillStyle = "rgba(18, 26, 50, 0.82)";
        ctx.fillText("✦  Scratch to reveal my skills", cx, cy - subSize * 0.8);

        ctx.shadowBlur = 0;
        ctx.font = `${subSize}px system-ui, -apple-system, sans-serif`;
        ctx.fillStyle = "rgba(18, 26, 50, 0.48)";
        ctx.fillText(
            isMobile ? "Drag your finger across" : "Drag across the card to reveal my skills",
            cx, cy + titleSize * 0.7
        );
    }, [isMobile]);

    const initCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const parent = canvas.parentElement;
        if (!parent) return;
        const { width, height } = parent.getBoundingClientRect();
        if (!width || !height) return;
        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        drawOverlay(canvas);
    }, [drawOverlay]);

    useEffect(() => {
        if (!isModalOpen || isRevealedRef.current) return;
        const t = window.setTimeout(initCanvas, 80);
        return () => window.clearTimeout(t);
    }, [isModalOpen, initCanvas]);

    const scratchAt = useCallback((x: number, y: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
    }, []);

    const checkThreshold = useCallback(() => {
        if (isRevealedRef.current) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let transparent = 0;
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] < 128) transparent++;
        }
        if (transparent / (data.length / 4) >= SCRATCH_THRESHOLD) {
            isRevealedRef.current = true;
            runtimeRevealed = true;
            setIsRevealed(true);
        }
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        isDrawingRef.current = true;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        scratchAt(
            (e.clientX - rect.left) * (canvas.width / rect.width),
            (e.clientY - rect.top) * (canvas.height / rect.height)
        );
    }, [scratchAt]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawingRef.current) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        scratchAt(
            (e.clientX - rect.left) * (canvas.width / rect.width),
            (e.clientY - rect.top) * (canvas.height / rect.height)
        );
        checkThreshold();
    }, [scratchAt, checkThreshold]);

    const handleMouseUp = useCallback(() => {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;
        checkThreshold();
    }, [checkThreshold]);

    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        isDrawingRef.current = true;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        scratchAt(
            (touch.clientX - rect.left) * (canvas.width / rect.width),
            (touch.clientY - rect.top) * (canvas.height / rect.height)
        );
    }, [scratchAt]);

    const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if (!isDrawingRef.current) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        scratchAt(
            (touch.clientX - rect.left) * (canvas.width / rect.width),
            (touch.clientY - rect.top) * (canvas.height / rect.height)
        );
        checkThreshold();
    }, [scratchAt, checkThreshold]);

    const handleTouchEnd = useCallback(() => {
        isDrawingRef.current = false;
        checkThreshold();
    }, [checkThreshold]);

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
        window.setTimeout(() => { focusConsoleInput(); }, 250);
    };

    let globalIdx = 0;

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
                                    <p className="skills-modal__sub">
                                        {isMobile
                                            ? "Scratch to reveal if my skills are a match"
                                            : "Scratch the card — find out if I have the skills you're looking for"}
                                    </p>
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
                                <div className="skills-section-container scratch-card-wrapper" id="skills">
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
                                                    {group.skills.map((skill: string) => {
                                                        const idx = globalIdx++;
                                                        return (
                                                            <span
                                                                key={skill}
                                                                className={`skill-item${revealAnimating ? " skill-item--pop" : ""}`}
                                                                style={revealAnimating ? { animationDelay: `${idx * 0.028}s` } : undefined}
                                                            >
                                                                {skill}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <AnimatePresence onExitComplete={() => setRevealAnimating(true)}>
                                        {!isRevealed && (
                                            <motion.div
                                                className="scratch-canvas-wrapper"
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: shouldReduceMotion ? 0.01 : 0.5 }}
                                            >
                                                <canvas
                                                    ref={canvasRef}
                                                    className="scratch-canvas"
                                                    onMouseDown={handleMouseDown}
                                                    onMouseMove={handleMouseMove}
                                                    onMouseUp={handleMouseUp}
                                                    onMouseLeave={handleMouseUp}
                                                    onTouchStart={handleTouchStart}
                                                    onTouchMove={handleTouchMove}
                                                    onTouchEnd={handleTouchEnd}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <AnimatePresence>
                                    {isRevealed && (
                                        <motion.div
                                            className="scratch-cta"
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.35, delay: 0.25 }}
                                        >
                                            <span className="scratch-cta__text">Congratulations! You found your match</span>
                                            <button
                                                type="button"
                                                className="match-link"
                                                onClick={goToProfile}
                                            >
                                                Back to my portfolio →
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
