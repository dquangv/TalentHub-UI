import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Plus, Briefcase, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Experience = () => {
  const { t } = useLanguage();
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      company: 'Tech Solutions Inc.',
      position: 'Senior Frontend Developer',
      startDate: '2020-01',
      endDate: '2024-03',
      current: true,
      description: 'Phát triển và duy trì các ứng dụng web quy mô lớn...',
    },
    {
      id: 2,
      company: 'Digital Innovation Co.',
      position: 'Frontend Developer',
      startDate: '2018-03',
      endDate: '2019-12',
      current: false,
      description: 'Xây dựng giao diện người dùng cho các ứng dụng web...',
    },
  ]);

  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setExperiences([...experiences, newExperience]);
  };

  const removeExperience = (id: number) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id: number, field: string, value: string | boolean) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  return (
    <div className="space-y-6">
      {experiences.map((experience, index) => (
        <FadeInWhenVisible key={experience.id} delay={index * 0.1}>
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">{t('Workexperience')}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => removeExperience(experience.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('Company')}</label>
                <Input
                  value={experience.company}
                  onChange={(e) =>
                    updateExperience(experience.id, 'company', e.target.value)
                  }
                  placeholder="Tên công ty"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('Position')}</label>
                <Input
                  value={experience.position}
                  onChange={(e) =>
                    updateExperience(experience.id, 'position', e.target.value)
                  }
                  placeholder="Vị trí công việc"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('Startdate')}</label>
                <Input
                  type="month"
                  value={experience.startDate}
                  onChange={(e) =>
                    updateExperience(experience.id, 'startDate', e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('Enddate')}</label>
                <Input
                  type="month"
                  value={experience.endDate}
                  onChange={(e) =>
                    updateExperience(experience.id, 'endDate', e.target.value)
                  }
                  disabled={experience.current}
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={experience.current}
                    onChange={(e) =>
                      updateExperience(experience.id, 'current', e.target.checked)
                    }
                    id={`current-${experience.id}`}
                  />
                  <label
                    htmlFor={`current-${experience.id}`}
                    className="text-sm text-muted-foreground"
                  >
                    {t('Workinghere')}
                  </label>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">{t('Jobdescription')}</label>
                <Textarea
                  value={experience.description}
                  onChange={(e) =>
                    updateExperience(experience.id, 'description', e.target.value)
                  }
                  placeholder="Mô tả chi tiết về công việc và thành tựu của bạn"
                  rows={4}
                />
              </div>
            </div>
          </Card>
        </FadeInWhenVisible>
      ))}

      <FadeInWhenVisible delay={experiences.length * 0.1}>
        <Button
          variant="outline"
          className="w-full"
          onClick={addExperience}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('Moreworkexperience')}
        </Button>
      </FadeInWhenVisible>
    </div>
  );
};

export default Experience;