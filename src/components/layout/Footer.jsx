import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.left}>
          <span style={styles.logo}>ABSA</span>
          <span style={styles.name}>NextGen Wealth Studio</span>
        </div>
        <div style={styles.links}>
          <Link to="/glossary" style={styles.link}>Glossary</Link>
          <Link to="/simulation" style={styles.link}>Simulation Lab</Link>
          <Link to="/tracks" style={styles.link}>Strategy Tracks</Link>
        </div>
        <div style={styles.disclaimer}>
          Not financial advice · For educational purposes only · South African context
        </div>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background: '#0C0C14',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    padding: '20px 24px',
    marginTop: 'auto',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logo: {
    fontSize: '16px',
    fontWeight: 800,
    color: '#CC0000',
  },
  name: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
  },
  links: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
    textDecoration: 'none',
  },
  disclaimer: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.2)',
  },
}

export default Footer