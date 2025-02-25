import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  Globe,
  FileText,
  MessageSquare,
  History,
  Star,
  Users,
  Calendar,
} from 'lucide-react';

const ClientDetail = () => {
  const [profile, setProfile] = useState({
    // User information
    firstName: 'Nguyễn',
    lastName: 'Văn B',
    email: 'nguyenvanb@company.com',
    phoneNumber: '0987654321',
    address: 'TP. Hồ Chí Minh',
    title: 'Project Manager',
    introduction: 'Project Manager với hơn 8 năm kinh nghiệm quản lý dự án phần mềm...',

    // Company information
    companyName: 'Tech Solutions Corp',
    phoneContact: '02838123456',
    companyAddress: 'Quận 1, TP. HCM',
    industry: 'Công nghệ thông tin',

    // Client specific
    fromPrice: 500,
    toPrice: 2000,
    typePrice: 'USD',
    avatar: 'https://github.com/shadcn.png',
  });

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <FadeInWhenVisible>
            <Card className="p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`} />
                    <AvatarFallback>NV</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">
                        {profile.firstName} {profile.lastName}
                      </h1>
                      <p className="text-xl text-muted-foreground mb-4">
                        {profile.title}
                      </p>
                      <div className="flex flex-wrap gap-4 text-muted-foreground">
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 mr-2" />
                          {profile.companyName}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {profile.address}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Liên hệ
                      </Button>
                      <Button variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Báo cáo
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Ngân sách</p>
                          <p className="font-semibold">
                            {profile.fromPrice} - {profile.toPrice} {profile.typePrice}
                          </p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Đánh giá</p>
                          <p className="font-semibold">4.8/5.0</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Dự án đã thuê</p>
                          <p className="font-semibold">12 dự án</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>
          </FadeInWhenVisible>

          {/* Main Content */}
          <FadeInWhenVisible delay={0.2}>
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="company">Công ty</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="p-8">
                  <h2 className="text-xl font-semibold mb-6">Giới thiệu</h2>
                  <p className="text-muted-foreground mb-8">{profile.introduction}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4">Thông tin liên hệ</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-muted-foreground" />
                          <span>{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-muted-foreground" />
                          <span>{profile.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-muted-foreground" />
                          <span>{profile.address}</span>
                        </div>
                      </div>
                    </div>

              
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="company">
                <Card className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <Building2 className="w-8 h-8 text-primary" />
                    <div>
                      <h2 className="text-xl font-semibold">{profile.companyName}</h2>
                      <p className="text-muted-foreground">{profile.industry}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4">Thông tin công ty</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-muted-foreground" />
                          <span>{profile.phoneContact}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-muted-foreground" />
                          <span>{profile.companyAddress}</span>
                        </div>
                        {/* <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-muted-foreground" />
                          <span>www.techsolutions.com</span>
                        </div> */}
                      </div>
                    </div>

                    {/* <div>
                      <h3 className="font-semibold mb-4">Quy mô công ty</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-muted-foreground" />
                          <span>100-200 nhân viên</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-5 h-5 text-muted-foreground" />
                          <span>Thành lập năm 2015</span>
                        </div>
                      </div>
                    </div> */}
                  </div>
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