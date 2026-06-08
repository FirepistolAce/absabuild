// Progress bar component with colour coding and labels

function ProgressBar({
  value,
  max = 100,
  color,
  height = 6,
  showLabel = false,
  label,
  animate = true,
}) {
  const pct = Math.min(100, Math.round((value / max) * 100))

  // Auto colour based on percentage if not provided
  const autoColor = color || (pct >= 75 ? '#0D7A5F' : pct >= 40 ? '#B8860B' : '#CC0000')

  return (
    <div>
      {(showLabel || label) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          {label && <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{label}</span>}
          {showLabel && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{pct}%</span>}
        </div>
      )}
      <div style={{
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '999px',
        height: `${height}px`,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: autoColor,
          borderRadius: '999px',
          transition: animate ? 'width 0.6s ease' : 'none',
        }} />
      </div>
    </div>
  )
}

export default ProgressBar