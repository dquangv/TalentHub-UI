import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText } from "lucide-react";

interface TotalStatsProps {
  totalAccounts: number;
  totalRevenue: number;
  accountGrowth: number;
  revenueGrowth: number;
}

export function TotalStats({ totalAccounts, totalRevenue, accountGrowth, revenueGrowth }: TotalStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAccounts}</div>
          <p className="text-xs text-muted-foreground">
            {`${accountGrowth > 0 ? '+' : ''}${accountGrowth.toFixed(1)}% so với tháng trước`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalRevenue.toLocaleString('vi-VN', { 
              style: 'currency', 
              currency: 'VND' 
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {`${revenueGrowth > 0 ? '+' : ''}${revenueGrowth.toFixed(1)}% so với tháng trước`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
