import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import {
  MapPin,
  Star,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";
import clientsService, {
  ClientDetail as ClientDetailType,
} from "@/api/clientsService";
import userService from "@/api/userService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ClientDetail = () => {
  const { id } = useParams();
  const [client, setClient] = useState<ClientDetailType | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await clientsService.getClientDetail(parseInt(id));
        console.log("Client detail:", response.data);
        setClient(response.data);

        // Fetch user data
        const userResponse = await userService.getUserById(parseInt(id));
        setUser(userResponse.data);
      } catch (error) {
        console.error("Error fetching client detail: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">
            Không tìm thấy thông tin nhà tuyển dụng
          </h2>
          <p className="mt-2 text-gray-500">
            Nhà tuyển dụng không tồn tại hoặc đã bị xóa
          </p>
        </div>
      </div>
    );
  }

  const fullName = `${client.firstName} ${client.lastName}`;

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <FadeInWhenVisible>
            <Card className="p-8 mb-8 hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <Avatar className="w-32 h-32 ring-4 ring-primary/10">
                    <AvatarImage
                      src={client.image}
                      alt={fullName}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {client.firstName.slice(0, 1).toUpperCase()}
                      {client.lastName.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-4 text-gray-900">
                        {fullName}
                      </h1>
                      <div className="flex items-center gap-2 mb-3">
                        <p className="text-xl text-primary">{client.title}</p>
                        <div
                          className={`text-sm px-3 py-1 rounded-full inline-flex items-center gap-1.5 ${
                            user?.status === "Xác thực"
                              ? "bg-green-100 text-green-800"
                              : user?.status === "Chưa xác thực"
                              ? "bg-amber-100 text-amber-800"
                              : user?.status === "Khóa"
                              ? "bg-red-100 text-red-800"
                              : ""
                          }`}
                        >
                          {user?.status === "Xác thực" && (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          {user?.status === "Chưa xác thực" && (
                            <AlertCircle className="w-4 h-4" />
                          )}
                          {user?.status === "Khóa" && (
                            <Lock className="w-4 h-4" />
                          )}
                          {user?.status}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-6 text-gray-600 mb-4">
                        <div className="flex items-center group">
                          <MapPin className="w-5 h-5 mr-2 text-primary" />
                          <span className="group-hover:text-primary transition-colors">
                            {client.province}, {client.country}
                          </span>
                        </div>
                        <div className="flex items-center group">
                          <Star className="w-5 h-5 mr-2 text-yellow-400 fill-current" />
                          <span className="group-hover:text-primary transition-colors">
                            {client.averageRating.toFixed(1)} (
                            {client.jobsCount} dự án)
                          </span>
                        </div>
                        <div className="flex items-center group">
                          <Building className="w-5 h-5 mr-2 text-primary" />
                          <span className="group-hover:text-primary transition-colors">
                            {client.companies[0]?.companyName ||
                              "Chưa cập nhật"}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* <div className="flex flex-col gap-2">
                      <Button
                        size="lg"
                        className="shadow-md hover:shadow-lg transition-shadow"
                        onClick={() => window.open(`/messaging?contactId=${client.userId}`, '_blank')}
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Liên hệ ngay
                      </Button>
                    </div> */}
                  </div>
                </div>
              </div>
            </Card>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.2}>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="bg-white shadow-sm">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="companies">Công ty</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                    Giới thiệu
                  </h2>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {client.introduction}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 text-gray-900">
                        Thông tin liên hệ
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 mr-3 text-primary" />
                          <span>{client.email}</span>
                        </div>
                        {client.companies[0]?.phoneContact && (
                          <div className="flex items-center">
                            <Phone className="w-5 h-5 mr-3 text-primary" />
                            <span>{client.companies[0]?.phoneContact}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 mr-3 text-primary" />
                          <span>
                            {client.province}, {client.country}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 text-gray-900">
                        Ngân sách
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Ngân sách từ:</span>
                          <span className="font-medium">
                            {client.fromPrice.toLocaleString()} VND
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Đến:</span>
                          <span className="font-medium">
                            {client.toPrice.toLocaleString()} VND
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            Số dự án đã đăng:
                          </span>
                          <span className="font-medium">
                            {client.jobsCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="companies">
                <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                    Thông tin công ty
                  </h2>

                  {client.companies.length > 0 ? (
                    <div className="space-y-8">
                      {client.companies.map((company) => (
                        <div key={company.id} className="flex gap-6 group">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Building className="w-6 h-6 text-primary" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {company.companyName}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 mb-3 mt-1">
                              <Badge variant="outline">
                                {company.industry}
                              </Badge>
                            </div>
                            <div className="space-y-2 text-gray-600">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                <span>{company.address}</span>
                              </div>
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                <span>{company.phoneContact}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Không có thông tin công ty
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                    Đánh giá từ Freelancer
                  </h2>

                  {client.reviews && client.reviews.length > 0 ? (
                    <div className="space-y-8">
                      {client.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={review.freelancerAvatar}
                                  alt={review.reviewerName}
                                />
                                <AvatarFallback className="bg-primary/10">
                                  {review.reviewerName
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {review.reviewerName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {new Date(
                                    review.projectStartDate
                                  ).toLocaleDateString("vi-VN", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md">
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                              <span className="ml-1 font-semibold">
                                {review.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="font-medium text-primary mb-1">
                              {review.projectTitle}
                            </h4>
                            <p className="text-gray-600 italic mb-3">
                              "{review.note}"
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded-lg">
                            <div className="flex flex-col">
                              <span className="text-gray-500">
                                Thời gian dự án
                              </span>
                              <span className="font-medium">
                                {review.projectDuration} ngày
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-500">Ngân sách</span>
                              <span className="font-medium">
                                {review.projectBudget.toLocaleString()} VND
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Chưa có đánh giá nào
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
