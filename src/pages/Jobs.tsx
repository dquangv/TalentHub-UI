import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import { Search, Filter, Clock, DollarSign, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import api from "@/api/axiosConfig";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs");
        if (response.status === 200) {
          setJobs(response.data);
        } else {
          console.error("Failed to fetch jobs:", response.message);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Search Section */}
        <div className="mb-12">
          <FadeInWhenVisible>
            <h1 className="text-3xl font-bold text-center mb-8">
              {t("SearchforFreelancejobs")}
            </h1>
          </FadeInWhenVisible>
          <div className="max-w-2xl mx-auto">
            <FadeInWhenVisible delay={0.2}>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder={t("JobSearch...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  {t("Search")}
                </Button>
                <Button variant="outline">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {jobs?.map((job, index) => (
            <FadeInWhenVisible key={job.id} delay={index * 0.1}>
              <Card className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-semibold">{job.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skillName.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {job.companyName}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {job.hourWork} hours/week
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        {job.fromPrice} - {job.toPrice} VND
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button>
                      <Link to={`/jobs/${job.id}`}>  {t("Apply")}</Link>
                    </Button>
                  
                    <div className="flex justify-center">Đã xem</div>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            {t("Seemorejobs")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Jobs;