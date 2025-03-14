import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Star, MapPin, Search, Filter, X } from 'lucide-react';
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

interface FilterState {
  location: string;
  minRate: number;
  maxRate: number;
  selectedSkills: string[];
  minRating: number;
}

const Freelancers = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    location: '',
    minRate: 0,
    maxRate: 200,
    selectedSkills: [],
    minRating: 0,
  });

  const uniqueLocations: any = [];
  for (const f of freelancers) {
    if (!uniqueLocations.includes(f.location)) {
      uniqueLocations.push(f.location);
    }
  }

  const uniqueSkills: any = [];
  for (const f of freelancers) {
    for (const skill of f.skills) {
      if (!uniqueSkills.includes(skill)) {
        uniqueSkills.push(skill);
      }
    }
  }


  useEffect(() => {
    const loadFreelancers = async () => {
      setLoading(true);
      try {
        const data = await fetchFreelancers();
        setFreelancers(data.data);
        setFilteredFreelancers(data.data);
      } catch (error) {
        console.error('Error loading freelancers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFreelancers();
  }, []);

  const applyFilters = () => {
    let filtered = [...freelancers];

    if (searchTerm) {
      filtered = filtered.filter(freelancer =>
        freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.skills.some(skill =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filters.location) {
      filtered = filtered.filter(freelancer =>
        freelancer.location === filters.location
      );
    }

    filtered = filtered.filter(freelancer => {
      const rate = parseFloat(freelancer.hourlyRate.replace(/[^\d.]/g, ''));
      return rate >= filters.minRate && rate <= filters.maxRate;
    });

    if (filters.selectedSkills.length > 0) {
      filtered = filtered.filter(freelancer =>
        filters.selectedSkills.some(skill =>
          freelancer.skills.includes(skill)
        )
      );
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter(freelancer =>
        freelancer.rating >= filters.minRating
      );
    }

    setFilteredFreelancers(filtered);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      minRate: 0,
      maxRate: 200,
      selectedSkills: [],
      minRating: 0,
    });
    setFilteredFreelancers(freelancers);
  };

  const toggleSkill = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter(s => s !== skill)
        : [...prev.selectedSkills, skill]
    }));
  };

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
                <Button onClick={applyFilters}>
                  <Search className="w-4 h-4 mr-2" />
                  {t('Search')}
                </Button>
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Bộ lọc</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Địa điểm</h3>
                        <Select
                          value={filters.location}
                          onValueChange={(value) =>
                            setFilters(prev => ({ ...prev, location: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn địa điểm" />
                          </SelectTrigger>
                          <SelectContent>
                            {uniqueLocations.map(location => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Giá theo giờ (USD)</h3>
                        <div className="flex items-center gap-4">
                          <Input
                            type="number"
                            value={filters.minRate}
                            onChange={(e) => setFilters(prev => ({
                              ...prev,
                              minRate: parseInt(e.target.value)
                            }))}
                            className="w-20"
                          />
                          <span>-</span>
                          <Input
                            type="number"
                            value={filters.maxRate}
                            onChange={(e) => setFilters(prev => ({
                              ...prev,
                              maxRate: parseInt(e.target.value)
                            }))}
                            className="w-20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Đánh giá tối thiểu</h3>
                        <Select
                          value={filters.minRating.toString()}
                          onValueChange={(value) =>
                            setFilters(prev => ({ ...prev, minRating: parseInt(value) }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn đánh giá" />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map(rating => (
                              <SelectItem key={rating} value={rating.toString()}>
                                {rating} {rating > 0 && <Star className="inline w-4 h-4" />}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Kỹ năng</h3>
                        <div className="flex flex-wrap gap-2">
                          {uniqueSkills.map(skill => (
                            <Badge
                              key={skill}
                              variant={filters.selectedSkills.includes(skill) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => toggleSkill(skill)}
                            >
                              {skill}
                              {filters.selectedSkills.includes(skill) && (
                                <X className="w-3 h-3 ml-1" />
                              )}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button onClick={applyFilters} className="flex-1">
                          Áp dụng
                        </Button>
                        <Button variant="outline" onClick={resetFilters}>
                          Đặt lại
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : filteredFreelancers.length === 0 ? (
            <div className="text-center text-gray-500">{t('No Freelancers Available')}</div>
          ) : (
            filteredFreelancers.map((freelancer, index) => (
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