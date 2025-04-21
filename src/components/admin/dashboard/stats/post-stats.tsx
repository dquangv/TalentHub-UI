import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import api from "@/api/axiosConfig";

interface RevenueDTOResponse {
  time: number;
  revenue: number;
}

export function PostStats() {
  const [monthlyData, setMonthlyData] = useState<RevenueDTOResponse[]>([]);
  const [quarterlyData, setQuarterlyData] = useState<RevenueDTOResponse[]>([]);
  const [yearlyData, setYearlyData] = useState<RevenueDTOResponse[]>([]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [monthlyRes, quarterlyRes, yearlyRes] = await Promise.all([
          api.get(`/v1/revenues/banner/month/${currentYear}`),
          api.get(`/v1/revenues/banner/quarter/${currentYear}`),
          api.get(`/v1/revenues/banner/year`),
        ]);

        setMonthlyData(monthlyRes.data);
        setQuarterlyData(quarterlyRes.data);
        setYearlyData(yearlyRes.data);
        
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
          <CardTitle>Theo tháng (Năm {currentYear})</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tickFormatter={(value) => `T${value}`} />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Tháng ${label}`}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theo quý (Năm {currentYear})</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quarterlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tickFormatter={(value) => `Q${value}`} />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Quý ${label}`}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theo năm</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tickFormatter={(value) => `${value}`} />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Năm ${label}`}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
