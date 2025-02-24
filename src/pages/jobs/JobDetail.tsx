import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import {
  Clock,
  DollarSign,
  Briefcase,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
} from 'lucide-react';
import axiosInstance from '@/utils/axiosConfig';

interface JobDetailResponse {
  title: string;
  companyName: string;
  location?: string;
  type: string;
  fromPrice: number;
  toPrice: number;
  hourWork: number;
  description: string;
  skillNames: string[];
  experience?: string;
  deadline?: string;
}

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobDetailResponse | null>(null);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await axiosInstance.get(`/jobs/detail-job/${id}`);
        if (response.status === 200) {
          setJob(response.data?.data); 
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJobDetail();
  }, [id]);

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <FadeInWhenVisible>
            <Card className="p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                  <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {job.companyName}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location ?? "Unknown Location"}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{job.type}</Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="lg">Ứng tuyển ngay</Button>
                  <Button variant="outline">Lưu việc làm</Button>
                </div>
              </div>
            </Card>
          </FadeInWhenVisible>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <FadeInWhenVisible delay={0.1}>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <DollarSign className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ngân sách</p>
                    <p className="font-semibold">{job.fromPrice} - {job.toPrice} VND</p>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.2}>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Clock className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Số giờ làm việc</p>
                    <p className="font-semibold">{job.hourWork} giờ/tuần</p>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.3}>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Calendar className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Kinh nghiệm</p>
                    <p className="font-semibold">{!job.experience ? "Không yêu cầu" : job.experience}</p>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.4}>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Số lượng ứng viên</p>
                    <p className="font-semibold">{job?.totalApplicant || 0}</p>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>
          </div>

          {/* Description Section */}
          <FadeInWhenVisible delay={0.5}>
            <Card className="p-8 mb-8">
              <h2 className="text-xl font-semibold mb-4">Mô tả công việc</h2>
              <p className="text-muted-foreground mb-6">{job.description}</p>

              <h3 className="font-semibold mb-3">Yêu cầu:</h3>
              <ul className="space-y-2 mb-6">
                {job?.skillNames?.map((skill, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span className="text-muted-foreground">{skill}</span>
                  </li>
                ))}
              </ul>

              {/* <h3 className="font-semibold mb-3">Quyền lợi:</h3>
              <ul className="space-y-2 mb-6">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul> */}

              <h3 className="font-semibold mb-3">Kỹ năng yêu cầu:</h3>
              <div className="flex flex-wrap gap-2">
                {job?.skillNames?.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="text-center">
              <Button size="lg" className="px-8 mt-8 w-full">
                Ứng tuyển ngay
              </Button>
            </div>
            </Card>
          
          </FadeInWhenVisible>


        </div>
      </div>
    </div>
  );
};

export default JobDetail;
