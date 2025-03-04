import { DataTable } from "@/components/admin/data-table/data-table";
import { postColumns } from "@/components/admin/data-table/columns";
import { useEffect, useState } from "react";
import api from "@/api/axiosConfig";

export default function PostsPage() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchJobs() {
      const response = await api.get("/v1/jobs/admin");
      console.log("response ", response.data)
      if (response.status === 200) {
        
        setJobs(response.data);
      }
    }

    fetchJobs();
  }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Bài viết</h2>
      </div>
      <DataTable columns={postColumns} data={jobs} />
    </div>
  );
}