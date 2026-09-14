import { useEffect, useState, useCallback } from 'react'
import { api } from '../api/client'
import BucketBar from '../components/BucketBar'
import TrendChart from '../components/TrendChart'
import InsightCard from '../components/InsightCard'
import { formatMoney, formatPct, currentYearMonth, monthLabel } from '../utils/format'

export default function DashboardPage() {
  const [month, setMonth] = useState(currentYearMonth())
  const [summary, setSummary] = useState(null)
  const [trend, setTrend] = useState(null)
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(true)
  const [insightLoading, setInsightLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [s, t] = await Promise.all([api.getSummary(month), api.getTrend(6)])
      setSummary(s)
      setTrend(t)
      setInsight(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [month])

  useEffect(() => {
    load()
  }, [load])

  async function handleGenerateInsight() {
    setInsightLoading(true)
    try {
      const result = await api.getInsight(month)
      setInsight(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setInsightLoading(false)
    }
  }

  return (
    <div>
      <div className="section-head">
        <h1>Dashboard</h1>
        <div className="month-picker">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="error-text">{error}</div>}
      {loading && <div className="loading">Loading {monthLabel(month)}…</div>}

      {!loading && summary && (
        <>
          <section className="section">
            <div className="hero-figures">
              <div className="hero-figure primary">
                <div className="label">Savings rate</div>
                <div className="value num">{formatPct(summary.savings_rate * 100)}</div>
              </div>
              <div className="hero-figure">
                <div className="label">Income</div>
                <div className="sub-value num">{formatMoney(summary.income_total)}</div>
              </div>
              <div className="hero-figure">
                <div className="label">Expenses</div>
                <div className="sub-value num">{formatMoney(summary.expense_total)}</div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-head">
              <h2>Buckets</h2>
            </div>
            <hr className="hairline-rule" />
            {summary.buckets.length === 0 ? (
              <div className="empty-state">
                No buckets yet — add one under Buckets &amp; categories.
              </div>
            ) : (
              summary.buckets.map((b) => <BucketBar key={b.bucket_id} bucket={b} />)
            )}
          </section>

          {trend && (
            <section className="section">
              <div className="section-head">
                <h2>Last 6 months</h2>
              </div>
              <hr className="hairline-rule" />
              <TrendChart data={trend} />
            </section>
          )}

          <section className="section">
            <div className="section-head">
              <h2>Insight</h2>
            </div>
            <hr className="hairline-rule" />
            <InsightCard insight={insight} onGenerate={handleGenerateInsight} loading={insightLoading} />
          </section>
        </>
      )}
    </div>
  )
}
