// Reusable button component
// Supports multiple variants, sizes, and states

function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  style: extraStyle = {},
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-family)',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s',
    letterSpacing: '0.01em',
    width: fullWidth ? '100%' : 'auto',
    textDecoration: 'none',
    lineHeight: 1.4,
  }

  const sizes = {
    sm: { fontSize: '12px', padding: '7px 14px' },
    md: { fontSize: '14px', padding: '10px 20px' },
    lg: { fontSize: '15px', padding: '13px 28px' },
  }

  const variants = {
    primary: {
      background: 'var(--color-red)',
      color: '#FFFFFF',
    },
    secondary: {
      background: 'rgba(255,255,255,0.06)',
      color: '#FFFFFF',
      border: '1px solid rgba(255,255,255,0.15)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-red)',
      border: '1px solid var(--color-red)',
    },
    teal: {
      background: 'var(--color-teal)',
      color: '#FFFFFF',
    },
    purple: {
      background: 'var(--color-purple)',
      color: '#FFFFFF',
    },
    ghost: {
      background: 'transparent',
      color: 'rgba(255,255,255,0.6)',
      border: '1px solid rgba(255,255,255,0.12)',
    },
    danger: {
      background: 'rgba(204,0,0,0.12)',
      color: 'var(--color-red)',
      border: '1px solid rgba(204,0,0,0.25)',
    },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...base,
        ...sizes[size],
        ...variants[variant],
        ...extraStyle,
      }}
    >
      {children}
    </button>
  )
}

export default Button