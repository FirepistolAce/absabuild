// Page wrapper — consistent max-width and padding for all pages

function PageWrapper({ children, style: extraStyle = {} }) {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px',
      ...extraStyle,
    }}>
      {children}
    </div>
  )
}

export default PageWrapper