import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const weeklyData = [
  { name: "T2", posts: 15 },
  { name: "T3", posts: 20 },
  { name: "T4", posts: 25 },
  { name: "T5", posts: 30 },
  { name: "T6", posts: 35 },
  { name: "T7", posts: 40 },
  { name: "CN", posts: 45 },
];

const monthlyData = [
  { name: "Tuần 1", posts: 100 },
  { name: "Tuần 2", posts: 120 },
  { name: "Tuần 3", posts: 140 },
  { name: "Tuần 4", posts: 160 },
];

const yearlyData = [
  { name: "T1", posts: 200 },
  { name: "T2", posts: 250 },
  { name: "T3", posts: 300 },
  { name: "T4", posts: 350 },
  { name: "T5", posts: 400 },
  { name: "T6", posts: 450 },
  { name: "T7", posts: 500 },
  { name: "T8", posts: 550 },
  { name: "T9", posts: 600 },
  { name: "T10", posts: 650 },
  { name: "T11", posts: 700 },
  { name: "T12", posts: 750 },
];

export function PostStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Bài Viết Trong Tuần</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="posts" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bài Viết Trong Tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="posts" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bài Viết Trong Năm</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="posts" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}