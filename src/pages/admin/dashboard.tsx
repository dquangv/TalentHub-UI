import { StatsCard } from "@/components/admin/dashboard/stats-card";
import { RecentActivities } from "@/components/admin/dashboard/recent-activities";
import { UserStats } from "@/components/admin/dashboard/stats/user-stats";
import { PostStats } from "@/components/admin/dashboard/stats/post-stats";
import { TotalStats } from "@/components/admin/dashboard/stats/total-stats";
import { Users, Briefcase, DollarSign, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import api from '@/api/axiosConfig';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalAccounts: 0,
    approvedFreelancerJobs: 0,
    postedJobs: 0,
    loading: true,
    totalFreelancers: 0,
    totalClients: 0,
    totalRevenue: 0
  });

  const [growthRates, setGrowthRates] = useState({
    freelancerGrowth: 0,
    clientGrowth: 0,
    jobGrowth: 0,
    approvedJobGrowth: 0,
    accountGrowth: 0,
    revenuesGrowth: 0
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await api.get("statistics/home");
        if (response.success) {
          setStats({
            totalAccounts: response.totalAccounts || 0,
            approvedFreelancerJobs: response.approvedFreelancerJobs || 0,
            postedJobs: response.postedJobs || 0,
            loading: false,
            totalFreelancers: response.totalFreelancers || 0,
            totalClients: response.totalClients || 0,
            totalRevenue: response.totalRevenue || 0
          });
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    const fetchGrowthRates = async () => {
      try {
        const response = await api.get("v1/revenues/growth-rate");
        if (response.success) {
          setGrowthRates({
            freelancerGrowth: response.freelancerGrowth || 0,
            clientGrowth: response.clientGrowth || 0,
            jobGrowth: response.jobGrowth || 0,
            approvedJobGrowth : response.approvedJobGrowth || 0,
            accountGrowth: response.accountGrowth || 0,
            revenuesGrowth: response.revenuesGrowth || 0
          });
        }
      } catch (error) {
        console.error('Error fetching growth rates:', error);
      }
    };

    fetchStatistics();
    fetchGrowthRates();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Số lượng ứng viên"
          value={stats.loading ? "..." : stats.totalFreelancers.toString()}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description={`${growthRates.freelancerGrowth > 0 ? '+' : ''}${growthRates.freelancerGrowth.toFixed(1)}% so với tháng trước`}
        />
        <StatsCard
          title="Số lượng nhà tuyển dụng"
          value={stats.loading ? "..." : stats.totalClients.toString()}
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
          description={`${growthRates.clientGrowth > 0 ? '+' : ''}${growthRates.clientGrowth.toFixed(1)}% so với tháng trước`}
        />
        <StatsCard
          title="Số lượng dự án"
          value={stats.loading ? "..." : stats.postedJobs.toString()}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description={`${growthRates.jobGrowth > 0 ? '+' : ''}${growthRates.jobGrowth.toFixed(1)}% so với tháng trước`}
        />
        <StatsCard
          title="Số lượng cộng tác"
          value={stats.loading ? "..." : stats.approvedFreelancerJobs.toString()}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          description={`${growthRates.approvedJobGrowth > 0 ? '+' : ''}${growthRates.approvedJobGrowth.toFixed(1)}% so với tháng trước`}
        />
      </div>

      <TotalStats 
        totalAccounts={stats.totalAccounts}
        totalRevenue={stats.totalRevenue}
        accountGrowth={growthRates.accountGrowth}
        revenuesGrowth={growthRates.revenuesGrowth}
      />
      
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