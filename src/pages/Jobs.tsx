import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import { Search, Filter, Clock, DollarSign, Briefcase, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import api from "@/api/axiosConfig";

interface Job {
  id: string;
  title: string;
  description: string;
  skillName: string[];
  companyName: string;
  hourWork: number;
  fromPrice: number;
  toPrice: number;
}

interface FilterState {
  selectedSkills: string[];
  minPrice: number;
  maxPrice: number;
  minHours: number;
  maxHours: number;
}

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { t } = useLanguage();

  const [filters, setFilters] = useState<FilterState>({
    selectedSkills: [],
    minPrice: 0,
    maxPrice: 1000000000,
    minHours: 0,
    maxHours: 168,
  });

  const uniqueSkills: any = [];
  for (const job of jobs) {
      for (const skill of job.skillName) {
          if (!uniqueSkills.includes(skill)) {
              uniqueSkills.push(skill);
          }
      }
  }
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/v1/jobs");
        if (response.status === 200) {
          setJobs(response.data);
          setFilteredJobs(response.data);
        } else {
          console.error("Failed to fetch jobs:", response.message);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const toggleSkill = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter(s => s !== skill)
        : [...prev.selectedSkills, skill]
    }));
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skillName.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filters.selectedSkills.length > 0) {
      filtered = filtered.filter(job =>
        filters.selectedSkills.some(skill => 
          job.skillName.includes(skill)
        )
      );
    }

    filtered = filtered.filter(job =>
      job.fromPrice >= filters.minPrice &&
      job.toPrice <= filters.maxPrice
    );

    filtered = filtered.filter(job =>
      job.hourWork >= filters.minHours &&
      job.hourWork <= filters.maxHours
    );

    setFilteredJobs(filtered);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      selectedSkills: [],
      minPrice: 0,
      maxPrice: 1000000000,
      minHours: 0,
      maxHours: 168,
    });
    setFilteredJobs(jobs);
  };

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
                <Button onClick={applyFilters}>
                  <Search className="w-4 h-4 mr-2" />
                  {t("Search")}
                </Button>
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Bộ lọc công việc</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Kỹ năng</h3>
                        <div className="flex flex-wrap gap-2">
                          {uniqueSkills.map(skill => (
                            <Badge
                              key={skill}
                              variant={filters.selectedSkills.includes(skill) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => toggleSkill(skill)}
                            >
                              {skill}
                              {filters.selectedSkills.includes(skill) && (
                                <X className="w-3 h-3 ml-1" />
                              )}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Mức giá (VND)</h3>
                        <div className="flex items-center gap-4">
                          <Input
                            type="number"
                            value={filters.minPrice}
                            onChange={(e) => setFilters(prev => ({ 
                              ...prev, 
                              minPrice: parseInt(e.target.value) 
                            }))}
                            className="w-32"
                            placeholder="Tối thiểu"
                          />
                          <span>-</span>
                          <Input
                            type="number"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters(prev => ({ 
                              ...prev, 
                              maxPrice: parseInt(e.target.value) 
                            }))}
                            className="w-32"
                            placeholder="Tối đa"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Số giờ làm việc/tuần</h3>
                        <div className="flex items-center gap-4">
                          <Input
                            type="number"
                            value={filters.minHours}
                            onChange={(e) => setFilters(prev => ({ 
                              ...prev, 
                              minHours: parseInt(e.target.value) 
                            }))}
                            className="w-20"
                            min="0"
                            max="168"
                          />
                          <span>-</span>
                          <Input
                            type="number"
                            value={filters.maxHours}
                            onChange={(e) => setFilters(prev => ({ 
                              ...prev, 
                              maxHours: parseInt(e.target.value) 
                            }))}
                            className="w-20"
                            min="0"
                            max="168"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button onClick={applyFilters} className="flex-1">
                          Áp dụng
                        </Button>
                        <Button variant="outline" onClick={resetFilters}>
                          Đặt lại
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {filteredJobs.map((job, index) => (
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
                      <Link to={`/jobs/${job.id}`}>Xem chi tiết</Link>
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