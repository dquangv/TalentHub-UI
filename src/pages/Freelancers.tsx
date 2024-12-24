import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Star, MapPin, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Freelancers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Search Section */}
        <div className="mb-12">
          <FadeInWhenVisible>
            <h1 className="text-3xl font-bold text-center mb-8">
              Tìm kiếm Freelancer
            </h1>
          </FadeInWhenVisible>
          <div className="max-w-2xl mx-auto">
            <FadeInWhenVisible delay={0.2}>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Tìm kiếm theo kỹ năng, tên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  Tìm kiếm
                </Button>
                <Button variant="outline">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>

        {/* Freelancers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((freelancer, index) => (
            <FadeInWhenVisible key={freelancer.id} delay={index * 0.1}>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={freelancer.avatar}
                    alt={freelancer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{freelancer.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1">{freelancer.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {freelancer.title}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      {freelancer.location}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {freelancer.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {freelancer.hourlyRate}/giờ
                      </span>
                      <Button variant="outline" size="sm">
                      <Link to={`/freelancers/${freelancer.id}`}>Xem hồ sơ</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Xem thêm
          </Button>
        </div>
      </div>
    </div>
  );
};

const freelancers = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    title: 'Full Stack Developer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 4.9,
    location: 'Hà Nội',
    skills: ['React', 'Node.js', 'TypeScript'],
    hourlyRate: '300.000đ',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    title: 'UI/UX Designer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 4.8,
    location: 'TP. Hồ Chí Minh',
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    hourlyRate: '250.000đ',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    title: 'Digital Marketing Specialist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 4.7,
    location: 'Đà Nẵng',
    skills: ['SEO', 'Google Ads', 'Content Marketing'],
    hourlyRate: '200.000đ',
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    title: 'Mobile App Developer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 4.9,
    location: 'Hà Nội',
    skills: ['React Native', 'iOS', 'Android'],
    hourlyRate: '350.000đ',
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    title: 'Content Writer',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 4.6,
    location: 'TP. Hồ Chí Minh',
    skills: ['Copywriting', 'Blog Writing', 'SEO Writing'],
    hourlyRate: '150.000đ',
  },
  {
    id: 6,
    name: 'Vũ Thị F',
    title: 'Graphic Designer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 4.8,
    location: 'Đà Nẵng',
    skills: ['Photoshop', 'Illustrator', 'After Effects'],
    hourlyRate: '250.000đ',
  },
];

export default Freelancers;