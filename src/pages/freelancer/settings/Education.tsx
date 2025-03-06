import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Plus, GraduationCap, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import api from '@/api/axiosConfig';
import { notification } from 'antd';

const Education = () => {
  const { t } = useLanguage();
  const [education, setEducation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (userInfo.freelancerId) {
          const response = await api.get(`/v1/freelancers/detail?id=${userInfo.freelancerId}`);
          if (response.status === 200 && response.data) {
            // Transform API data to component format
            const formattedEducation = response.data.educations.map((edu: any) => {
              const startDate = new Date(edu.startDate);
              const endDate = new Date(edu.endDate);

              return {
                id: edu.id,
                school: edu.school?.schoolName || '',
                degree: edu.degree?.degreeTitle || '',
                specialization: edu.major?.majorName || '',
                startYear: startDate.getFullYear().toString(),
                endYear: endDate.getFullYear().toString(),
                description: edu.description || '',
                // Keep reference to original objects for API persistence
                schoolId: edu.school?.id,
                degreeId: edu.degree?.id,
                majorId: edu.major?.id
              };
            });

            setEducation(formattedEducation);
          }
        }
      } catch (error) {
        console.error('Error fetching education data:', error);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải thông tin học vấn. Vui lòng thử lại sau.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      school: '',
      degree: '',
      specialization: '',
      startYear: '',
      endYear: '',
      description: '',
      schoolId: null,
      degreeId: null,
      majorId: null
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

  const saveEducation = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (userInfo.freelancerId) {
        // Transform component data to API format
        const apiData = education.map(edu => ({
          id: typeof edu.id === 'number' && edu.id > Date.now() - 86400000 ? null : edu.id, // If newly added (recent timestamp), set id to null
          startDate: `${edu.startYear}-01-01`,
          endDate: `${edu.endYear}-12-31`,
          description: edu.description,
          school: {
            id: edu.schoolId || null,
            schoolName: edu.school
          },
          degree: {
            id: edu.degreeId || null,
            degreeTitle: edu.degree
          },
          major: {
            id: edu.majorId || null,
            majorName: edu.specialization
          }
        }));

        // API call to update education would go here
        // await api.put(`/v1/freelancers/${userInfo.freelancerId}/educations`, apiData);

        notification.success({
          message: 'Thành công',
          description: 'Cập nhật thông tin học vấn thành công'
        });
      }
    } catch (error) {
      console.error('Error saving education data:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể cập nhật thông tin học vấn. Vui lòng thử lại sau.'
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      {education.map((edu, index) => (
        <FadeInWhenVisible key={edu.id} delay={index * 0.1}>
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">{t('Education')}</h3>
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

      <div className="flex justify-end mt-4">
        <Button onClick={saveEducation}>
          Lưu thông tin học vấn
        </Button>
      </div>
    </div>
  );
};

export default Education;