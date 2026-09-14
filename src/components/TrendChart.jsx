import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { monthLabel } from '../utils/format'

export default function TrendChart({ data }) {
  const chartData = data.map((d) => ({
    ...d,
    label: monthLabel(d.month).split(' ')[0].slice(0, 3),
    savings_rate_pct: Math.round(d.savings_rate * 1000) / 10,
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#c9cec4" strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: '#52605a' }}
          axisLine={{ stroke: '#c9cec4' }}
          tickLine={false}
        />
        <YAxis
          yAxisId="amount"
          tick={{ fontSize: 11, fill: '#52605a' }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <YAxis
          yAxisId="rate"
          orientation="right"
          tick={{ fontSize: 11, fill: '#a9832c' }}
          axisLine={false}
          tickLine={false}
          width={36}
          unit="%"
        />
        <Tooltip
          contentStyle={{
            background: '#f4f5f0',
            border: '1px solid #c9cec4',
            borderRadius: 6,
            fontSize: 12,
          }}
          formatter={(value, name) => {
            if (name === 'Savings rate') return [`${value}%`, name]
            return [Number(value).toFixed(2), name]
          }}
        />
        <Bar yAxisId="amount" dataKey="income_total" name="Income" fill="#dde5da" radius={[3, 3, 0, 0]} barSize={14} />
        <Bar yAxisId="amount" dataKey="expense_total" name="Expense" fill="#47614f" radius={[3, 3, 0, 0]} barSize={14} />
        <Line
          yAxisId="rate"
          type="monotone"
          dataKey="savings_rate_pct"
          name="Savings rate"
          stroke="#a9832c"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
