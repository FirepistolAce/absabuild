import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../Contexts/UserContext'

function Navigation() {
  const { isLoggedIn, user, logout } = useUser()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { path: '/snapshot', label: 'Snapshot' },
    { path: '/tracks', label: 'Strategy Tracks' },
    { path: '/simulation', label: 'Simulation Lab' },
  ]

  const isActive = (path) => location.pathname.startsWith(path)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'KM'

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoAbsa}>ABSA</span>
          <span style={styles.logoStudio}>NextGen</span>
        </Link>

        {isLoggedIn && (
          <div style={styles.links}>
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  ...styles.link,
                  ...(isActive(link.path) ? styles.linkActive : {}),
                }}
              >
                {link.label}
                {isActive(link.path) && <span style={styles.linkUnderline} />}
              </Link>
            ))}
          </div>
        )}

        <div style={styles.right}>
          {isLoggedIn ? (
            <div style={styles.userMenu}>
              <button
                style={styles.avatar}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="User menu"
              >
                {initials}
              </button>
              {menuOpen && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownName}>{user?.name}</div>
                  <div style={styles.dropdownDivider} />
                  <button style={styles.dropdownItem} onClick={handleLogout}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/" style={styles.signInLink}>Sign in</Link>
          )}
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 'var(--nav-height)',
    background: '#1A1A2E',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  inner: {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    padding: '0 24px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
  },
  logoAbsa: {
    fontSize: '18px',
    fontWeight: 800,
    color: '#CC0000',
    letterSpacing: '0.04em',
  },
  logoStudio: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: '0.02em',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  link: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.55)',
    textDecoration: 'none',
    position: 'relative',
    paddingBottom: '2px',
    transition: 'color 0.2s',
  },
  linkActive: {
    color: '#FFFFFF',
  },
  linkUnderline: {
    position: 'absolute',
    bottom: '-4px',
    left: 0,
    right: 0,
    height: '2px',
    background: '#CC0000',
    borderRadius: '1px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userMenu: {
    position: 'relative',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: '#2C3E6B',
    color: '#B5D4F4',
    fontSize: '12px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-family)',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    background: '#242438',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '8px',
    minWidth: '160px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  },
  dropdownName: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    padding: '6px 10px',
  },
  dropdownDivider: {
    height: '1px',
    background: 'rgba(255,255,255,0.08)',
    margin: '4px 0',
  },
  dropdownItem: {
    width: '100%',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    color: '#CC0000',
    fontSize: '13px',
    fontWeight: 500,
    padding: '8px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    transition: 'background 0.15s',
  },
  signInLink: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
    textDecoration: 'none',
  },
}

export default Navigation