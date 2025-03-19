import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Plus, Link as LinkIcon, Trash2, Upload } from 'lucide-react';
import { notification } from 'antd';
import projectsService, { Project } from '@/api/projectsService';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const freelancerId = JSON.parse(localStorage.getItem('userInfo') || '{}').freelancerId;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsService.getProjectsByFreelancerId(freelancerId);
      if (response.data) {
        const transformedProjects = response.data.map(project => ({
          ...project,
          technologies: project.tech.split(',').map(tech => tech.trim())
        }));
        setProjects(transformedProjects);
      }
    } catch (error) {
      console.error('Lỗi khi tải dự án:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải dự án. Vui lòng thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  const addProject = () => {
    const newProject = {
      id: 0,
      title: '',
      description: '',
      link: '',
      tech: '',
      image: '',
      freelancerId,
      technologies: [],
    };
    setProjects([...projects, newProject]);
  };

  const removeProject = async (id) => {
    try {
      if (id > 0) {
        await projectsService.deleteProject(id);
        notification.success({
          message: 'Thành công',
          description: 'Xóa dự án thành công'
        });
      }
      setProjects(projects.filter((project) => project.id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa dự án:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi khi xóa dự án'
      });
    }
  };

  const updateProject = (id, field, value) => {
    setProjects(
      projects.map((project) => {
        if (project.id === id) {
          const updatedProject = { ...project, [field]: value };

          if (field === 'technologies' && Array.isArray(value)) {
            updatedProject.tech = value.join(', ');
          }

          return updatedProject;
        }
        return project;
      })
    );
  };

  const handleImageUpload = async (id, file) => {
    try {
      setSubmitting(true);
      const project = projects.find(p => p.id === id);

      let imageUrl;
      if (project && project.image) {
        imageUrl = await projectsService.updateImage(project.image, file);
      } else {
        imageUrl = await projectsService.uploadImage(file);
      }

      updateProject(id, 'image', imageUrl);

      notification.success({
        message: 'Thành công',
        description: 'Tải ảnh lên thành công'
      });
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải ảnh lên. Vui lòng thử lại.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const saveProject = async (project) => {
    try {
      setSubmitting(true);

      const projectData = {
        title: project.title,
        tech: project.tech,
        description: project.description,
        link: project.link,
        image: project.image,
        freelancerId: project.freelancerId
      };

      let response;
      if (project.id > 0) {
        response = await projectsService.updateProject(project.id, projectData);
      } else {
        response = await projectsService.createProject(projectData);

        if (response.data) {
          setProjects(
            projects.map(p =>
              p.id === project.id ? { ...response.data, technologies: project.technologies } : p
            )
          );
        }
      }

      notification.success({
        message: 'Thành công',
        description: 'Lưu dự án thành công'
      });
    } catch (error) {
      console.error('Lỗi khi lưu dự án:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể lưu dự án. Vui lòng thử lại.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (id, e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(id, file);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <LinkIcon className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">Chưa có dự án nào</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Bạn chưa có dự án nào trong danh mục. Hãy thêm dự án để giới thiệu năng lực và kinh nghiệm của bạn với nhà tuyển dụng.
          </p>
        </div>
      )}
      {projects.map((project, index) => (
        <FadeInWhenVisible key={project.id} delay={index * 0.1}>
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-lg font-semibold">Dự án</h3>
              <div className="flex space-x-2">
                <Button
                  className='bg-primary'
                  onClick={() => saveProject(project)}
                  disabled={submitting}
                >
                  Lưu
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => removeProject(project.id)}
                  disabled={submitting}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên dự án</label>
                <Input
                  value={project.title}
                  onChange={(e) =>
                    updateProject(project.id, 'title', e.target.value)
                  }
                  placeholder="Tên dự án"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Công nghệ sử dụng</label>
                <Input
                  value={project.technologies.join(', ')}
                  onChange={(e) =>
                    updateProject(
                      project.id,
                      'technologies',
                      e.target.value.split(',').map((tech) => tech.trim())
                    )
                  }
                  placeholder="React, Node.js, MongoDB,..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Liên kết dự án</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    value={project.link}
                    onChange={(e) =>
                      updateProject(project.id, 'link', e.target.value)
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hình ảnh dự án</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`project-image-${project.id}`}
                    onChange={(e) => handleFileChange(project.id, e)}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById(`project-image-${project.id}`)?.click()}
                    disabled={submitting}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {project.image ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                  </Button>
                  {project.image && (
                    <div className="h-10 w-10 overflow-hidden rounded border">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Mô tả dự án</label>
                <Textarea
                  value={project.description}
                  onChange={(e) =>
                    updateProject(project.id, 'description', e.target.value)
                  }
                  placeholder="Mô tả chi tiết về dự án và vai trò của bạn"
                  rows={4}
                />
              </div>
            </div>
          </Card>
        </FadeInWhenVisible>
      ))}

      <FadeInWhenVisible delay={projects.length * 0.1}>
        <Button
          variant="outline"
          className="w-full"
          onClick={addProject}
          disabled={submitting}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm dự án
        </Button>
      </FadeInWhenVisible>
    </div>
  );
};

export default Portfolio;