import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import {
  Briefcase,
  Users,
  TrendingUp,
  CheckCircle,
  Code,
  Paintbrush,
  Star,
  ChevronDown,
  Bold,
} from "lucide-react";
import AnimatedNumber from "@/components/animations/AnimatedNumber";
import { useLanguage } from "@/contexts/LanguageContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import api from "@/api/axiosConfig";
import { formatCurrency } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Helmet } from "react-helmet";
import {
  UserIcon,
  BriefcaseIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
  LibraryIcon,
} from "@heroicons/react/solid";
import SEO from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";

interface Banner {
  id: number;
  title: string;
  image: string;
  status: string;
  vendor: string;
  startTime: string;
  endTime: string;
}
interface Freelancer {
  id: number;
  name: string;
  hourlyRate: number;
  description: string;
  categoryName: string;
  userId: number;
  avatar: string;
  rating: number | null;
  skills: string[];
}
interface Job {
  id: number;
  title: string;
  companyName: string;
  hourWork: number;
  fromPrice: number;
  toPrice: number;
  description: string;
  skillName: string[];
  categoryName: string;
  applied?: boolean;
  seen?: boolean;
  remainingTimeFormatted?: string;
  createdTimeFormatted?: string;
}

const FeatureCard = ({
  Icon,
  colorClass,
  gradientClass,
  title,
  description,
  delay,
}: any) => (
  <FadeInWhenVisible delay={delay}>
    <Card className="p-6 text-center border-primary/10 dark:border-primary/20 hover:border-primary/20 dark:hover:border-primary/30 transition-colors group bg-white dark:bg-gray-800">
      <div className="relative w-12 h-12 mx-auto mb-4">
        <Icon
          className={`w-12 h-12 transition-transform duration-300 group-hover:scale-110 ${colorClass}`}
          style={{ filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))" }}
        />
        <div
          className={`absolute inset-0 rounded-full opacity-20 blur-lg ${gradientClass}`}
        />
      </div>
      <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-white">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </Card>
  </FadeInWhenVisible>
);
const BenefitCard = ({
  Icon,
  colorClass,
  gradientClass,
  title,
  description,
  delay,
}: any) => (
  <FadeInWhenVisible delay={delay}>
    <div className="text-center group p-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="relative w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-100 dark:group-hover:bg-primary-800 transition-colors">
        <Icon
          className={`w-8 h-8 transition-transform duration-300 group-hover:scale-110 ${colorClass}`}
          style={{ filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))" }}
        />
        <div
          className={`absolute inset-0 rounded-full opacity-20 blur-lg ${gradientClass}`}
        />
      </div>
      <h3 className="text-xl font-semibold mb-4 text-primary-700 dark:text-primary-300">{title}</h3>
      <p className="text-muted-foreground dark:text-gray-400">{description}</p>
    </div>
  </FadeInWhenVisible>
);

const IconCard = ({
  Icon,
  colorClass,
  gradientClass,
  title,
  value,
  loading,
  description,
}: any) => (
  <FadeInWhenVisible>
    <Card className="p-6 text-center border-primary/10 dark:border-primary/20 hover:border-primary/20 dark:hover:border-primary/30 transition-colors group bg-white dark:bg-gray-800">
      <div className="relative w-12 h-12 mx-auto mb-4">
        <Icon
          className={`w-12 h-12 transition-transform duration-300 group-hover:scale-110 ${colorClass}`}
          style={{ filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))" }}
        />
        <div
          className={`absolute inset-0 rounded-full opacity-20 blur-lg ${gradientClass}`}
        />
      </div>
      <h3 className="text-3xl font-bold mb-2 text-primary-700 dark:text-gray-300">
        {loading ? (
          <AnimatedNumber start={0} end={50000} />
        ) : (
          <AnimatedNumber start={0} end={value} />
        )}
      </h3>
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
    </Card>
  </FadeInWhenVisible>
);
// Breadcrumb Component
const Breadcrumb = () => (
  <nav
    aria-label="Breadcrumb"
    className="py-2 px-4 bg-white/80 rounded-md shadow-sm mb-4"
  >
    <ol className="flex text-sm">
      <li className="flex items-center">
        <Link to="/" className="text-primary-600 hover:underline">
          Trang chủ
        </Link>
      </li>
    </ol>
  </nav>
);

