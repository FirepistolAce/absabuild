// Card component — base container for all dashboard tiles

function Card({
  children,
  accent,
  style: extraStyle = {},
  onClick,
  hoverable = false,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-lg)',
        borderTop: accent ? `3px solid ${accent}` : undefined,
        cursor: onClick || hoverable ? 'pointer' : 'default',
        transition: hoverable ? 'transform 0.2s, box-shadow 0.2s' : undefined,
        ...extraStyle,
      }}
    >
      {children}
    </div>
  )
}

export function CardLabel({ children, color }) {
  return (
    <div style={{
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.09em',
      textTransform: 'uppercase',
      color: color || 'rgba(255,255,255,0.4)',
      marginBottom: '12px',
    }}>
      {children}
    </div>
  )
}

export function CardValue({ children, large = false, negative = false }) {
  return (
    <div style={{
      fontSize: large ? '32px' : '22px',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: negative ? 'var(--color-red)' : '#FFFFFF',
      fontVariantNumeric: 'tabular-nums',
      marginBottom: '4px',
    }}>
      {children}
    </div>
  )
}

export function CardSub({ children }) {
  return (
    <div style={{
      fontSize: '12px',
      color: 'rgba(255,255,255,0.35)',
      lineHeight: 1.5,
    }}>
      {children}
    </div>
  )
}

export default Card