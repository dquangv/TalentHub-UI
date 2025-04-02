import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

const activities = [
  {
    action: "Nhà tuyển dụng mới đăng ký",
    user: "Công ty ABC",
    time: "2 phút trước",
  },
  {
    action: "Freelancer hoàn thành dự án",
    user: "Nguyễn Văn A",
    time: "5 phút trước",
  },
  {
    action: "Dự án mới được đăng",
    user: "Công ty XYZ",
    time: "10 phút trước",
  },
];

export function RecentActivities() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Hoạt Động Gần Đây</CardTitle>
          <Activity className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{activity.action}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.user} - {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}