// Schema Markup Component
const SchemaMarkup = () => {
  return (
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: "https://talenthub.io.vn/",
        name: "TalentHub - Kết nối tài năng với nhà tuyển dụng",
        description:
          "TalentHub là nền tảng kết nối tài năng với nhà tuyển dụng, giúp thúc đẩy sự nghiệp của bạn trong lĩnh vực công nghệ.",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://talenthub.io.vn/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      })}
    </script>
  );
};

const Home = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalFreelancers: 0,
    approvedFreelancerJobs: 0,
    postedJobs: 0,
    loading: true,
  });
  const [banners, setBanners] = useState<Banner[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsPremium, setJobPremium] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [loadingRecommendedJobs, setLoadingRecommendedJobs] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [suitableFreelancers, setSuitableFreelancers] = useState<Freelancer[]>(
    []
  );
  const [loadingFreelancers, setLoadingFreelancers] = useState(true);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const handleNavigation = (path) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };
  useEffect(() => {
    const userInfoStr = localStorage.getItem("userInfo");
    if (userInfoStr) {
      try {
        const parsedUserInfo = JSON.parse(userInfoStr);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchSuitableFreelancers = async () => {
      if (userInfo && userInfo.clientId) {
        try {
          setLoadingFreelancers(true);
          const response = await api.get(
            `/v1/freelancers/clients/${userInfo.clientId}/job-category-freelancers`
          );
          if (response.status === 200) {
            setSuitableFreelancers(response.data);
          }
          setLoadingFreelancers(false);
        } catch (error) {
          console.error("Error fetching suitable freelancers:", error);
          setLoadingFreelancers(false);
        }
      } else {
        setLoadingFreelancers(false);
      }
    };

    fetchSuitableFreelancers();
  }, [userInfo]);

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      if (userInfo && userInfo.freelancerId) {
        try {
          setLoadingRecommendedJobs(true);
          const response = await api.get(
            `/v1/jobs/recommended/${userInfo.freelancerId}`
          );
          if (response.status === 200) {
            setRecommendedJobs(response.data);
          }
          setLoadingRecommendedJobs(false);
        } catch (error) {
          console.error("Error fetching recommended jobs:", error);
          setLoadingRecommendedJobs(false);
        }
      } else {
        setLoadingRecommendedJobs(false);
      }
    };

    fetchRecommendedJobs();
  }, [userInfo]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await api.get("statistics/home");
        if (response.success) {
          setStats({
            totalFreelancers: response.totalFreelancers || 0,
            approvedFreelancerJobs: response.approvedFreelancerJobs || 0,
            postedJobs: response.postedJobs || 0,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    const fetchBanners = async () => {
      try {
        const response = await api.get("/v1/banners");
        if (response.status === 200) {
          const today = new Date().toISOString().split("T")[0];
          const validBanners = response.data.filter(
            (banner: Banner) => banner.endTime >= today && banner.status
          );
          setBanners(validBanners);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    const fetchJobsPremium = async () => {
      try {
        const response = await api.get("/v1/jobs/top-6");
        if (response.status === 200) {
          setJobPremium(response.data);
        }
      } catch (error) {
        console.error("Error fetching premium jobs:", error);
      }
    };

    fetchJobsPremium();
    fetchStatistics();
    fetchBanners();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get(`/v1/jobs?freelancerId=${0}`);
        if (response.status === 200) {
          const jobData: Job[] = response.data;
          const filteredJobs: { [key: string]: Job } = {};
          const categoryCount: { [key: string]: number } = {};
          let uniqueCategories = 0;

          jobData.forEach((job) => {
            const category = job.categoryName;
            if (uniqueCategories < 6) {
              if (!categoryCount[category]) {
                categoryCount[category] = 1;
                uniqueCategories++;
              }
              if (
                !filteredJobs[category] ||
                job.toPrice > filteredJobs[category].toPrice
              ) {
                filteredJobs[category] = job;
              } else if (
                job.toPrice === filteredJobs[category].toPrice &&
                job.fromPrice > filteredJobs[category].fromPrice
              ) {
                filteredJobs[category] = job;
              }
            }
          });

          setJobs(Object.values(filteredJobs));
        }
        setLoadingJobs(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoadingJobs(false);
      }
    };

    const fetchLogo = async () => {
      try {
        const response = await api.get(`/v1/banners/logos`);
        if (response.status === 200) {
          setCustomers(response.data);
        }
      } catch (error) {
        console.error("Error fetching logos:", error);
      }
    };

    fetchLogo();
    fetchJobs();
  }, []);

  const [showAll, setShowAll] = useState(false);
  const [customers, setCustomers] = useState([
    {
      id: 1,
      vendor: "TalentHub",
      logo: null,
      status: true,
    },
  ]);

  const displayedCustomers = showAll ? customers : customers.slice(0, 4);
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://talenthub.io.vn/",
    name: "TalentHub - Kết nối tài năng IT với nhà tuyển dụng",
    description:
      "TalentHub là nền tảng kết nối tài năng IT với nhà tuyển dụng, giúp thúc đẩy sự nghiệp của bạn.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://talenthub.io.vn/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <main className="relative">
      <SEO
        title="TalentHub - Kết nối tài năng IT với nhà tuyển dụng hàng đầu Việt Nam"
        description="TalentHub là nền tảng kết nối freelancer IT với nhà tuyển dụng, giúp bạn tìm việc hoặc thuê lập trình viên, thiết kế đồ họa, digital marketing chất lượng cao."
        keywords="TalentHub, việc làm IT, tuyển dụng lập trình viên, freelancer Việt Nam, tìm việc IT, thuê lập trình viên"
        canonicalUrl="/"
        jsonLd={homeJsonLd}
      />
      <Helmet>
        <title>
          TalentHub - Kết nối tài năng với nhà tuyển dụng hàng đầu Việt Nam
        </title>
        <meta
          name="description"
          content="TalentHub là nền tảng kết nối freelancer với nhà tuyển dụng, giúp bạn tìm việc hoặc thuê lập trình viên, thiết kế đồ họa, digital marketing chất lượng cao."
        />
        <meta
          name="keywords"
          content="TalentHub, việc làm, tuyển dụng lập trình viên, freelancer Việt Nam, nhà tuyển dụng, sự nghiệp, việc làm công nghệ"
        />
        <meta
          property="og:title"
          content="TalentHub - Kết nối tài năng với nhà tuyển dụng"
        />
        <meta
          property="og:description"
          content="TalentHub là nền tảng kết nối tài năng với nhà tuyển dụng, giúp thúc đẩy sự nghiệp của bạn trong lĩnh vực công nghệ."
        />
        <link rel="canonical" href="https://talenthub.io.vn/" />
      </Helmet>

      <SchemaMarkup />
      <div className="w-full h-[400px] relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className="w-full h-full rounded-lg overflow-hidden"
        >
          {banners?.map((banner) => (
            <SwiperSlide key={banner.id} className="w-full h-full">
              <div className="relative w-full h-full">
                <img
                  src={banner.image}
                  alt={`TalentHub - ${banner.title}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          ))}
          {banners?.length === 0 && (
            <>
              <SwiperSlide className="w-full h-full">
                <div className="relative w-full h-full">
                  <img
                    src="https://cdn.pixabay.com/photo/2021/03/02/13/05/laptop-6062425_1280.jpg"
                    alt="TalentHub - Kết nối với các dự án"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide className="w-full h-full">
                <div className="relative w-full h-full">
                  <img
                    src="https://www.hrmanagementapp.com/wp-content/uploads/2019/06/freelancer-2.jpg"
                    alt="TalentHub - Tìm freelancer chất lượng cao"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide className="w-full h-full">
                <div className="relative w-full h-full">
                  <img
                    src="https://fthmb.tqn.com/f6uChwfNF8VyWQk02SvWhoJfnE0=/2121x1414/filters:fill(auto,1)/GettyImages-505095190-58ee7c925f9b582c4ddfc6a4.jpg"
                    alt="TalentHub - Thuê lập trình viên tự do"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            </>
          )}
        </Swiper>
      </div>
      <header
        className="relative py-[50px] bg-gradient-to-b from-primary-100 via-background to-background"
        id="hero-section"
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <FadeInWhenVisible>
              <h1 className="text-2xl md:text-6xl font-bold pb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Kết nối với các dự án và nhà tuyển dụng hàng đầu Việt Nam
              </h1>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.2}>
              <p className="text-xl text-muted-foreground mb-8">
                TalentHub - Nền tảng kết nối freelancer với nhà tuyển dụng, giúp
                bạn tìm việc hoặc thuê lập trình viên chất lượng cao
              </p>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="text-lg bg-primary hover:bg-primary-600"
                  onClick={() =>
                    isLoggedIn
                      ? navigate("/client/post-job")
                      : navigate("/login")
                  }
                >
                  Đăng Việc Ngay
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg border-primary text-primary hover:bg-primary-50 hover:text-primary"
                  onClick={() =>
                    isLoggedIn ? navigate("/freelancers") : navigate("/login")
                  }
                >
                  Tìm Freelancer
                </Button>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </header>

      <section className="py-16" id="statistics-section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <IconCard
              Icon={UserIcon}
              colorClass="text-blue-500 dark:text-blue-400"
              title="Số lượng ứng viên tài năng"
              value={stats.totalFreelancers}
              loading={stats.loading}
              description="Số lượng ứng viên tài năng"
            />
            <IconCard
              Icon={BriefcaseIcon}
              colorClass="text-green-500 dark:text-green-400"
              title="Số lượng dự án đã đăng"
              value={stats.postedJobs}
              loading={stats.loading}
              description="Số lượng dự án đã đăng"
            />
            <IconCard
              Icon={ChartPieIcon}
              colorClass="text-purple-500 dark:text-purple-400"
              title="Số lượng hợp tác thành công"
              value={stats.approvedFreelancerJobs}
              loading={stats.loading}
              description="Số lượng hợp tác thành công"
            />
          </div>
        </div>
      </section>

      {/* Jobs Premium */}
      <section
        className="py-20"
        id="top-jobs"
      >
        <div className="container mx-auto px-6">
          <FadeInWhenVisible>
            <h2 className="text-4xl font-extrabold text-center mb-16 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-600 py-4">
              Top Dự Án Nổi Bật
            </h2>
          </FadeInWhenVisible>
          {loadingJobs ? (
            <div className="col-span-3 min-h-[200px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
            </div>
          ) : jobsPremium?.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 text-lg">
              Không có công việc nào để hiển thị.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {jobsPremium?.map((job, index) => (
                <FadeInWhenVisible key={job.id} delay={index * 0.15}>
                  <Card
                    className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group h-full"
                    style={{ height: "100%" }}
                  >
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-600 dark:to-orange-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md hover:from-red-600 hover:to-orange-600 dark:hover:from-red-700 dark:hover:to-orange-700 transition-all duration-300">
                        Hot
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-50/0 via-primary-50/20 to-primary-50/50 dark:from-primary-900/0 dark:via-primary-900/20 dark:to-primary-900/50 opacity-0 transition-opacity duration-300" />
                    <div className="relative flex items-start gap-4 flex-grow h-full">
                      {job.categoryName.includes("Quản lý dự án") ? (
                        <Briefcase className="w-10 h-10 text-primary-600 dark:text-primary-400 transition-colors" />
                      ) : job.categoryName.includes("Thiết kế") ? (
                        <Paintbrush className="w-10 h-10 text-primary-600 dark:text-primary-400 transition-colors" />
                      ) : (
                        <Code className="w-10 h-10 text-primary-600 dark:text-primary-400 transition-colors" />
                      )}
                      <div className="flex flex-col flex-grow h-full">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            Đăng bởi:
                          </span>{" "}
                          <span className="text-gray-800 dark:text-gray-200">
                            {job.companyName || "Ẩn danh"}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            Ngân sách:
                          </span>{" "}
                          <span className="text-primary-600 dark:text-primary-400 font-medium">
                            {formatCurrency(job.fromPrice)} -{" "}
                            {formatCurrency(job.toPrice)}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            Thời gian thực hiện dự án:
                          </span>{" "}
                          <span className="text-gray-800 dark:text-gray-200">
                            {job.hourWork} giờ
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            Hạn ứng tuyển:
                          </span>{" "}
                          <span className="text-primary-600 dark:text-primary-400 font-medium">
                            Còn {job.remainingTimeFormatted}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4 leading-relaxed line-clamp-2">
                          {job.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skillName.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full text-xs font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex-1"></div>
                        <Link to={`/jobs/${job.id}`}>
                          <Button
                            variant="outline"
                            className="w-full bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-800 border-none rounded-lg shadow-sm transition-all duration-300"
                          >
                            Xem chi tiết
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>
          )}

          {jobsPremium && jobsPremium.length > 0 && (
            <div className="text-center mt-10">
              <Button
                onClick={() => navigate("/jobs")}
                size="lg"
                className="bg-primary-600 dark:bg-primary-500 hover:bg-primary-600 dark:hover:bg-primary-800 text-white"
              >
                Xem tất cả công việc
              </Button>
            </div>
          )}
        </div>
      </section>

      {userInfo && userInfo.clientId ? (
        <section
          className="py-20 bg-gradient-to-br from-blue-50 via-white to-gray-50"
          id="suitable-freelancers"
        >
          <div className="container mx-auto px-6">
            <FadeInWhenVisible>
              <h2 className="text-4xl font-extrabold text-center mb-16 text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Ứng Viên Phù Hợp Cho Dự Án Của Bạn
              </h2>
            </FadeInWhenVisible>

            {loadingFreelancers ? (
              <div className="col-span-3 min-h-[200px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : suitableFreelancers.length === 0 ? (
              <div className="text-center space-y-6">
                <p className="text-gray-600 text-lg">
                  Bạn chưa có dự án nào để gợi ý freelancer phù hợp.
                </p>
                <Button
                  onClick={() =>
                    isLoggedIn
                      ? navigate("/client/post-job")
                      : navigate("/login")
                  }
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Bắt đầu đăng việc để được gợi ý
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suitableFreelancers.map((freelancer, index) => (
                  <FadeInWhenVisible key={freelancer.id} delay={index * 0.1}>
                    <Card className="p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16 rounded-full border-2 border-blue-100">
                          <AvatarImage
                            src={freelancer.avatar}
                            alt={`Freelancer ${freelancer.name}`}
                            loading="lazy"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px] md:text-xs">
                            {freelancer.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{freelancer.name}</h3>
                            <div className="flex items-center">
                              {freelancer.rating ? (
                                <>
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="ml-1">
                                    {freelancer.rating.toFixed(1)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-sm text-gray-500 italic">
                                  Chưa có đánh giá
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {freelancer.categoryName}
                          </p>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {freelancer.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {freelancer.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-600">
                              ${freelancer.hourlyRate}/giờ
                            </span>
                            <Link
                              to={
                                isLoggedIn
                                  ? `/freelancers/${freelancer.id}`
                                  : "/login"
                              }
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                              >
                                Xem hồ sơ
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </FadeInWhenVisible>
                ))}
              </div>
            )}

            {!loadingFreelancers && suitableFreelancers.length > 0 && (
              <div className="text-center mt-12">
                <Button
                  onClick={() =>
                    isLoggedIn ? navigate("/freelancers") : navigate("/login")
                  }
                  variant="outline"
                  size="lg"
                  className="hover:bg-blue-50 border-blue-200 text-blue-700"
                >
                  Xem tất cả ứng viên
                </Button>
              </div>
            )}
          </div>
        </section>
      ) : userInfo ? null : (
        <section
          className="py-20"
          id="freelancer-section"
        >
          <div className="container mx-auto px-6">
            <FadeInWhenVisible>
              <h2 className="text-4xl font-extrabold text-center mb-16 text-gray-800 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent py-4">
                Tìm Kiếm Ứng Viên Tài Năng
              </h2>
            </FadeInWhenVisible>

            <div className="text-center space-y-6">
              <p className="text-gray-600 text-lg mb-8">
                Đăng ký và đăng việc để tìm kiếm ứng viên phù hợp với dự án của
                bạn
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <FeatureCard
                  Icon={Users}
                  colorClass="text-blue-600"
                  title="Ứng viên chất lượng cao"
                  description="Tiếp cận hàng ngàn lập trình viên, nhà thiết kế và chuyên gia có kỹ năng phù hợp."
                  delay={0.1}
                />
                <FeatureCard
                  Icon={CheckCircle}
                  colorClass="text-green-600"
                  title="Đảm bảo chất lượng"
                  description="Các freelancer đã được xác minh kỹ năng và đánh giá bởi các khách hàng trước đó."
                  delay={0.2}
                />
                <FeatureCard
                  Icon={Code}
                  colorClass="text-purple-600"
                  title="Đa dạng lĩnh vực"
                  description="Từ phát triển web, mobile đến AI, machine learning và thiết kế UX/UI."
                  delay={0.3}
                />
              </div>
              <Button
                onClick={() => navigate("/client/post-job")}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Bắt đầu đăng việc để được gợi ý
              </Button>
            </div>
          </div>
        </section>
      )}

{userInfo && userInfo.freelancerId && (
  <section
    className="py-20"
    id="recommended-jobs"
  >
    <div className="container mx-auto px-6">
      <FadeInWhenVisible>
        <h2 className="text-4xl font-extrabold text-center mb-16 text-gray-800 dark:text-gray-200 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-600 py-4">
          Công Việc Phù Hợp Với Bạn
        </h2>
      </FadeInWhenVisible>
      {loadingRecommendedJobs ? (
        <div className="text-center text-gray-500 dark:text-gray-400 text-lg">
          <div className="col-span-3 min-h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
          </div>
        </div>
      ) : recommendedJobs.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 text-lg">
          Không tìm thấy công việc phù hợp với kỹ năng của bạn.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {recommendedJobs.map((job, index) => (
            <FadeInWhenVisible key={job.id} delay={index * 0.15}>
              <Card
                className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group h-full"
                style={{ height: "100%" }}
              >
                {!job.seen && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md hover:from-blue-600 hover:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700 transition-all duration-300">
                      Mới
                    </Badge>
                  </div>
                )}
                {job.applied && (
                  <div className="absolute top-3 right-16">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md hover:from-green-600 hover:to-emerald-600 dark:hover:from-green-700 dark:hover:to-emerald-700 transition-all duration-300">
                      Đã ứng tuyển
                    </Badge>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-50/0 via-primary-50/20 to-primary-50/50 dark:from-primary-900/0 dark:via-primary-900/20 dark:to-primary-900/50 opacity-0 transition-opacity duration-300" />
                <div className="relative flex items-start gap-4 flex-grow h-full">
                  {job.categoryName.includes("Quản lý dự án") ? (
                    <Briefcase className="w-10 h-10 text-primary-600 dark:text-primary-400 transition-colors" />
                  ) : job.categoryName.includes("Thiết kế") ? (
                    <Paintbrush className="w-10 h-10 text-primary-600 dark:text-primary-400 transition-colors" />
                  ) : (
                    <Code className="w-10 h-10 text-primary-600 dark:text-primary-400 transition-colors" />
                  )}
                  <div className="flex flex-col flex-grow h-full">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Đăng bởi:
                      </span>{" "}
                      <span className="text-gray-800 dark:text-gray-200">
                        {job.companyName || "Ẩn danh"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Ngân sách:
                      </span>{" "}
                      <span className="text-primary-600 dark:text-primary-400 font-medium">
                        {formatCurrency(job.fromPrice)} -{" "}
                        {formatCurrency(job.toPrice)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Thời gian thực hiện dự án:
                      </span>{" "}
                      <span className="text-gray-800 dark:text-gray-200">
                        {job.hourWork} giờ
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Hạn ứng tuyển:
                      </span>{" "}
                      <span className="text-primary-600 dark:text-primary-400 font-medium">
                        Còn {job.remainingTimeFormatted}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Đăng:
                      </span>{" "}
                      <span className="text-gray-800 dark:text-gray-200">
                        {job.createdTimeFormatted}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-4 leading-relaxed line-clamp-2">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skillName.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full text-xs font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex-1"></div>
                    <Link to={`/jobs/${job.id}`}>
                      <Button
                        variant="outline"
                        className="w-full bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-800 border-none rounded-lg shadow-sm transition-all duration-300"
                      >
                        {job.applied ? "Xem chi tiết" : "Ứng tuyển ngay"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>
          ))}
        </div>
      )}
      {!loadingRecommendedJobs && recommendedJobs.length > 0 && (
        <div className="text-center mt-10">
          <Button
            onClick={() => navigate("/jobs")}
            size="lg"
            className="bg-primary-600 dark:bg-primary-500 hover:bg-primary-600 dark:hover:bg-primary-800 text-white"
          >
            Xem tất cả công việc
          </Button>
        </div>
      )}
    </div>
  </section>
)}
  <section className="py-16" id="explore-projects">
  <div className="container mx-auto px-4">
    <FadeInWhenVisible>
      <h2 className="text-3xl font-bold text-center mb-12 text-primary-800 dark:text-primary-300">
        Khám Phá Các Dự Án Hấp Dẫn
      </h2>
    </FadeInWhenVisible>
    {loadingJobs ? (
      <div className="col-span-3 min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    ) : jobs.length === 0 ? (
      <div className="text-center text-muted-foreground dark:text-gray-400">
        Không có công việc nào để hiển thị.
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs?.map((job, index) => (
          <FadeInWhenVisible key={job.id} delay={index * 0.15}>
            <Card
              className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group h-full"
              style={{ height: "100%" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary-50/0 via-primary-50/20 to-primary-50/50 dark:from-primary-900/0 dark:via-primary-900/20 dark:to-primary-900/50 opacity-0 transition-opacity duration-300" />
              <div className="relative flex items-start gap-4 flex-grow h-full">
                {job.categoryName.includes("Quản lý dự án") ? (
                  <Briefcase className="w-10 h-10 text-primary-600 dark:text-primary-400 transition-colors" />
                ) : job.categoryName.includes("Thiết kế") ? (
                  <Paintbrush className="w-10 h-10 text-primary-600 dark:text-primary-400 transition-colors" />
                ) : (
                  <Code className="w-10 h-10 text-primary-600 dark:text-primary-400 transition-colors" />
                )}
                <div className="flex flex-col flex-grow h-full">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Đăng bởi:
                    </span>{" "}
                    <span className="text-gray-800 dark:text-gray-200">
                      {job.companyName || "Ẩn danh"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Ngân sách:
                    </span>{" "}
                    <span className="text-primary-600 dark:text-primary-400 font-medium">
                      {formatCurrency(job.fromPrice)} -{" "}
                      {formatCurrency(job.toPrice)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Thời gian thực hiện dự án:
                    </span>{" "}
                    <span className="text-gray-800 dark:text-gray-200">
                      {job.hourWork} giờ
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Hạn ứng tuyển:
                    </span>{" "}
                    <span className="text-primary-600 dark:text-primary-400 font-medium">
                      Còn {job.remainingTimeFormatted}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4 leading-relaxed line-clamp-3">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skillName.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full text-xs font-medium hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex-1"></div>
                  <Link to={isLoggedIn ? `/jobs/${job.id}` : "/login"}>
                    <Button
                      variant="outline"
                      className="w-full bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-800 border-none rounded-lg shadow-sm transition-all duration-300"
                    >
                      Xem chi tiết
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </FadeInWhenVisible>
        ))}
      </div>
    )}

    {jobs && jobs.length > 0 && (
      <div className="text-center mt-10">
        <Button
          onClick={() =>
            isLoggedIn ? navigate("/jobs") : navigate("/login")
          }
          size="lg"
          className="bg-primary-600 dark:bg-primary-500 hover:bg-primary-600 dark:hover:bg-primary-800 text-white"
        >
          Xem tất cả dự án
        </Button>
      </div>
    )}
  </div>
</section>

      {/* <section className="py-16" id="how-it-works">
        <div className="container mx-auto px-4">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-center mb-12 text-primary-800">Cách Thức Hoạt Động</h2>
          </FadeInWhenVisible>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps?.map((step, index) => (
              <FadeInWhenVisible key={step.title} delay={index * 0.2}>
                <div className="text-center group">
                  <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-100 transition-colors">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-primary-700">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section> */}

<section className="py-16" id="features">
  <div className="container mx-auto px-4">
    <FadeInWhenVisible>
      <h2 className="text-3xl font-bold text-center mb-12 text-primary-800 dark:text-primary-300">
        Đặc điểm nổi bật
      </h2>
    </FadeInWhenVisible>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <BenefitCard
        Icon={Users}
        colorClass="text-blue-600 dark:text-blue-400"
        gradientClass="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300"
        title="Cộng đồng lớn mạnh"
        description="Tiếp cận hàng ngàn freelancer chất lượng cao và các doanh nghiệp hàng đầu"
        delay={0.1}
      />
      <BenefitCard
        Icon={CurrencyDollarIcon}
        colorClass="text-orange-600 dark:text-orange-400"
        gradientClass="bg-gradient-to-r from-orange-600 to-orange-400 dark:from-orange-500 dark:to-orange-300"
        title="Thanh toán an toàn"
        description="Hệ thống thanh toán bảo mật, giải ngân khi khách hàng hài lòng với kết quả"
        delay={0.2}
      />
      <BenefitCard
        Icon={LibraryIcon}
        colorClass="text-green-600 dark:text-green-400"
        gradientClass="bg-gradient-to-r from-green-600 to-green-400 dark:from-green-500 dark:to-green-300"
        title="Hỗ trợ nhanh chóng"
        description="Đội ngũ hỗ trợ chuyên nghiệp, sẵn sàng giải đáp mọi thắc mắc của bạn"
        delay={0.3}
      />
    </div>
  </div>
</section>

      <section
        className="py-20 relative"
        id="cta-section"
      >
        <div className="container relative mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Bắt đầu tìm kiếm freelancer ngay hôm nay
              </h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.2}>
              <p className="text-lg mb-8 text-primary-600/80">
                Đăng ký miễn phí và bắt đầu kết nối với cộng đồng tài năng
                freelancer
              </p>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.4}>
              <Button
                size="lg"
                className="text-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate("/register")}
              >
                Đăng ký ngay
              </Button>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      <section className="py-16" id="trusted-companies">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary-800">
            Đối Tác của TalentHub
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 items-center">
            {displayedCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex flex-col items-center justify-center p-4 hover:bg-gray-50 rounded-lg transition-colors duration-300"
              >
                {customer.logo ? (
                  <img
                    src={customer.logo}
                    alt={`Đối tác ${customer.vendor}`}
                    className="h-12 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-700">
                    <img
                      width={60}
                      src="/favicon.png"
                      alt="TalentHub logo"
                      className="favicon"
                      loading="lazy"
                    />
                  </div>
                )}
                <p className="mt-2 text-sm font-medium text-gray-600 text-center dark:text-gray-300">
                  {customer.vendor}
                </p>
              </div>
            ))}
          </div>

          {customers.length > 3 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-300 font-medium"
                aria-expanded={showAll}
              >
                {showAll ? "Thu gọn" : "Xem thêm"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${showAll ? "rotate-180" : ""
                    }`}
                />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

const steps = [
  {
    title: "Đăng việc miễn phí",
    description: "Mô tả chi tiết công việc và yêu cầu kỹ năng của bạn",
    icon: <Briefcase className="w-8 h-8 text-primary-600" />,
  },
  {
    title: "Nhận báo giá từ chuyên gia",
    description: "Nhận báo giá từ các freelancer phù hợp với dự án của bạn",
    icon: <Users className="w-8 h-8 text-primary-600" />,
  },
  {
    title: "Hoàn thành dự án thành công",
    description: "Làm việc và thanh toán an toàn qua hệ thống TalentHub",
    icon: <CheckCircle className="w-8 h-8 text-primary-600" />,
  },
];

export default Home;
