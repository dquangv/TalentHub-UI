import { DataTable } from "@/components/admin/data-table/data-table";
import { employerColumns } from "@/components/admin/data-table/columns";
import { useEffect, useState } from "react";
import api from "@/api/axiosConfig";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EmployersPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchFreelancers() {
      const response = await api.get("/v1/clients");
      console.log("response ", response.data);
      if (response.status === 200) {
        setClients(response.data);
        setFilteredClients(response.data);
      }
    }

    fetchFreelancers();
  }, []);

  useEffect(() => {
    const filtered = clients.filter((client) => {
      const search = searchTerm.toLowerCase();

      return (
        (client.name?.toLowerCase().includes(search) ?? false) ||
        (client.email?.toLowerCase().includes(search) ?? false) ||
        (client.company?.toLowerCase().includes(search) ?? false) ||
        (client.phone?.toLowerCase().includes(search) ?? false) ||
        (client.address?.toLowerCase().includes(search) ?? false) ||
        (client.website?.toLowerCase().includes(search) ?? false) ||
        (client.status?.toLowerCase().includes(search) ?? false) ||
        (client.id?.toString().includes(search) ?? false) ||
        (client.description?.toLowerCase().includes(search) ?? false) ||
        (client.industry?.toLowerCase().includes(search) ?? false) ||
        (client.location?.toLowerCase().includes(search) ?? false)
      );
    });
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const resetFilter = () => {
    setSearchTerm("");
    setFilteredClients(clients);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Nhà tuyển dụng</h2>
      </div>
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Tìm kiếm (tên, email, công ty, số điện thoại...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button
          variant="outline"
          onClick={resetFilter}
          disabled={!searchTerm}
        >
          Xóa bộ lọc
        </Button>
      </div>
      <DataTable columns={employerColumns} data={filteredClients} />
    </div>
  );
}