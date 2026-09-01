export function HeroNetwork() {
  return (
    <div className="hero-network" aria-hidden="true">
      <svg className="hero-network-svg" viewBox="0 0 900 700" fill="none">
        <g stroke="rgba(0, 194, 168, 0.18)" strokeWidth="1.2">
          <path d="M120 140 L260 210 L390 120 L540 180 L700 110 L820 200" />
          <path d="M80 320 L220 280 L360 360 L520 300 L680 380 L840 320" />
          <path d="M160 520 L300 460 L450 540 L610 470 L760 560" />
          <path d="M260 210 L220 280 L300 460" />
          <path d="M390 120 L360 360 L450 540" />
          <path d="M540 180 L520 300 L610 470" />
          <path d="M700 110 L680 380 L760 560" />
        </g>
        <g fill="rgba(0, 194, 168, 0.35)">
          {[
            [120, 140],
            [260, 210],
            [390, 120],
            [540, 180],
            [700, 110],
            [820, 200],
            [80, 320],
            [220, 280],
            [360, 360],
            [520, 300],
            [680, 380],
            [840, 320],
            [160, 520],
            [300, 460],
            [450, 540],
            [610, 470],
            [760, 560],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" />
          ))}
        </g>
      </svg>

      <div className="hero-float-icon" style={{ top: "12%", right: "18%" }}>
        <WifiIcon />
      </div>
      <div className="hero-float-icon" style={{ top: "28%", right: "8%" }}>
        <PulseIcon />
      </div>
      <div className="hero-float-icon" style={{ top: "48%", right: "22%" }}>
        <SignalIcon />
      </div>
      <div className="hero-float-icon" style={{ bottom: "22%", right: "10%" }}>
        <ChipIcon />
      </div>
      <div className="hero-float-icon" style={{ top: "36%", left: "52%" }}>
        <DropIcon />
      </div>
    </div>
  );
}

function WifiIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 12.5a9 9 0 0 1 14 0" />
      <path d="M8.5 15.5a5 5 0 0 1 7 0" />
      <circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PulseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 12h3l2-5 3 10 2-5h8" />
    </svg>
  );
}

function SignalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 20V10" />
      <path d="M7 20v-6" />
      <path d="M17 20V4" />
    </svg>
  );
}

function ChipIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2" />
    </svg>
  );
}

function DropIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3s6 6.2 6 10a6 6 0 1 1-12 0c0-3.8 6-10 6-10z" />
    </svg>
  );
}
