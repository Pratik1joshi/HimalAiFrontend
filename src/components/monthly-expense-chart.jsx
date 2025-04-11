import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Jan", expenses: 2100 },
  { name: "Feb", expenses: 1850 },
  { name: "Mar", expenses: 2200 },
  { name: "Apr", expenses: 2400 },
  { name: "May", expenses: 2500 },
  { name: "Jun", expenses: 2650 },
  { name: "Jul", expenses: 2800 },
  { name: "Aug", expenses: 2750 },
  { name: "Sep", expenses: 2600 },
  { name: "Oct", expenses: 2500 },
  { name: "Nov", expenses: 2700 },
  { name: "Dec", expenses: 3100 },
]

export function MonthlyExpenseChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area type="monotone" dataKey="expenses" stroke="#8884d8" fillOpacity={1} fill="url(#colorExpenses)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
