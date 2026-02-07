export default function LazyLoader() {
    return (
        <div className="lazy-loader" role="status" aria-live="polite">
            <div className="lazy-loader__spinner" />
            <span className="lazy-loader__text">Loading…</span>
        </div>
    );
}