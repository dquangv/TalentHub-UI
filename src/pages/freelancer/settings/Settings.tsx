import { useEffect, useRef, useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import Profile from './Profile';
import Experience from './Experience';
import Education from './Education';
import Portfolio from './Portfolio';
import Security from './Security';
import CVManager from '../CVManager';
import { User, Briefcase, GraduationCap, FolderKanban, Shield, FileText, CircleCheck, CircleAlert } from 'lucide-react';
import SettingsTour from './SettingsTour';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import userService from '@/api/userService';
import freelancerService from '@/api/freelancerService';
import experienceService from '@/api/experienceService';
import skillService from '@/api/skillService';
import projectsService from '@/api/projectsService';
import api from '@/api/axiosConfig';
import cvService from '@/api/cvService';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [openTour, setOpenTour] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [incompleteFields, setIncompleteFields] = useState<string[]>([]);
  const [profileData, setProfileData] = useState(null);
  const [educationData, setEducationData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [cvData, setCvData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const userInfoStr = localStorage.getItem("userInfo");
        const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
        const userId = userInfo.userId;
        const freelancerId = userInfo.freelancerId;

        if (!userId || !freelancerId) {
          window.location.pathname = '/';
          return;
        }

        // Initialize data containers
        let userData = null;
        let freelancerData = null;
        let educationData = [];
        let experienceData = [];
        let skillsData = [];
        let projectsData = [];
        let cvData = [];

        // Fetch user profile data
        try {
          const userResponse = await userService.getUserById(userId);
          if (userResponse.status === 200) {
            userData = userResponse.data;
            setProfileData(userData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }

        // Fetch freelancer profile data
        try {
          const freelancerResponse = await freelancerService.getFreelancerById(freelancerId);
          if (freelancerResponse.status === 200) {
            freelancerData = freelancerResponse.data;
          }
        } catch (error) {
          console.error('Error fetching freelancer data:', error);
        }

        // Fetch education data
        try {
          const educationResponse = await api.get(`/v1/educations/freelancer/${freelancerId}`);
          if (educationResponse.status === 200) {
            educationData = educationResponse.data || [];
            setEducationData(educationData);
          }
        } catch (error) {
          console.error('Error fetching education data:', error);
        }

        // Fetch experience data
        try {
          const experienceResponse = await experienceService.getFreelancerExperiences(freelancerId);
          if (experienceResponse.status === 200) {
            experienceData = experienceResponse.data || [];
            setExperienceData(experienceData);
          }
        } catch (error) {
          console.error('Error fetching experience data:', error);
        }

        // Fetch skills data
        try {
          const skillsResponse = await skillService.getFreelancerSkills(freelancerId);
          if (skillsResponse.status === 200) {
            skillsData = skillsResponse.data || [];
            setSkillsData(skillsData);
          }
        } catch (error) {
          console.error('Error fetching skills data:', error);
        }

        // Fetch projects data
        try {
          const projectsResponse = await projectsService.getProjectsByFreelancerId(freelancerId);
          if (projectsResponse.status === 200) {
            projectsData = projectsResponse.data || [];
            setProjectsData(projectsData);
          }
        } catch (error) {
          console.error('Error fetching projects data:', error);
        }

        // Fetch CV data
        try {
          const cvResponse = await cvService.getCVsByFreelancerId(freelancerId);
          if (cvResponse.status === 200) {
            cvData = cvResponse.data || [];
            setCvData(cvData);
          }
        } catch (error) {
          console.error('Error fetching CV data:', error);
        }

        calculateProfileCompletion(
          userData,
          freelancerData,
          educationData,
          experienceData,
          skillsData,
          projectsData,
          cvData
        );
      } catch (error) {
        console.error('Error in fetchAllData:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);
  const calculateProfileCompletion = (
    profile,
    freelancerProfile,
    education,
    experience,
    skills,
    projects,
    cvs
  ) => {
    const educationIsValid = Array.isArray(education) && education.length > 0;

    const cvsIsValid = Array.isArray(cvs) && cvs.length > 0;
    const fullName = profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : '';
    const title = profile?.title?.trim() || '';
    const categoryName = freelancerProfile?.categoryName?.trim() || '';
    const phoneNumber = profile?.phoneNumber?.trim() || '';
    const hasLocation = Boolean(profile?.country) && Boolean(profile?.province);
    const introduction = profile?.introduction?.trim() || '';
    const hasProfileImage = Boolean(profile?.image?.trim());
    const hourlyRate = Number(freelancerProfile?.hourlyRate) || 0;
    const hasSkills = Array.isArray(skills) && skills.length > 0;
    const hasExperience = Array.isArray(experience) && experience.length > 0;
    const hasEducation = educationIsValid;
    const hasProjects = Array.isArray(projects) && projects.length > 0;
    const hasCVs = cvsIsValid;

    const requiredFields = [
      { name: 'Họ tên', value: Boolean(fullName), tab: 'profile' },
      { name: 'Chức danh', value: Boolean(title), tab: 'profile' },
      { name: 'Lĩnh vực', value: Boolean(categoryName), tab: 'profile' },
      { name: 'Số điện thoại', value: Boolean(phoneNumber), tab: 'profile' },
      { name: 'Vị trí', value: hasLocation, tab: 'profile' },
      { name: 'Giới thiệu', value: Boolean(introduction), tab: 'profile' },
      { name: 'Ảnh đại diện', value: hasProfileImage, tab: 'profile' },
      { name: 'Lương mong muốn', value: hourlyRate > 0, tab: 'profile' },
      { name: 'Kỹ năng', value: hasSkills, tab: 'profile' },

      // Tab Kinh nghiệm làm việc
      { name: 'Kinh nghiệm làm việc', value: hasExperience, tab: 'experience' },

      // Tab Học vấn
      { name: 'Thông tin học vấn', value: hasEducation, tab: 'education' },

      // Tab Portfolio
      { name: 'Dự án cá nhân', value: hasProjects, tab: 'portfolio' },

      // Tab CV
      { name: 'CV cá nhân', value: hasCVs, tab: 'cv' },
    ];


    const incomplete = requiredFields
      .filter(field => !field.value)
      .map(field => ({
        name: field.name,
        tab: field.tab
      }));

    const completedCount = requiredFields.length - incomplete.length;
    const percentage = Math.round((completedCount / requiredFields.length) * 100);

    console.groupEnd();

    setIncompleteFields(incomplete);
    setCompletionPercentage(percentage);
  };
  useEffect(() => {
    const userInfoStr = localStorage.getItem("userInfo");
    const userId = userInfoStr ? JSON.parse(userInfoStr).userId : null;
    if (!userId) {
      window.location.pathname = '/'
    }
  }, [])
  const refs = {
    tabsRef1: useRef<HTMLDivElement>(null),
    tabsRef: useRef<HTMLDivElement>(null),
    profileRef: useRef<HTMLButtonElement>(null),
    experienceRef: useRef<HTMLButtonElement>(null),
    educationRef: useRef<HTMLButtonElement>(null),
    portfolioRef: useRef<HTMLButtonElement>(null),
    cvRef: useRef<HTMLButtonElement>(null),
    securityRef: useRef<HTMLButtonElement>(null),
  };

  return (
    <div className="">
      <div ref={refs.tabsRef1} className="max-w-4xl mx-auto">
        <div >
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Mức độ hoàn thiện hồ sơ</h3>
              <span className="text-lg font-semibold">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2 mb-4" />

            <div className="bg-muted p-4 rounded-lg">
              {completionPercentage === 100 ? (
                <div className="flex items-center text-green-500">
                  <CircleCheck className="h-5 w-5 mr-2" />
                  <p>Tuyệt vời! Hồ sơ của bạn đã hoàn thiện 100%</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center text-amber-500 mb-2">
                    <CircleAlert className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p>Hồ sơ của bạn chưa hoàn thiện. Điều này có thể ảnh hưởng đến khả năng tiếp cận khách hàng.</p>
                  </div>

                  <div className="mt-3">
                    <p className="font-medium mb-2">Các thông tin cần bổ sung:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {incompleteFields.map((field, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-background rounded px-3 py-2 cursor-pointer hover:bg-secondary/50"
                          onClick={() => setActiveTab(field.tab)}
                        >
                          <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                          <span>{field.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList ref={refs.tabsRef} className="grid grid-cols-2 md:grid-cols-6 mb-8">
              <TabsTrigger ref={refs.profileRef} value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden md:inline">Hồ sơ</span>
              </TabsTrigger>
              <TabsTrigger ref={refs.experienceRef} value="experience" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span className="hidden md:inline">Kinh nghiệm</span>
              </TabsTrigger>
              <TabsTrigger ref={refs.educationRef} value="education" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span className="hidden md:inline">Học vấn</span>
              </TabsTrigger>
              <TabsTrigger ref={refs.portfolioRef} value="portfolio" className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4" />
                <span className="hidden md:inline">Dự án</span>
              </TabsTrigger>
              <TabsTrigger ref={refs.cvRef} value="cv" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden md:inline">CV</span>
              </TabsTrigger>
              <TabsTrigger ref={refs.securityRef} value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden md:inline">Bảo mật</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Profile />
            </TabsContent>
            <TabsContent value="experience">
              <Experience />
            </TabsContent>
            <TabsContent value="education">
              <Education />
            </TabsContent>
            <TabsContent value="portfolio">
              <Portfolio />
            </TabsContent>
            <TabsContent value="cv">
              <CVManager />
            </TabsContent>
            <TabsContent value="security">
              <Security />
            </TabsContent>
          </Tabs>
        </div>

        <SettingsTour
          refs={refs}
          open={openTour}
          setOpen={setOpenTour}
        />
      </div>
    </div>
  );
};

export default Settings;