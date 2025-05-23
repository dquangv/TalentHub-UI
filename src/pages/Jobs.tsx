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
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import {
  Search,
  Filter,
  Clock,
  DollarSign,
  Briefcase,
  X,
  Tag,
  Calendar,
  History,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import api from "@/api/axiosConfig";
import freelancerService from "@/api/freelancerService";
import { Spin } from "antd";
import LoadingEffect from "@/components/ui/LoadingEffect";

interface Job {
  id: string;
  title: string;
  description: string;
  skillName: string[];
  companyName: string;
  categoryName: string;
  hourWork: number;
  fromPrice: number;
  toPrice: number;
  seen: boolean;
  remainingTimeFormatted: string;
  createdAt: string;
  createdTimeFormatted: string;
}

interface FilterState {
  selectedSkills: string[];
  minPrice: number;
  maxPrice: number;
  minHours: number;
  maxHours: number;
  selectedCategories: string[];
}

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const { t } = useLanguage();
  const freelancerId = JSON.parse(
    localStorage.getItem("userInfo") || "{}"
  ).freelancerId;
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    selectedSkills: [],
    minPrice: 0,
    maxPrice: 1000000000,
    minHours: 0,
    maxHours: 9999,
    selectedCategories: [],
  });

  const uniqueCategories: string[] = [];
  jobs.forEach((job) => {
    if (!uniqueCategories.includes(job.categoryName)) {
      uniqueCategories.push(job.categoryName);
    }
  });

  const categorySkills: any = {};
  jobs.forEach((job) => {
    if (!categorySkills[job.categoryName]) {
      categorySkills[job.categoryName] = [];
    }
    job.skillName.forEach((skill) => {
      if (!categorySkills[job.categoryName].includes(skill)) {
        categorySkills[job.categoryName].push(skill);
      }
    });
  });

  const getAvailableSkills = () => {
    let skills: string[] = [];
    if (filters.selectedCategories.length === 0) {
      jobs.forEach((job) => {
        job.skillName.forEach((skill) => {
          if (!skills.includes(skill)) {
            skills.push(skill);
          }
        });
      });
    } else {
      filters.selectedCategories.forEach((category) => {
        if (categorySkills[category]) {
          categorySkills[category].forEach((skill) => {
            if (!skills.includes(skill)) {
              skills.push(skill);
            }
          });
        }
      });
    }
    return skills;
  };
  useEffect(() => {
    const fetchFreelancerData = async () => {
      if (freelancerId) {
        try {
          const response = await freelancerService.getFreelancerById(
            Number(freelancerId)
          );
          if (response.status === 200 && response.data) {
            const categoryName = response.data.categoryName;
            if (categoryName) {
              setFilters((prev) => ({
                ...prev,
                selectedCategories: categoryName ? [categoryName] : [],
              }));
            }
          }
        } catch (error) {
          console.error("Error fetching freelancer data:", error);
        }
      }
    };

    fetchFreelancerData();
  }, [freelancerId]);
  const uniqueSkills = getAvailableSkills();

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/v1/jobs", {
          params: { freelancerId },
        });
        if (response.status === 200) {
          setJobs(response.data);

          // Apply filters based on freelancerCategory
          if (filters.selectedCategories.length > 0) {
            if (filters.selectedCategories.includes("Chọn lĩnh vực")) {
              filters.selectedCategories = [];
            }
            const filtered = response.data.filter((job) =>
              filters.selectedCategories.includes(job.categoryName)
            );
            setFilteredJobs(filtered);
          } else {
            setFilteredJobs(response.data);
          }
        } else {
          console.error("Failed to fetch jobs:", response.message);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, [freelancerId, filters.selectedCategories]);

  const toggleSkill = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter((s) => s !== skill)
        : [...prev.selectedSkills, skill],
    }));
  };

  const toggleCategory = (category: string) => {
    setFilters((prev) => {
      const newCategories = prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category];
      const newSkills = prev.selectedSkills.filter(
        (skill) =>
          newCategories.length === 0 ||
          newCategories.some((cat) => categorySkills[cat].includes(skill))
      );
      return {
        ...prev,
        selectedCategories: newCategories,
        selectedSkills: newSkills,
      };
    });
  };

  const applyFilters = () => {
    setIsLoading(true);

    setTimeout(() => {
      let filtered = [...jobs];

      if (searchTerm) {
        filtered = filtered.filter(
          (job) =>
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.skillName.some((skill) =>
              skill.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
      }

      if (filters.selectedSkills.length > 0) {
        filtered = filtered.filter((job) =>
          filters.selectedSkills.some((skill) => job.skillName.includes(skill))
        );
      }

      filtered = filtered.filter(
        (job) =>
          job.fromPrice >= filters.minPrice && job.toPrice <= filters.maxPrice
      );

      filtered = filtered.filter(
        (job) =>
          job.hourWork >= filters.minHours && job.hourWork <= filters.maxHours
      );

      if (filters.selectedCategories.length > 0) {
        filtered = filtered.filter((job) =>
          filters.selectedCategories.includes(job.categoryName)
        );
      }

      setFilteredJobs(filtered);
      setIsLoading(false);
      setIsFilterOpen(false);
    }, 800);
  };

  const resetFilters = () => {
    setFilters({
      selectedSkills: [],
      minPrice: 0,
      maxPrice: 1000000000,
      minHours: 0,
      maxHours: 9999,
      selectedCategories: [],
    });
    setFilteredJobs(jobs);
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getJobCountInfo = () => {
    let message = `Tổng cộng ${filteredJobs.length} công việc`;

    if (filters.selectedCategories.length > 0) {
      message += ` với danh mục: ${filters.selectedCategories.join(", ")}`;
    }

    if (filters.selectedSkills.length > 0) {
      message += `, kỹ năng: ${filters.selectedSkills.join(", ")}`;
    }

    return message;
  };
  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {[...Array(totalPages)].map((_, idx) => (
            <Button
              key={idx}
              variant={currentPage === idx + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => paginate(idx + 1)}
              className="w-8 h-8 p-0"
            >
              {idx + 1}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <FadeInWhenVisible>
            <h1 className="text-3xl font-bold text-center mb-8">
              {t("SearchforFreelancejobs")}
            </h1>
          </FadeInWhenVisible>
          <div className="max-w-2xl mx-auto">
            <FadeInWhenVisible delay={0.2}>
              <div className="flex gap-4 mb-4">
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
                  <SheetContent className="w-[400px] flex flex-col">
                    <SheetHeader>
                      <SheetTitle>Bộ lọc công việc</SheetTitle>
                    </SheetHeader>

                    <ScrollArea className="flex-1 px-1">
                      <div className="py-6 space-y-6">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Danh mục</h3>
                          <div className="flex flex-wrap gap-2">
                            {uniqueCategories.map((category) => (
                              <Badge
                                key={category}
                                variant={
                                  filters.selectedCategories.includes(category)
                                    ? "default"
                                    : "outline"
                                }
                                className="cursor-pointer"
                                onClick={() => toggleCategory(category)}
                              >
                                {category}
                                {filters.selectedCategories.includes(
                                  category
                                ) && <X className="w-3 h-3 ml-1" />}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Kỹ năng</h3>
                          <div className="flex flex-wrap gap-2">
                            {uniqueSkills.length > 0 ? (
                              uniqueSkills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant={
                                    filters.selectedSkills.includes(skill)
                                      ? "default"
                                      : "outline"
                                  }
                                  className="cursor-pointer"
                                  onClick={() => toggleSkill(skill)}
                                >
                                  {skill}
                                  {filters.selectedSkills.includes(skill) && (
                                    <X className="w-3 h-3 ml-1" />
                                  )}
                                </Badge>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Không có kỹ năng nào khả dụng
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">
                            Ngân sách (VND)
                          </h3>
                          <div className="flex items-center gap-4">
                            <Input
                              type="number"
                              value={filters.minPrice}
                              onChange={(e) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  minPrice: parseInt(e.target.value) || 0,
                                }))
                              }
                              className="w-32"
                              placeholder="Tối thiểu"
                            />
                            <span>-</span>
                            <Input
                              type="number"
                              value={filters.maxPrice}
                              onChange={(e) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  maxPrice:
                                    parseInt(e.target.value) || 1000000000,
                                }))
                              }
                              className="w-32"
                              placeholder="Tối đa"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">
                            Số giờ làm việc
                          </h3>
                          <div className="flex items-center gap-4">
                            <Input
                              type="number"
                              value={filters.minHours}
                              onChange={(e) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  minHours: parseInt(e.target.value) || 0,
                                }))
                              }
                              className="w-20"
                              min="0"
                              max="999999999999999999"
                            />
                            <span>-</span>
                            <Input
                              type="number"
                              value={filters.maxHours}
                              onChange={(e) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  maxHours: parseInt(e.target.value) || 9999,
                                }))
                              }
                              className="w-20"
                              min="0"
                              max="999999999999999999"
                            />
                          </div>
                        </div>
                      </div>
                    </ScrollArea>

                    <SheetFooter className="pt-4 border-t mt-4">
                      <div className="flex gap-4 w-full">
                        <Button onClick={applyFilters} className="flex-1">
                          Áp dụng
                        </Button>
                        <Button variant="outline" onClick={resetFilters}>
                          Đặt lại
                        </Button>
                      </div>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
        <div className="space-y-6">
          {isLoading ? (
            <LoadingEffect />
          ) : filteredJobs.length > 0 ? (
            <>
              <div className="text-sm font-medium mb-4">
                <span className="bg-primary/10 px-2 py-1 rounded-md">
                  {getJobCountInfo()}
                </span>
              </div>
              {currentItems.map((job, index) => (
                <Card key={job.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-semibold">
                          {job.title}
                          &nbsp;
                          {job?.jobOpportunity && (
                            <Badge variant="default">Hợp tác lâu dài</Badge>
                          )}
                        </h3>
                      </div>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
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
                          <User className="w-4 h-4 mr-2" />{" "}
                          {job?.client.firstName} {job?.client.lastName}
                        </div>
                        {job.companyName && (
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-2" />
                            {job.companyName}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 mr-2" />
                          {job.categoryName}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {job.hourWork} giờ
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          {job.fromPrice.toLocaleString()} -{" "}
                          {job.toPrice.toLocaleString()} VND
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Còn lại {job.remainingTimeFormatted}
                        </div>
                        <div className="flex items-center">
                          <History className="w-4 h-4 mr-2" />
                          Đăng {job.createdTimeFormatted}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button>
                        <Link to={`/jobs/${job.id}`}>Xem chi tiết</Link>
                      </Button>
                      {job.seen === true && (
                        <div className="flex justify-center">Đã xem</div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              <Pagination />
            </>
          ) : (
            <div className="text-center py-10">
              <div className="text-2xl font-semibold">
                Không tìm thấy công việc phù hợp
              </div>
              <p className="text-muted-foreground mt-2">
                Thử điều chỉnh lại bộ lọc của bạn
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Jobs;
