import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  BookUser,
  ArrowUpDown,
} from "lucide-react";
import api from "@/api/axiosConfig";

const AppointmentList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest"); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = JSON.parse(localStorage.getItem("userInfo") || "{}");
      if (!data?.freelancerId) {
        navigate("/login");
        return;
      }
      try {
        const response = await api.get(`/v1/appointments/freelancers/${data.freelancerId}`);
        const appointmentsWithStatus = response.data.map((appointment: any) => ({
          ...appointment,
        }));
        setAppointments(appointmentsWithStatus);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleSort = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };

  const filteredAppointments = appointments
    .filter((appointment) => {
      const matchesSearch =
        appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.mail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.topic.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeInWhenVisible>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Lịch phỏng vấn</h1>
            <p className="text-muted-foreground">
              Quản lý các cuộc phỏng vấn với ứng viên
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Filters */}
        <FadeInWhenVisible delay={0.2}>
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Tìm kiếm theo tên, email hoặc chủ đề..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        </FadeInWhenVisible>

        {/* Appointments Table */}
        <FadeInWhenVisible delay={0.3}>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Nhà tuyển dụng</TableHead>
                  <TableHead className="min-w-[120px]">Chủ đề</TableHead>
                  <TableHead className="min-w-[120px]">
                    <button
                      className="flex items-center gap-2 hover:text-primary"
                      onClick={handleSort}
                    >
                      Thời gian
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </TableHead>
                  <TableHead className="min-w-[120px]">Hình thức</TableHead>
                  <TableHead className="min-w-[120px]">Trạng thái</TableHead>
                  <TableHead className="min-w-[120px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src="https://via.placeholder.com/256" />
                          <AvatarFallback>
                            {appointment.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{appointment.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.mail}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {appointment.topic || "Chưa có chủ đề"}
                        </p>
                        {appointment.description && (
                          <p className="text-sm text-muted-foreground">
                            {appointment.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                          {new Date(appointment.startTime).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                          {new Date(appointment.startTime).toLocaleTimeString('vi-VN')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {appointment.duration} phút
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {appointment.link ? (
                          <>
                            <Video className="w-4 h-4 text-blue-500" />
                            <span>Trực tuyến</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4 text-green-500" />
                            <span>Trực tiếp</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-md text-sm ${appointment.isCompleted
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {appointment.isCompleted ? "Hoàn thành" : "Sắp diễn ra"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {appointment.link && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(appointment.link, "_blank")}
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Tham gia
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </FadeInWhenVisible>

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <FadeInWhenVisible>
            <Card className="p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Chưa có cuộc hẹn nào
              </h3>
              <Button asChild>
                <Link to="/jobs">Tìm công việc</Link>
              </Button>
            </Card>
          </FadeInWhenVisible>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;