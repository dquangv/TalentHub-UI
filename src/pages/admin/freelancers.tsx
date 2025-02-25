import { DataTable } from "@/components/admin/data-table/data-table";
import { freelancerColumns } from "@/components/admin/data-table/columns";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosConfig";

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFreelancers() {
      const response = await axiosInstance.get("/freelancers/info");
      if (response.data.status === 200) {
        setFreelancers(response.data.data);

      }
      
      const mappedData = data.data.map((freelancer: any) => ({
        name: freelancer.name,
        title:  freelancer.title,
        skills: freelancer.skills.join(", "),
        rating: freelancer.rating,
        location: freelancer.location,
      }));
      
      setFreelancers(mappedData);
    }

    fetchFreelancers();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Freelancer</h2>
      </div>
      <DataTable columns={freelancerColumns} data={freelancers} />
    </div>
  );
}