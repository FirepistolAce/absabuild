// Badge component — status indicators and category tags

function Badge({ children, variant = 'default', style: extraStyle = {} }) {
  const variants = {
    default: { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' },
    red: { background: 'rgba(204,0,0,0.15)', color: '#CC0000' },
    teal: { background: 'var(--color-teal-light)', color: 'var(--color-teal)' },
    purple: { background: 'var(--color-purple-light)', color: 'var(--color-purple)' },
    coral: { background: 'var(--color-coral-light)', color: 'var(--color-coral)' },
    amber: { background: 'var(--color-amber-light)', color: 'var(--color-amber)' },
    navy: { background: 'var(--color-bg-secondary)', color: 'rgba(255,255,255,0.7)' },
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: '11px',
      fontWeight: 600,
      padding: '3px 10px',
      borderRadius: 'var(--radius-full)',
      letterSpacing: '0.03em',
      ...variants[variant],
      ...extraStyle,
    }}>
      {children}
    </span>
  )
}

export default Badge