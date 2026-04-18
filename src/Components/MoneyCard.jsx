function MoneyCard({
  label,
  value,
  sub,
  accent = '#4B44A8',
  negative = false,
  children,
  style: extraStyle = {},
}) {
  return (
    <div style={{ ...styles.card, borderTop: `3px solid ${accent}`, ...extraStyle }}>
      <div style={styles.label}>{label}</div>
      {value !== undefined && (
        <div style={{
          ...styles.value,
          color: negative ? '#CC0000' : '#FFFFFF',
        }}>
          {typeof value === 'number'
            ? `R${value.toLocaleString('en-ZA')}`
            : value}
        </div>
      )}
      {sub && <div style={styles.sub}>{sub}</div>}
      {children}
    </div>
  )
}

const styles = {
  card: {
    background: '#242438',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '20px',
  },
  label: {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.09em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '10px',
  },
  value: {
    fontSize: '26px',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    fontVariantNumeric: 'tabular-nums',
    marginBottom: '6px',
  },
  sub: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.35)',
    lineHeight: 1.5,
  },
}

export default MoneyCard