import { DataTable } from "@/components/admin/data-table/data-table";
import { postColumns } from "@/components/admin/data-table/columns";
import { useEffect, useState } from "react";
import api from "@/api/axiosConfig";
import { Button } from "antd";

export default function PostsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  async function fetchJobs() {
    const response = await api.get("/v1/jobs/admin");
    console.log("response ", response.data)
    if (response.status === 200) {
      
      setJobs(response.data);
    }
  }
  useEffect(() => {
  

    fetchJobs();
  }, []);
  
  const handleBan = async (jobId) => {
    try {
      await api.post(`/v1/jobs/admin/ban?jobId=${jobId}`);
      fetchJobs()
    } catch (error) {
    }
  };

  const handleUnban = async (jobId) => {
    try {
      await api.post(`/v1/jobs/admin/unban?jobId=${jobId}`);
      fetchJobs()
    } catch (error) {
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Bài viết</h2>
      </div>
      <DataTable  columns={[
            ...postColumns,
            {
              id: "actions",
              header: "Actions",
              cell: ({ row }) => {
                const id = row.getValue("id");
                const isBanned = (row.getValue("status") == "Bị cấm");
                return (
                  <div className="flex space-x-2">
                    {isBanned ? (
                      <Button
                        onClick={() => handleUnban(id)}
                        variant="outline"
                        className="text-green-600"
                      >
                        Mở khóa
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleBan(id)}
                        variant="outline"
                        className="text-red-600"
                      >
                        Khóa
                      </Button>
                    )}
                  </div>
                );
              },
            },
          ]} data={jobs}/>
    </div>
  );
}