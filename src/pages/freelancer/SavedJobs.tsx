import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Search, Briefcase, Clock, DollarSign, MapPin, Bookmark, Calendar } from 'lucide-react';
import api from '@/api/axiosConfig'; 
import { notification } from 'antd';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<any[]>([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate()
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userInfo") || "{}");

    if (!data?.freelancerId) {
      navigate("/login");
    }

    const fetchSavedJobs = async () => {
      try {
        const response = await api.get(`/v1/jobs/SavedJobs/${data.freelancerId}`);
        setSavedJobs(response.data); 
      } catch (error) {
        console.error(error);
      }
    };

    fetchSavedJobs();
  }, []);

  
  // const handleApplyJob = async (jobId: any) => {
  //   const data = JSON.parse(localStorage.getItem("userInfo") || "{}");

  //   if (!data?.freelancerId) {
  //     navigate("/login");
  //   }
  //   const response = await api.post("/v1/jobs/apply", {
  //     freelancerId: data?.freelancerId,
  //     jobId: Number(jobId),
  //   });
  //   if (response.status !== 200) {
  //     notification.error({
  //       message: "Lỗi dữ liệu",
  //       description: response.data.message || "Dữ liệu không hợp lệ",
  //     });

  //   }else {
  //     setSavedJobs(pre => pre.map(item => item?.jobId == jobId ? item.applied = true : item.applied = false))
  //     notification.info({
  //       message: "Thông báo",
  //       description: "Ứng tuyển thành công. Vui lòng chờ để được chấp nhận",
  //     });
  //   }
  
  // };
  
  const handleUnSaveJob = async (jobId: any) => {
    const data = JSON.parse(localStorage.getItem("userInfo") || "{}");
    if (!data?.freelancerId) {
      navigate("/login");
    }
    const response = await api.post("/v1/jobs/unsave", {
      freelancerId: data?.freelancerId,
      jobId: Number(jobId),
    });
   
    notification.info({
      message: "Thông báo",
      description: "Hủy lưu việc thành công",
    });
    setSavedJobs(pre => pre.filter(item => item?.jobId != jobId))
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeInWhenVisible>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Công việc đã lưu</h1>
            <p className="text-muted-foreground">
              Quản lý danh sách công việc bạn quan tâm và muốn ứng tuyển sau
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Search and Filter */}
        <FadeInWhenVisible delay={0.1}>
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Tìm kiếm công việc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button>
                <Search className="w-4 h-4 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </Card>
        </FadeInWhenVisible>

        {/* Saved Jobs List */}
        <div className="space-y-6">
          {savedJobs.length > 0 ? (
            savedJobs.filter((job) => 
              job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
            )?.map((job, index) => (
              <FadeInWhenVisible key={job.jobId} delay={index * 0.1}>
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Link to={`/jobs/${job.jobId}`} className="hover:underline">
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                        </Link>
                        <div className="flex items-center gap-2">
                          <Badge variant={job.jobType === 'Toàn thời gian' ? 'default' : 'secondary'}>
                            {job.jobType}
                          </Badge>
                          <Button onClick={() => handleUnSaveJob(job.jobId)} variant="ghost" size="icon" className="text-primary">
                            <Bookmark className="w-5 h-5 fill-current"/>
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-2" />
                          {job.companyName}
                        </div>
                     
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {job.hourWork}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          {job.fromPrice} - {job.toPrice}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Lưu: {job.savedDate}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{job.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job?.skillNames?.map((skill: any) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <Button asChild>
                          <Link to={`/jobs/${job.jobId}`}>Xem chi tiết</Link>
                        </Button>
                        {/* <Button onClick={() => handleApplyJob(job.jobId)} variant="outline"> {job.applied ? "Đã ứng tuyển": "Ứng tuyển ngay"}</Button> */}
                      </div>
                    </div>
                  </div>
                </Card>
              </FadeInWhenVisible>
            ))
          ) : (
            <FadeInWhenVisible>
              <Card className="p-12 text-center">
                <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Chưa có công việc đã lưu</h3>
                <p className="text-muted-foreground mb-6">
                  Bạn chưa lưu công việc nào. Hãy khám phá các cơ hội việc làm và lưu lại những công việc bạn quan tâm.
                </p>
                <Button asChild>
                  <Link to="/jobs">Tìm việc ngay</Link>
                </Button>
              </Card>
            </FadeInWhenVisible>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;
