import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Search, Briefcase, Clock, DollarSign, MapPin, Bookmark, Calendar } from 'lucide-react';
import api from '@/api/axiosConfig'; 

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<any[]>([]); 
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await api.get('/jobs/SavedJobs/1');
        setSavedJobs(response.data); 
      } catch (error) {
        console.error(error);
      }
    };

    fetchSavedJobs();
  }, []);

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
              job.company.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((job, index) => (
              <FadeInWhenVisible key={job.id} delay={index * 0.1}>
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Link to={`/jobs/${job.id}`} className="hover:underline">
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                        </Link>
                        <div className="flex items-center gap-2">
                          <Badge variant={job.type === 'Toàn thời gian' ? 'default' : 'secondary'}>
                            {job.type}
                          </Badge>
                          <Button variant="ghost" size="icon" className="text-primary">
                            <Bookmark className="w-5 h-5 fill-current" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-2" />
                          {job.company}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {job.duration}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          {job.budget}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Lưu: {job.savedDate}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{job.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.map((skill: any) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <Button asChild>
                          <Link to={`/jobs/${job.id}`}>Xem chi tiết</Link>
                        </Button>
                        <Button variant="outline">Ứng tuyển ngay</Button>
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
