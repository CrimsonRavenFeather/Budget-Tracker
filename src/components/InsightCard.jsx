export default function InsightCard({ insight, onGenerate, loading }) {
  if (!insight) {
    return (
      <div className="panel">
        <p className="muted" style={{ marginBottom: 12 }}>
          No insight generated for this month yet.
        </p>
        <button className="btn secondary" onClick={onGenerate} disabled={loading}>
          {loading ? 'Generating…' : 'Generate insight'}
        </button>
      </div>
    )
  }

  return (
    <div className="insight-card">
      <p style={{ margin: 0 }}>{insight.summary_text}</p>
      <div className="meta">
        {insight.cached ? 'Cached' : 'Freshly generated'} ·{' '}
        {new Date(insight.generated_at).toLocaleString()}
      </div>
    </div>
  )
}
