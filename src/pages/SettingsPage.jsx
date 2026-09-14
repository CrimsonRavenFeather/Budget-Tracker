import { useEffect, useState, useCallback } from 'react'
import { api } from '../api/client'
import BucketForm from '../components/BucketForm'
import CategoryForm from '../components/CategoryForm'

export default function SettingsPage() {
  const [buckets, setBuckets] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const bucketName = (id) => buckets.find((b) => b.id === id)?.name || '—'

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [b, c] = await Promise.all([api.listBuckets(), api.listCategories()])
      setBuckets(b)
      setCategories(c)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleCreateBucket(payload) {
    await api.createBucket(payload)
    await load()
  }

  async function handleCreateCategory(payload) {
    await api.createCategory(payload)
    await load()
  }

  async function handleTargetChange(bucket, value) {
    const parsed = parseFloat(value)
    if (Number.isNaN(parsed)) return
    try {
      await api.updateBucket(bucket.id, { target_pct: parsed })
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: 28 }}>Buckets &amp; categories</h1>

      {error && <div className="error-text">{error}</div>}
      {loading && <div className="loading">Loading…</div>}

      {!loading && (
        <div className="two-col">
          <section className="section">
            <div className="section-head">
              <h2>Buckets</h2>
            </div>
            <hr className="hairline-rule" />
            {buckets.length === 0 ? (
              <div className="empty-state">No buckets yet.</div>
            ) : (
              buckets.map((b) => (
                <div className="list-item" key={b.id}>
                  <span>{b.name}</span>
                  <span className="field" style={{ flex: 'none', width: 90 }}>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      defaultValue={b.target_pct}
                      onBlur={(e) => handleTargetChange(b, e.target.value)}
                    />
                  </span>
                </div>
              ))
            )}
            <div style={{ marginTop: 20 }}>
              <BucketForm onSubmit={handleCreateBucket} />
            </div>
          </section>

          <section className="section">
            <div className="section-head">
              <h2>Categories</h2>
            </div>
            <hr className="hairline-rule" />
            {categories.length === 0 ? (
              <div className="empty-state">No categories yet.</div>
            ) : (
              categories.map((c) => (
                <div className="list-item" key={c.id}>
                  <span>{c.name}</span>
                  <span className="muted">{bucketName(c.bucket_id)}</span>
                </div>
              ))
            )}
            <div style={{ marginTop: 20 }}>
              {buckets.length === 0 ? (
                <p className="muted">Add a bucket first.</p>
              ) : (
                <CategoryForm buckets={buckets} onSubmit={handleCreateCategory} />
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
