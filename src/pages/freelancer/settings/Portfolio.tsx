import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Plus, Image as ImageIcon, Link as LinkIcon, Trash2 } from 'lucide-react';

const Portfolio = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Xây dựng nền tảng thương mại điện tử với React và Node.js',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      link: 'https://example.com/project1',
      technologies: ['React', 'Node.js', 'MongoDB'],
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Ứng dụng quản lý công việc với React Native',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      link: 'https://example.com/project2',
      technologies: ['React Native', 'Firebase'],
    },
  ]);

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      title: '',
      description: '',
      image: '',
      link: '',
      technologies: [],
    };
    setProjects([...projects, newProject]);
  };

  const removeProject = (id: number) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  const updateProject = (id: number, field: string, value: string | string[]) => {
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  return (
    <div className="space-y-6">
      {projects.map((project, index) => (
        <FadeInWhenVisible key={project.id} delay={index * 0.1}>
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-lg font-semibold">Dự án</h3>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => removeProject(project.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
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
                <label className="text-sm font-medium">Hình ảnh</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    value={project.image}
                    onChange={(e) =>
                      updateProject(project.id, 'image', e.target.value)
                    }
                    placeholder="URL hình ảnh"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Link dự án</label>
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

              {project.image && (
                <div className="md:col-span-2">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </Card>
        </FadeInWhenVisible>
      ))}

      <FadeInWhenVisible delay={projects.length * 0.1}>
        <Button
          variant="outline"
          className="w-full"
          onClick={addProject}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm dự án
        </Button>
      </FadeInWhenVisible>
    </div>
  );
};

export default Portfolio;