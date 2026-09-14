import { formatPct } from '../utils/format'

export default function BucketBar({ bucket }) {
  const target = Number(bucket.target_pct)
  const actual = Number(bucket.actual_pct)
  const over = actual > target
  const fillWidth = Math.min(actual, 100)

  return (
    <div className="bucket-row">
      <div className="bucket-row-head">
        <span className="name">{bucket.name}</span>
        <span className="pcts">
          <span className={over ? 'over' : ''}>{formatPct(actual)}</span>
          {'  of '}
          {formatPct(target)} target
        </span>
      </div>
      <div className="bucket-track">
        <div
          className={`bucket-fill ${over ? 'over' : ''}`}
          style={{ width: `${fillWidth}%` }}
        />
        <div className="bucket-target-tick" style={{ left: `${Math.min(target, 100)}%` }} />
      </div>
    </div>
  )
}
