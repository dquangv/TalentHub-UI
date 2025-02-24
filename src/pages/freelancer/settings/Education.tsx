import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Plus, GraduationCap, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Education = () => {
  const { t } = useLanguage();
  const [education, setEducation] = useState([
    {
      id: 1,
      school: 'Đại học Bách Khoa Hà Nội',
      degree: 'Kỹ sư Công nghệ Thông tin',
      specialization: 'Kỹ thuật phần mềm',
      startYear: '2016',
      endYear: '2020',
      description: 'Chuyên ngành Kỹ thuật phần mềm...',
    },
    {
      id: 2,
      school: 'FPT Software Academy',
      degree: 'Chứng chỉ Full Stack Developer',
      specialization: 'Phát triển Web',
      startYear: '2020',
      endYear: '2021',
      description: 'Khóa học chuyên sâu về phát triển web...',
    },
  ]);

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      school: '',
      degree: '',
      specialization: '',
      startYear: '',
      endYear: '',
      description: '',
    };
    setEducation([...education, newEducation]);
  };

  const removeEducation = (id: number) => {
    setEducation(education.filter((edu) => edu.id !== id));
  };

  const updateEducation = (id: number, field: string, value: string) => {
    setEducation(
      education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  return (
    <div className="space-y-6">
      {education.map((edu, index) => (
        <FadeInWhenVisible key={edu.id} delay={index * 0.1}>
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold"> {t('Education')}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => removeEducation(edu.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('School')}</label>
                <Input
                  value={edu.school}
                  onChange={(e) =>
                    updateEducation(edu.id, 'school', e.target.value)
                  }
                  placeholder="Tên trường"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('Certificate')}</label>
                <Input
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(edu.id, 'degree', e.target.value)
                  }
                  placeholder="Tên bằng cấp hoặc chứng chỉ"
                />
              </div>

              <div className="space-y-2">
                {/* <label className="text-sm font-medium">{t('Specialization')}</label> */}
                <label className="text-sm font-medium">Chuyên ngành</label> 
                <Input
                  value={edu.specialization}
                  onChange={(e) =>
                    updateEducation(edu.id, 'specialization', e.target.value)
                  }
                  placeholder="Chuyên ngành"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('Theyearbegins')}</label>
                <Input
                  type="number"
                  min="1900"
                  max="2099"
                  value={edu.startYear}
                  onChange={(e) =>
                    updateEducation(edu.id, 'startYear', e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('Theyearends')}</label>
                <Input
                  type="number"
                  min="1900"
                  max="2099"
                  value={edu.endYear}
                  onChange={(e) =>
                    updateEducation(edu.id, 'endYear', e.target.value)
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">{t('Describe')}</label>
                <Textarea
                  value={edu.description}
                  onChange={(e) =>
                    updateEducation(edu.id, 'description', e.target.value)
                  }
                  placeholder="Mô tả chi tiết về chương trình học và thành tích"
                  rows={4}
                />
              </div>
            </div>
          </Card>
        </FadeInWhenVisible>
      ))}

      <FadeInWhenVisible delay={education.length * 0.1}>
        <Button
          variant="outline"
          className="w-full"
          onClick={addEducation}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('Moreeducation')}
        </Button>
      </FadeInWhenVisible>
    </div>
  );
};

export default Education;
