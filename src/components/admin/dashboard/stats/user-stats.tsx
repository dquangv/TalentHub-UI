import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import api from "@/api/axiosConfig";

interface RevenueDTOResponse {
  time: number;
  revenue: number;
}

export function UserStats() {
  const [weeklyData, setWeeklyData] = useState<RevenueDTOResponse[]>([]);
  const [monthlyData, setMonthlyData] = useState<RevenueDTOResponse[]>([]);
  const [quarterlyData, setQuarterlyData] = useState<RevenueDTOResponse[]>([]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weeklyRes, monthlyRes, quarterlyRes] = await Promise.all([
          api.get(`/v1/revenues/week`, {
            params: {
              year: currentYear,
              month: currentMonth
            }
          }),
          api.get(`/v1/revenues/month/${currentYear}`),
          api.get(`/v1/revenues/quarter/${currentYear}`),
        ]);

        setWeeklyData(weeklyRes.data);
        setMonthlyData(monthlyRes.data);
        setQuarterlyData(quarterlyRes.data);
        
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Theo tuần (Tháng {currentMonth}/{currentYear})</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tickFormatter={(value) => `Tuần ${value}`} />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Tuần ${label}`}
              />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theo tháng (Năm {currentYear})</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tickFormatter={(value) => `T${value}`} />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Tháng ${label}`}
              />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theo quý (Năm {currentYear})</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={quarterlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tickFormatter={(value) => `Q${value}`} />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Quý ${label}`}
              />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}