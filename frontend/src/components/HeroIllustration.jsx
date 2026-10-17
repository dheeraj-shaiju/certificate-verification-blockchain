/**
 * Home page illustration: certificate PDF -> SHA-256 fingerprint -> block on the chain.
 * It is a drawing of the idea only. It contains no real student data and no QR code.
 */
export default function HeroIllustration() {
  return (
    <svg className="hero-art" viewBox="0 0 640 380" role="img" aria-labelledby="hero-art-title">
      <title id="hero-art-title">
        A certificate PDF is turned into a fingerprint, which is stored in a block on the blockchain
      </title>

      {/* Certificate document */}
      <g transform="translate(20 46)">
        <rect width="180" height="250" rx="6" fill="var(--paper)" />
        <rect
          x="8"
          y="8"
          width="164"
          height="234"
          rx="3"
          fill="none"
          stroke="#0e7490"
          strokeOpacity="0.45"
        />
        <rect x="35" y="32" width="110" height="7" rx="3.5" fill="#0e7490" opacity="0.75" />
        <rect x="45" y="62" width="90" height="13" rx="4" fill="#111a3a" />
        <rect x="24" y="92" width="132" height="5" rx="2.5" fill="#c3c9dd" />
        <rect x="34" y="105" width="112" height="5" rx="2.5" fill="#c3c9dd" />
        <rect x="24" y="118" width="132" height="5" rx="2.5" fill="#c3c9dd" />
        <rect x="48" y="138" width="84" height="8" rx="4" fill="#0e7490" opacity="0.55" />
        <polygon points="90,166 112,178.5 112,203.5 90,216 68,203.5 68,178.5" fill="var(--cyan)" />
        <path
          d="M80 191l7 7 13-14"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="20" y="226" width="46" height="2" fill="#a9b1ca" />
        <rect x="114" y="226" width="46" height="2" fill="#a9b1ca" />
      </g>
      <text x="110" y="330" textAnchor="middle" className="art-label">
        Certificate PDF
      </text>

      {/* Connector: document -> fingerprint */}
      <path className="flow-line" d="M206 190 H240" />

      {/* Fingerprint */}
      <g transform="translate(244 166)">
        <rect width="160" height="48" rx="24" fill="var(--panel-raised)" stroke="var(--violet)" />
        <text x="80" y="20" textAnchor="middle" className="art-small" fill="var(--violet)">
          SHA-256
        </text>
        <text x="80" y="37" textAnchor="middle" className="art-code">
          9f2c · · · e41a
        </text>
      </g>
      <text x="324" y="246" textAnchor="middle" className="art-label">
        Unique fingerprint
      </text>

      {/* Connector: fingerprint -> block */}
      <path className="flow-line flow-line-late" d="M408 190 H436" />

      {/* Chain of blocks */}
      <g>
        <rect
          x="440"
          y="40"
          width="190"
          height="60"
          rx="10"
          fill="var(--panel)"
          stroke="var(--line)"
        />
        <text x="535" y="76" textAnchor="middle" className="art-small" fill="var(--muted)">
          Block n − 1
        </text>
        <path d="M535 100 V160" stroke="var(--line)" strokeWidth="2" />

        <rect
          x="440"
          y="160"
          width="190"
          height="60"
          rx="10"
          fill="var(--panel-raised)"
          stroke="var(--cyan)"
          strokeWidth="1.5"
        />
        <text x="535" y="186" textAnchor="middle" className="art-strong">
          Block n
        </text>
        <text x="535" y="205" textAnchor="middle" className="art-small" fill="var(--cyan)">
          stores the fingerprint
        </text>
        <path d="M535 220 V280" stroke="var(--line)" strokeWidth="2" />

        <rect
          x="440"
          y="280"
          width="190"
          height="60"
          rx="10"
          fill="var(--panel)"
          stroke="var(--line)"
        />
        <text x="535" y="316" textAnchor="middle" className="art-small" fill="var(--muted)">
          Block n + 1
        </text>
      </g>
      <text x="535" y="368" textAnchor="middle" className="art-label">
        Ethereum (next phase)
      </text>
    </svg>
  );
}
