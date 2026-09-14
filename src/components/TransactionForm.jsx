import { useState, useEffect } from 'react'

const emptyForm = {
  amount: '',
  type: 'expense',
  category_id: '',
  note: '',
  date: new Date().toISOString().slice(0, 10),
  is_recurring: false,
}

export default function TransactionForm({ categories, initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setForm(initial || emptyForm)
  }, [initial])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!form.category_id) {
      setError('Choose a category.')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit({
        ...form,
        amount: parseFloat(form.amount),
      })
      if (!initial) setForm(emptyForm)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel">
      <div className="field-row">
        <div className="field">
          <label>Amount</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            required
            value={form.amount}
            onChange={(e) => update('amount', e.target.value)}
          />
        </div>
        <div className="field">
          <label>Type</label>
          <select value={form.type} onChange={(e) => update('type', e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="field">
          <label>Category</label>
          <select
            value={form.category_id}
            onChange={(e) => update('category_id', e.target.value)}
            required
          >
            <option value="" disabled>
              Select…
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Date</label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
          />
        </div>
      </div>

      <div className="field-row" style={{ alignItems: 'center' }}>
        <div className="field" style={{ flex: 2 }}>
          <label>Note (optional)</label>
          <input
            type="text"
            value={form.note || ''}
            onChange={(e) => update('note', e.target.value)}
          />
        </div>
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={form.is_recurring}
            onChange={(e) => update('is_recurring', e.target.checked)}
          />
          Recurring
        </label>
      </div>

      {error && <div className="error-text">{error}</div>}

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Saving…' : initial ? 'Save changes' : 'Add transaction'}
        </button>
        {initial && (
          <button type="button" className="btn secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
