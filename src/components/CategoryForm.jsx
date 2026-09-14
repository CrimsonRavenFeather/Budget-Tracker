import { useState } from 'react'

export default function CategoryForm({ buckets, onSubmit }) {
  const [name, setName] = useState('')
  const [bucketId, setBucketId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!bucketId) {
      setError('Choose a bucket.')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit({ name, bucket_id: bucketId })
      setName('')
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
          <label>Category name</label>
          <input
            type="text"
            required
            placeholder="e.g. Rent"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Bucket</label>
          <select value={bucketId} onChange={(e) => setBucketId(e.target.value)} required>
            <option value="" disabled>
              Select…
            </option>
            {buckets.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <div className="error-text">{error}</div>}
      <button type="submit" className="btn secondary" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add category'}
      </button>
    </form>
  )
}
