import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { glossaryTerms, glossaryCategories } from '../data/glossary'

function GlossaryPage() {
  const { isLoggedIn } = useUser()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedTerm, setExpandedTerm] = useState(null)

  if (!isLoggedIn) { navigate('/auth'); return null }

  const filtered = useMemo(() => {
    return glossaryTerms.filter(t => {
      const matchesSearch =
        search.trim() === '' ||
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        activeCategory === 'All' || t.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory])

  const getCategoryVariant = (cat) => {
    const map = {
      'Tax': 'red',
      'Investing': 'teal',
      'Property': 'purple',
      'Vehicle Finance': 'amber',
      'Financial Health': 'teal',
      'Insurance': 'amber',
    }
    return map[cat] || 'default'
  }

  return (
    <div style={styles.page}>
      <PageWrapper>

        {/* HEADER */}
        <div style={styles.eyebrow}>SA Financial Glossary</div>
        <h1 style={styles.pageTitle}>Every term. Plain language.</h1>
        <p style={styles.pageSub}>
          Every financial concept used in this product — explained in South African context.
          PAYE, TFSA, transfer duty, prime rate, CGT, bond registration, and more.
          No jargon without explanation.
        </p>

        {/* SEARCH */}
        <div style={styles.searchWrap}>
          <div style={styles.searchInner}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              style={styles.searchInput}
              type="text"
              placeholder="Search terms or definitions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                style={styles.searchClear}
                onClick={() => setSearch('')}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div style={styles.categoryRow}>
          {glossaryCategories.map(cat => (
            <button
              key={cat}
              style={{
                ...styles.categoryBtn,
                ...(activeCategory === cat ? styles.categoryBtnActive : {}),
              }}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* RESULT COUNT */}
        <div style={styles.resultCount}>
          {filtered.length} term{filtered.length !== 1 ? 's' : ''}
          {search && ` matching "${search}"`}
          {activeCategory !== 'All' && ` in ${activeCategory}`}
        </div>

        {/* TERM LIST */}
        {filtered.length > 0 ? (
          <div style={styles.termList}>
            {filtered.map(term => {
              const isExpanded = expandedTerm === term.id
              return (
                <div
                  key={term.id}
                  style={{
                    ...styles.termCard,
                    borderLeft: isExpanded ? '3px solid var(--color-purple)' : '3px solid transparent',
                  }}
                  onClick={() => setExpandedTerm(isExpanded ? null : term.id)}
                >
                  {/* TERM HEADER */}
                  <div style={styles.termHeader}>
                    <div style={styles.termHeaderLeft}>
                      <div style={styles.termName}>{term.term}</div>
                      <Badge variant={getCategoryVariant(term.category)}>
                        {term.category}
                      </Badge>
                    </div>
                    <div style={styles.termHeaderRight}>
                      {term.usedIn && (
                        <div style={styles.termUsedIn}>
                          Used in: {term.usedIn}
                        </div>
                      )}
                      <div style={{ ...styles.expandIcon, color: isExpanded ? 'var(--color-purple)' : 'rgba(255,255,255,0.3)' }}>
                        {isExpanded ? '▲' : '▼'}
                      </div>
                    </div>
                  </div>

                  {/* COLLAPSED PREVIEW */}
                  {!isExpanded && (
                    <div style={styles.termPreview}>
                      {term.definition.slice(0, 120)}…
                    </div>
                  )}

                  {/* EXPANDED CONTENT */}
                  {isExpanded && (
                    <div style={styles.termExpanded}>
                      <div style={styles.termDefinition}>
                        {term.definition}
                      </div>
                      {term.example && (
                        <div style={styles.termExampleWrap}>
                          <div style={styles.termExampleLabel}>Example</div>
                          <div style={styles.termExample}>{term.example}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📖</div>
            <div style={styles.emptyTitle}>No terms found</div>
            <div style={styles.emptySub}>
              Try a different search term or clear the category filter.
            </div>
            <button
              style={styles.emptyReset}
              onClick={() => { setSearch(''); setActiveCategory('All') }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* FOOTER NOTE */}
        <div style={styles.footerNote}>
          <div style={styles.footerNoteIcon}>ℹ</div>
          <div style={styles.footerNoteText}>
            All definitions are written for the South African context using 2024/25 SARS rules,
            current prime rate, and local financial regulations. This glossary is educational —
            not financial or legal advice.
          </div>
        </div>

      </PageWrapper>
    </div>
  )
}

const styles = {
  page: { background: 'var(--color-bg-base)', minHeight: '100vh' },
  eyebrow: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-red)', marginBottom: '12px' },
  pageTitle: { fontSize: '34px', fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', marginBottom: '10px' },
  pageSub: { fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginBottom: '28px', maxWidth: '520px' },
  searchWrap: { marginBottom: '16px' },
  searchInner: { display: 'flex', alignItems: 'center', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '0 14px', gap: '10px' },
  searchIcon: { fontSize: '14px', flexShrink: 0 },
  searchInput: { flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: '14px', padding: '13px 0', fontFamily: 'var(--font-family)', outline: 'none' },
  searchClear: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '18px', cursor: 'pointer', lineHeight: 1, padding: '0 4px', fontFamily: 'var(--font-family)' },
  categoryRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' },
  categoryBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)', padding: '6px 14px', fontSize: '12px', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontFamily: 'var(--font-family)', transition: 'all 0.15s' },
  categoryBtnActive: { background: 'var(--color-purple)', borderColor: 'var(--color-purple)', color: '#fff', fontWeight: 600 },
  resultCount: { fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' },
  termList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  termCard: { background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px', cursor: 'pointer', transition: 'border-color 0.2s' },
  termHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' },
  termHeaderLeft: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  termName: { fontSize: '15px', fontWeight: 700, color: '#fff' },
  termHeaderRight: { display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 },
  termUsedIn: { fontSize: '10px', color: 'rgba(255,255,255,0.25)', textAlign: 'right' },
  expandIcon: { fontSize: '10px', transition: 'color 0.2s' },
  termPreview: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 },
  termExpanded: { marginTop: '4px' },
  termDefinition: { fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '12px' },
  termExampleWrap: { background: 'rgba(75,68,168,0.08)', border: '1px solid rgba(75,68,168,0.2)', borderRadius: 'var(--radius-md)', padding: '12px 14px' },
  termExampleLabel: { fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-purple)', marginBottom: '6px' },
  termExample: { fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, fontStyle: 'italic' },
  emptyState: { textAlign: 'center', padding: '60px 24px', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)' },
  emptyIcon: { fontSize: '36px', marginBottom: '14px' },
  emptyTitle: { fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' },
  emptySub: { fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' },
  emptyReset: { background: 'var(--color-purple)', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)' },
  footerNote: { display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', padding: '14px 16px' },
  footerNoteIcon: { fontSize: '14px', color: 'rgba(255,255,255,0.25)', flexShrink: 0, marginTop: '1px' },
  footerNoteText: { fontSize: '11px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.65 },
}

export default GlossaryPage