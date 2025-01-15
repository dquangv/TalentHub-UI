import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const weeklyData = [
  { name: "T2", users: 120 },
  { name: "T3", users: 140 },
  { name: "T4", users: 160 },
  { name: "T5", users: 180 },
  { name: "T6", users: 200 },
  { name: "T7", users: 220 },
  { name: "CN", users: 240 },
];

const monthlyData = [
  { name: "Tuần 1", users: 500 },
  { name: "Tuần 2", users: 600 },
  { name: "Tuần 3", users: 700 },
  { name: "Tuần 4", users: 800 },
];

const yearlyData = [
  { name: "T1", users: 1000 },
  { name: "T2", users: 1200 },
  { name: "T3", users: 1400 },
  { name: "T4", users: 1600 },
  { name: "T5", users: 1800 },
  { name: "T6", users: 2000 },
  { name: "T7", users: 2200 },
  { name: "T8", users: 2400 },
  { name: "T9", users: 2600 },
  { name: "T10", users: 2800 },
  { name: "T11", users: 3000 },
  { name: "T12", users: 3200 },
];

export function UserStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Người Dùng Trong Tuần</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Người Dùng Trong Tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Người Dùng Trong Năm</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}