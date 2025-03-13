import { useRef, useState } from 'react';
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
import { User, Briefcase, GraduationCap, FolderKanban, Shield, FileText } from 'lucide-react';
import SettingsTour from './SettingsTour';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [openTour, setOpenTour] = useState(false);

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
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div ref={refs.tabsRef1} className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Cài đặt tài khoản</h1>
          <div >
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
                  <span className="hidden md:inline">Portfolio</span>
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
    </div>
  );
};

export default Settings;