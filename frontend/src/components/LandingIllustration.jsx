/**
 * Illustration for the start page: a graduate holding a degree certificate while a
 * magnifying glass checks its seal, with blockchain nodes in the background.
 * Drawn with plain SVG shapes, so it needs no image files.
 */
export default function LandingIllustration() {
  return (
    <svg
      className="landing-art"
      viewBox="0 0 520 430"
      role="img"
      aria-labelledby="landing-art-title"
    >
      <title id="landing-art-title">
        A graduate holds a degree certificate while a magnifying glass checks its seal
      </title>

      <defs>
        <clipPath id="landing-art-frame">
          <rect x="10" y="30" width="500" height="400" rx="16" />
        </clipPath>
      </defs>
      <rect x="10" y="30" width="500" height="400" rx="16" fill="var(--tint)" />

      <g clipPath="url(#landing-art-frame)">
        {/* Blockchain nodes in the background */}
        <g stroke="#c3cee3" strokeWidth="2">
          <line x1="54" y1="70" x2="118" y2="34" />
          <line x1="118" y1="34" x2="140" y2="118" />
          <line x1="54" y1="70" x2="140" y2="118" />
          <line x1="54" y1="70" x2="36" y2="168" />
          <line x1="140" y1="118" x2="36" y2="168" />
          <line x1="456" y1="196" x2="500" y2="262" />
          <line x1="500" y1="262" x2="470" y2="318" />
        </g>
        <g>
          <circle cx="54" cy="70" r="9" fill="var(--cyan)" opacity="0.85" />
          <circle cx="118" cy="34" r="7" fill="var(--violet)" opacity="0.85" />
          <circle cx="140" cy="118" r="10" fill="var(--mint)" opacity="0.8" />
          <circle cx="36" cy="168" r="6" fill="var(--violet)" opacity="0.7" />
          <circle cx="500" cy="262" r="7" fill="var(--cyan)" opacity="0.7" />
          <circle cx="470" cy="318" r="5" fill="var(--violet)" opacity="0.7" />
        </g>

        {/* The certificate, slightly tilted */}
        <g transform="rotate(-5 310 220)">
          <rect
            x="180"
            y="60"
            width="260"
            height="320"
            rx="10"
            fill="var(--paper)"
            stroke="#d6dde8"
          />
          <rect
            x="192"
            y="72"
            width="236"
            height="296"
            rx="5"
            fill="none"
            stroke="#0e7490"
            strokeOpacity="0.4"
          />
          <rect x="240" y="100" width="140" height="10" rx="5" fill="#0e7490" opacity="0.8" />
          <rect x="255" y="132" width="110" height="16" rx="5" fill="#111a3a" />
          <rect x="215" y="170" width="190" height="6" rx="3" fill="#c3c9dd" />
          <rect x="230" y="184" width="160" height="6" rx="3" fill="#c3c9dd" />
          <rect x="215" y="198" width="190" height="6" rx="3" fill="#c3c9dd" />
          <rect x="250" y="220" width="120" height="9" rx="4.5" fill="#0e7490" opacity="0.55" />
          <rect x="210" y="332" width="60" height="2" fill="#a9b1ca" />
          <rect x="210" y="340" width="40" height="2" fill="#a9b1ca" />
        </g>

        {/* Verified badge */}
        <circle cx="452" cy="92" r="24" fill="var(--mint)" />
        <path
          d="M441 92l8 8 15-16"
          fill="none"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Magnifying glass over the seal, showing it enlarged */}
        <line
          x1="404"
          y1="318"
          x2="458"
          y2="376"
          stroke="var(--violet)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <circle cx="372" cy="282" r="50" fill="#ffffff" stroke="#1c2430" strokeWidth="9" />
        <circle cx="372" cy="282" r="44" fill="rgba(29, 78, 216, 0.08)" />
        <polygon points="372,250 400,266 400,298 372,314 344,298 344,266" fill="var(--cyan)" />
        <path
          d="M359 283l9 9 18-19"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M342 254 a42 42 0 0 1 22 -14"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.5"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Graduate */}
        <path d="M28 430 C28 352 70 322 120 322 C170 322 212 352 212 430 Z" fill="#2b3272" />
        <path d="M96 322 L120 354 L144 322 Z" fill="var(--cyan)" />
        {/* arm holding the certificate */}
        <path
          d="M170 346 C188 332 196 312 204 296"
          fill="none"
          stroke="#2b3272"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <circle cx="206" cy="292" r="12" fill="#c98f6b" />
        {/* head and cap */}
        <circle cx="120" cy="286" r="32" fill="#c98f6b" />
        <path d="M94 262 L94 277 Q120 288 146 277 L146 262 Z" fill="#1c2448" />
        <polygon points="66,256 120,232 174,256 120,276" fill="#111a3a" />
        <path d="M120 254 L166 264 L166 292" fill="none" stroke="var(--mint)" strokeWidth="3" />
        <circle cx="166" cy="295" r="5" fill="var(--mint)" />
      </g>
    </svg>
  );
}
