import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, CheckCircle } from "lucide-react";
import EditAppointmentDialog from "./EditAppointmentDialog";
import { notification } from "antd";

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
  FileText,
} from "lucide-react";
import api from "@/api/axiosConfig";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";

const AppointmentList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const navigate = useNavigate();

  const fetchAppointments = async () => {
    const data = JSON.parse(localStorage.getItem("userInfo") || "{}");
    if (!data?.clientId) {
      navigate("/login");
      return;
    }

    try {
      const response = await api.get(`/v1/appointments/clients/${data.clientId}`);
      if (response && Array.isArray(response.data)) {
        setAppointments(response.data);
      } else {
        console.error("Invalid appointments data format:", response);
        setAppointments([]);
        notification.warning({
          message: "Dữ liệu không hợp lệ",
          description: "Định dạng dữ liệu lịch hẹn không đúng",
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [navigate]);

  const handleEditAppointment = (appointment) => {
    const appointmentToEdit = { ...appointment };
    if (appointmentToEdit.startTime) {
      try {
        const testDate = new Date(appointmentToEdit.startTime);
        if (isNaN(testDate.getTime())) {
          appointmentToEdit.startTime = new Date().toISOString();
        }
      } catch (error) {
        console.error("Error parsing appointment date:", error);
        appointmentToEdit.startTime = new Date().toISOString();
      }
    } else {
      appointmentToEdit.startTime = new Date().toISOString();
    }

    setEditingAppointment(appointmentToEdit);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSuccess = (updatedAppointment) => {
    if (!updatedAppointment || !updatedAppointment.id) {
      console.error("Invalid updated appointment data:", updatedAppointment);
      notification.error({
        message: "Lỗi",
        description: "Dữ liệu lịch hẹn cập nhật không hợp lệ",
        placement: "topRight",
      });
      return;
    }

    setAppointments((prevAppointments) =>
      prevAppointments.map((app) =>
        app && app.id === updatedAppointment.id ? updatedAppointment : app
      )
    );

    fetchAppointments();
  };


  const filteredAppointments = Array.isArray(appointments)
    ? appointments
        .filter((appointment) => {
          const matchesSearch =
            (appointment?.name || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (appointment?.mail || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (appointment?.topic || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (appointment?.jobTitle &&
              appointment.jobTitle
                .toLowerCase()
                .includes(searchTerm.toLowerCase()));

          return matchesSearch;
        })
        .sort((a, b) => {
          const dateA = new Date(a.startTime).getTime();
          const dateB = new Date(b.startTime).getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        })
    : [];

  // Hàm chuyển hướng đến chi tiết công việc
  const navigateToJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  // Định dạng ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("vi-VN", options);
  };

  // Định dạng giờ
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

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
                  placeholder="Tìm kiếm theo tên, email, chủ đề hoặc bài đăng..."
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
                  <TableHead>Ứng viên</TableHead>
                  <TableHead>Chủ đề</TableHead>
                  <TableHead>Bài đăng</TableHead>
                  <TableHead>
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                    >
                      Thời gian
                      {sortOrder === "asc" ? (
                        <ArrowDownIcon className="ml-1" />
                      ) : (
                        <ArrowUpIcon className="ml-1" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Hình thức</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
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
                      {appointment.jobId && appointment.jobTitle ? (
                        <Button
                          variant="link"
                          className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                          onClick={() => navigateToJob(appointment.jobId)}
                        >
                          <FileText className="w-4 h-4" />
                          {appointment.jobTitle}
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">Không có</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="font-medium">
                            {formatDate(appointment.startTime)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-emerald-500" />
                          <span>{formatTime(appointment.startTime)}</span>
                        </div>
                        <div className="ml-6 text-sm text-muted-foreground bg-gray-100 px-2 py-1 rounded-md inline-block">
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
                        className={`px-2 py-1 rounded-md text-sm ${
                          appointment.isCompleted
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
                            onClick={() =>
                              window.open(appointment.link, "_blank")
                            }
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Tham gia
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      
                        <Button size="sm" variant="outline">
                          <BookUser className="w-4 h-4" />
                        </Button>
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
                <Link to="/client/post-job">Đăng tin tuyển dụng</Link>
              </Button>
            </Card>
          </FadeInWhenVisible>
        )}
      </div>
      {editingAppointment && (
        <EditAppointmentDialog
          appointment={editingAppointment}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default AppointmentList;