// The hexagon mark used in the navbar (same shape as the review slides).
export default function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <polygon points="32,3 58,17.5 58,46.5 32,61 6,46.5 6,17.5" fill="var(--cyan)" />
      <path
        d="M21 33l7 7 15-16"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
