// SVG donut chart component
// Used for fixed cost load and allocation displays

function DonutChart({ percentage, color, size = 100, strokeWidth = 12, label }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(100, Math.max(0, percentage))
  const offset = circumference - (pct / 100) * circumference

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: size > 80 ? '16px' : '13px',
          fontWeight: 800,
          color,
          lineHeight: 1,
        }}>
          {pct}%
        </div>
        {label && (
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
            {label}
          </div>
        )}
      </div>
    </div>
  )
}

export default DonutChart