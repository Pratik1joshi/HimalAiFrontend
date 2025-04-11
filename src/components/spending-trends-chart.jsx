import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    month: "Jan",
    "This Year": 2100,
    "Last Year": 1900,
  },
  {
    month: "Feb",
    "This Year": 1850,
    "Last Year": 1800,
  },
  {
    month: "Mar",
    "This Year": 2200,
    "Last Year": 2000,
  },
  {
    month: "Apr",
    "This Year": 2400,
    "Last Year": 2100,
  },
  {
    month: "May",
    "This Year": 2500,
    "Last Year": 2200,
  },
  {
    month: "Jun",
    "This Year": 2650,
    "Last Year": 2300,
  },
  {
    month: "Jul",
    "This Year": 2800,
    "Last Year": 2400,
  },
  {
    month: "Aug",
    "This Year": 2750,
    "Last Year": 2500,
  },
  {
    month: "Sep",
    "This Year": 2600,
    "Last Year": 2600,
  },
  {
    month: "Oct",
    "This Year": 2500,
    "Last Year": 2700,
  },
  {
    month: "Nov",
    "This Year": 2700,
    "Last Year": 2800,
  },
  {
    month: "Dec",
    "This Year": 3100,
    "Last Year": 3000,
  },
]

export function SpendingTrendsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `${value}`} />
        <Legend />
        <Line type="monotone" dataKey="This Year" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Last Year" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  )
}
