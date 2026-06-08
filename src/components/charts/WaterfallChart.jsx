// Waterfall chart for income breakdown
// Shows gross salary cascading down to take-home

function WaterfallChart({ items }) {
  if (!items || items.length === 0) return null

  const maxValue = Math.max(...items.map(i => Math.abs(i.value)))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {items.map((item, idx) => {
        const width = maxValue > 0 ? Math.max(4, (Math.abs(item.value) / maxValue) * 100) : 0
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.45)',
              minWidth: '92px',
              textAlign: 'right',
            }}>
              {item.label}
            </div>
            <div style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '3px',
              height: '6px',
            }}>
              <div style={{
                width: `${width}%`,
                height: '6px',
                borderRadius: '3px',
                background: item.color,
                transition: 'width 0.5s ease',
              }} />
            </div>
            <div style={{
              fontSize: '10px',
              fontWeight: 600,
              minWidth: '74px',
              textAlign: 'right',
              color: item.highlight ? item.color : 'rgba(255,255,255,0.55)',
            }}>
              {item.formatted}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default WaterfallChart