import { useState } from 'react'

export default function BucketForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [targetPct, setTargetPct] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onSubmit({ name, target_pct: parseFloat(targetPct) })
      setName('')
      setTargetPct('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field-row">
        <div className="field">
          <label>Bucket name</label>
          <input
            type="text"
            required
            placeholder="e.g. Need"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Target %</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            required
            placeholder="50"
            value={targetPct}
            onChange={(e) => setTargetPct(e.target.value)}
          />
        </div>
      </div>
      {error && <div className="error-text">{error}</div>}
      <button type="submit" className="btn secondary" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add bucket'}
      </button>
    </form>
  )
}
