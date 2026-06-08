// Tooltip component — inline educational explainers
// Used throughout the app to explain SA financial terms

import { useState } from 'react'

function Tooltip({ term, definition, example }) {
  const [open, setOpen] = useState(false)

  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <span
        onClick={() => setOpen(!open)}
        style={{
          borderBottom: '1px dashed rgba(75,68,168,0.6)',
          color: 'var(--color-purple)',
          cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        {term}
      </span>
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99,
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#242438',
            border: '1px solid rgba(75,68,168,0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            width: '280px',
            zIndex: 100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-purple)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {term}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: example ? '8px' : 0 }}>
              {definition}
            </div>
            {example && (
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', fontStyle: 'italic' }}>
                {example}
              </div>
            )}
            <button
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: '8px', right: '10px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '16px', fontFamily: 'var(--font-family)' }}
            >
              ×
            </button>
          </div>
        </>
      )}
    </span>
  )
}

export default Tooltip