import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Star, MapPin, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchFreelancers } from '../services/freelancerFetch';

interface Freelancer {
  id: number;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  location: string;
  skills: string[];
  hourlyRate: string;
}

const Freelancers = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFreelancers = async () => {
      setLoading(true);
      try {
        const data = await fetchFreelancers();
        console.log(data)
        setFreelancers(data.data); 
      } catch (error) {
        console.error('Error loading freelancers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFreelancers();
  }, []); 

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <FadeInWhenVisible>
            <h1 className="text-3xl font-bold text-center mb-8">
              {t('SearchFreelancer')}
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
                  {t('Search')}
                </Button>
                <Button variant="outline">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : freelancers.length === 0 ? (
            <div className="text-center text-gray-500">{t('No Freelancers Available')}</div>
          ) : (
            freelancers.map((freelancer, index) => (
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
                          <Link to={`/freelancers/${freelancer.id}`}>
                            {t('Viewprofile')}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </FadeInWhenVisible>
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            {t('Seemore')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Freelancers;
