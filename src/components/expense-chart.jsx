import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    Food: 400,
    Transportation: 240,
    Shopping: 320,
    Housing: 980,
    Entertainment: 180,
    Other: 120,
  },
  {
    name: "Feb",
    Food: 380,
    Transportation: 230,
    Shopping: 280,
    Housing: 980,
    Entertainment: 150,
    Other: 110,
  },
  {
    name: "Mar",
    Food: 420,
    Transportation: 250,
    Shopping: 350,
    Housing: 980,
    Entertainment: 200,
    Other: 130,
  },
  {
    name: "Apr",
    Food: 450,
    Transportation: 260,
    Shopping: 400,
    Housing: 980,
    Entertainment: 220,
    Other: 140,
  },
  {
    name: "May",
    Food: 470,
    Transportation: 270,
    Shopping: 420,
    Housing: 980,
    Entertainment: 240,
    Other: 150,
  },
  {
    name: "Jun",
    Food: 500,
    Transportation: 280,
    Shopping: 450,
    Housing: 980,
    Entertainment: 260,
    Other: 160,
  },
]

export function ExpenseChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Food" stackId="a" fill="#8884d8" />
        <Bar dataKey="Transportation" stackId="a" fill="#82ca9d" />
        <Bar dataKey="Shopping" stackId="a" fill="#ffc658" />
        <Bar dataKey="Housing" stackId="a" fill="#ff8042" />
        <Bar dataKey="Entertainment" stackId="a" fill="#0088fe" />
        <Bar dataKey="Other" stackId="a" fill="#00C49F" />
      </BarChart>
    </ResponsiveContainer>
  )
}
