import { DataTable } from "@/components/admin/data-table/data-table";
import { employerColumns } from "@/components/admin/data-table/columns";
import { useEffect, useState } from "react";
import api from "@/api/axiosConfig";


export default function EmployersPage() {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFreelancers() {
      const response = await api.get("/v1/clients");
      console.log("response ", response.data)
      if (response.status === 200) {
        
        setClients(response.data);
      }
    }

    fetchFreelancers();
  }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Nhà tuyển dụng</h2>
      </div>
      <DataTable columns={employerColumns} data={clients} />
    </div>
  );
}