import { useEffect, useState, useCallback } from 'react'
import { api } from '../api/client'
import TransactionForm from '../components/TransactionForm'
import { formatMoney, currentYearMonth, firstAndLastOfMonth, monthLabel } from '../utils/format'

export default function TransactionsPage() {
  const [month, setMonth] = useState(currentYearMonth())
  const [categories, setCategories] = useState([])
  const [transactions, setTransactions] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || '—'

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { from, to } = firstAndLastOfMonth(month)
      const [cats, txns] = await Promise.all([
        api.listCategories(),
        api.listTransactions(from, to),
      ])
      setCategories(cats)
      setTransactions(txns.sort((a, b) => (a.date < b.date ? 1 : -1)))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [month])

  useEffect(() => {
    load()
  }, [load])

  async function handleCreate(payload) {
    await api.createTransaction(payload)
    await load()
  }

  async function handleUpdate(payload) {
    await api.updateTransaction(editing.id, payload)
    setEditing(null)
    await load()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this transaction?')) return
    try {
      await api.deleteTransaction(id)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="section-head">
        <h1>Transactions</h1>
        <div className="month-picker">
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>{editing ? 'Edit transaction' : 'Add transaction'}</h2>
        </div>
        <hr className="hairline-rule" />
        {categories.length === 0 && !loading ? (
          <p className="muted">
            Create a category first under Buckets &amp; categories before logging transactions.
          </p>
        ) : (
          <TransactionForm
            categories={categories}
            initial={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => setEditing(null)}
          />
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>{monthLabel(month)}</h2>
        </div>
        <hr className="hairline-rule" />
        {error && <div className="error-text">{error}</div>}
        {loading ? (
          <div className="loading">Loading…</div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">No transactions logged for this month yet.</div>
        ) : (
          <table className="txn-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Note</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="num">{t.date}</td>
                  <td>{categoryName(t.category_id)}</td>
                  <td className="muted">{t.note || '—'}</td>
                  <td className={`amount num ${t.type}`}>
                    {t.type === 'income' ? '+' : '−'}
                    {formatMoney(t.amount)}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button onClick={() => setEditing(t)}>Edit</button>
                      <button className="delete" onClick={() => handleDelete(t.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
