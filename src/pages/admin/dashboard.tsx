import { StatsCard } from "@/components/admin/dashboard/stats-card";
import { RecentActivities } from "@/components/admin/dashboard/recent-activities";
import { UserStats } from "@/components/admin/dashboard/stats/user-stats";
import { PostStats } from "@/components/admin/dashboard/stats/post-stats";
import { TotalStats } from "@/components/admin/dashboard/stats/total-stats";
import { Users, Briefcase, DollarSign, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng Freelancer"
          value="1,234"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="+20% so với tháng trước"
        />
        <StatsCard
          title="Nhà Tuyển Dụng"
          value="567"
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
          description="+15% so với tháng trước"
        />
        <StatsCard
          title="Doanh Thu"
          value="₫125M"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="+25% so với tháng trước"
        />
        <StatsCard
          title="Dự Án Hoàn Thành"
          value="89"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          description="Trong tháng này"
        />
      </div>

      <TotalStats />
      
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Thống Kê Người Dùng</h2>
        <UserStats />
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Thống Kê Bài Viết</h2>
        <PostStats />
      </div>

      <RecentActivities />
    </div>
  );
}