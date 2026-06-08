// Nudge card component
// Contextual financial alerts — dismissible, non-intrusive

import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'

function NudgeCard({ nudge }) {
  const { dismissNudge, dismissedNudges } = useUser()
  const navigate = useNavigate()

  if (dismissedNudges.includes(nudge.id)) return null

  return (
    <div style={{
      background: nudge.bg,
      borderLeft: `3px solid ${nudge.color}`,
      borderRadius: '0 10px 10px 0',
      padding: '12px 16px',
      display: 'flex',
      gap: '14px',
      alignItems: 'flex-start',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: nudge.color,
          marginBottom: '4px',
        }}>
          {nudge.type}
        </div>
        <div style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.55,
        }}>
          {nudge.text}
        </div>
        {nudge.action && nudge.actionRoute && (
          <button
            onClick={() => navigate(nudge.actionRoute)}
            style={{
              marginTop: '8px',
              background: 'none',
              border: 'none',
              color: nudge.color,
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'var(--font-family)',
              textDecoration: 'underline',
            }}
          >
            {nudge.action} →
          </button>
        )}
      </div>
      <button
        onClick={() => dismissNudge(nudge.id)}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.3)',
          cursor: 'pointer',
          fontSize: '18px',
          lineHeight: 1,
          padding: '0 0 0 8px',
          fontFamily: 'var(--font-family)',
          flexShrink: 0,
        }}
        title="Dismiss"
      >
        ×
      </button>
    </div>
  )
}

export default NudgeCard