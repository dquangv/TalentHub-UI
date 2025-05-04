import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "antd";
import { notification } from "antd";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import {
  Video,
  MapPin,
  Building2,
  CheckCircle,
} from "lucide-react";
import api from "@/api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";

const Appointment = () => {
  const [appointmentType, setAppointmentType] = useState<"online" | "offline">(
    "online"
  );
  const [formData, setFormData] = useState({
    time: "09:00",
    duration: "30",
    topic: "",
    description: "",
    location: "",
    meetingLink: "",
    selectedDate: new Date(),
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = JSON.parse(localStorage.getItem("userInfo") || "{}");

    if (!data?.clientId) {
      navigate("/login");
      return;
    }

    const timeParts = formData.time.split(":");
    const hour = parseInt(timeParts[0]);
    const minute = timeParts[1] ? parseInt(timeParts[1]) : 0;

    const selectedDate = new Date(formData.selectedDate);

    selectedDate.setHours(hour);
    selectedDate.setMinutes(minute);
    selectedDate.setSeconds(0);
    selectedDate.setMilliseconds(0);

    const appointmentData = {
      startTime: selectedDate.toISOString(),
      duration: parseInt(formData.duration),
      topic: formData.topic,
      description: formData.description,
      link: appointmentType === "online" ? formData.meetingLink : "",
      clientId: data?.clientId,
      freelancerJobId: id,
    };

    const now = new Date();
    if (selectedDate <= now) {
      notification.error({
        message: "Lỗi đặt lịch",
        description: "Không thể đặt lịch hẹn trước hoặc tại thời điểm hiện tại.",
      });
      return;
    }

    try {
      const response = await api.post(
        "/v1/appointments/client",
        JSON.stringify(appointmentData)
      );

      if (response?.data) {
        notification.info({
          message: "Đặt lịch thành công",
          description: "Đặt lịch thành công, chúng tôi sẽ thông báo cho ứng viên của bạn",
        });
        window.location.pathname = '/client/appointment'
      } else {
        notification.error({
          message: "Đặt lịch thất bại",
          description: "Có lỗi xảy ra, vui lòng thử lại.",
        });
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
      notification.error({
        message: "Đặt lịch thất bại",
        description: "Có lỗi xảy ra, vui lòng thử lại.",
      });
    }
  };

  const handleDateChange = (date: any) => {
    if (date) {
      const jsDate = date.toDate();
      setFormData((prevData) => ({
        ...prevData,
        selectedDate: jsDate,
      }));
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold mb-4">Đặt lịch hẹn</h1>
              <p className="text-muted-foreground">
                Đặt lịch hẹn trực tuyến hoặc gặp mặt trực tiếp với chúng tôi
              </p>
            </div>
          </FadeInWhenVisible>

          {/* Appointment Type Selection */}
          <FadeInWhenVisible delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${appointmentType === "online" ? "ring-2 ring-primary" : ""
                  }`}
                onClick={() => setAppointmentType("online")}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Video className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Họp trực tuyến</h3>
                    <p className="text-sm text-muted-foreground">
                      Qua Google Meet hoặc Zoom
                    </p>
                  </div>
                  {appointmentType === "online" && (
                    <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                  )}
                </div>
              </Card>

             
            </div>
          </FadeInWhenVisible>

          {/* Main Form */}
          <FadeInWhenVisible delay={0.2}>
            <Card className="p-8">
              <form className="space-y-8">
                {/* Meeting Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Chi tiết cuộc họp</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ngày họp</label>
                      <Calendar
                        fullscreen={false}
                        onChange={handleDateChange}
                      />
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Thời gian bắt đầu</label>
                        <Input
                          type="time"
                          value={formData.time}
                          onChange={(e) =>
                            setFormData({ ...formData, time: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Thời lượng</label>
                        <Input
                          type="number"
                          value={formData.duration}
                          onChange={(e) =>
                            setFormData({ ...formData, duration: e.target.value })
                          }
                          placeholder="Nhập thời lượng (ví dụ: 30 phút)"
                        />
                      </div>
                      <div
                        className="space-y-2"
                        style={{
                          display: appointmentType === "offline" ? "none" : "block",
                        }}
                      >
                        <label className="text-sm font-medium">Link họp</label>
                        <Input
                          type="tel"
                          value={formData.meetingLink}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              meetingLink: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Meeting Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Nội dung cuộc họp</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Chủ đề</label>
                      <Input
                        value={formData.topic}
                        onChange={(e) =>
                          setFormData({ ...formData, topic: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Mô tả chi tiết
                      </label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                {/* Location/Link */}
                {appointmentType === "offline" ? (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Địa điểm</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Địa chỉ văn phòng
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-10"
                          value="123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh"
                          disabled
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Tầng 15, Tòa nhà The Sun Avenue
                      </p>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {/* Submit Button */}
                <Button onClick={handleSubmit} type="submit" className="w-full">
                  Xác nhận đặt lịch
                </Button>
              </form>
            </Card>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
