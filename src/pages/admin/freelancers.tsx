import { DataTable } from "@/components/admin/data-table/data-table";
import { freelancerColumns } from "@/components/admin/data-table/columns";
import { useEffect, useState } from "react";
import api from "@/api/axiosConfig";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Freelancer {
  id: number;
  name: string;
  hourlyRate: number;
  description: string;
  categoryName: string;
  userId: number;
  avatar: string;
  rating: number | null;
  skills: string[];
}

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    priceRange: "all"
  });

  useEffect(() => {
    async function fetchFreelancers() {
      setLoading(true);
      try {
        const response = await api.get("/v1/freelancers/admin");
        if (response.status === 200) {
          setFreelancers(response.data || []);
        }
      } catch (err) {
        console.error("Error fetching freelancers:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFreelancers();
  }, []);

  const getPriceRange = (hourlyRate: number) => {
    if (hourlyRate < 50) return "low";
    if (hourlyRate < 80) return "medium";
    return "high";
  };

  const filteredFreelancers = freelancers?.filter(freelancer => {
    const searchTerm = filters.search.toLowerCase();
    const searchMatch =
      (freelancer.name?.toLowerCase() || '').includes(searchTerm) ||
      (freelancer.description?.toLowerCase() || '').includes(searchTerm) ||
      (Array.isArray(freelancer.skills) && freelancer.skills.some(skill =>
        (skill?.toLowerCase() || '').includes(searchTerm)
      ));

    const categoryMatch = filters.category === "all" || freelancer.categoryName === filters.category;

    const priceRangeMatch = filters.priceRange === "all" ||
      getPriceRange(freelancer.hourlyRate) === filters.priceRange;

    return searchMatch && categoryMatch && priceRangeMatch;
  });

  const uniqueCategories = Array.from(new Set(freelancers?.map(f => f.categoryName)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Freelancer</h2>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm theo tên, mô tả hoặc kỹ năng..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="max-w-sm"
          />
        </div>
        <Select
          value={filters.category}
          onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Lọc theo danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả lĩnh vực</SelectItem>
            {uniqueCategories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.priceRange}
          onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc theo giá" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả mức giá</SelectItem>
            <SelectItem value="low">Dưới $50/giờ</SelectItem>
            <SelectItem value="medium">$50 - $80/giờ</SelectItem>
            <SelectItem value="high">Trên $80/giờ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <DataTable
          columns={freelancerColumns}
          data={filteredFreelancers}
        />
      )}
    </div>
  );
}