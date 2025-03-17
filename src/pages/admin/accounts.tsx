import { DataTable } from "@/components/admin/data-table/data-table";
import { accountColumns } from "@/components/admin/data-table/columns";
import { useEffect, useState } from "react";
import api from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Account {
  id: number;
  email: string;
  role: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    email: "",
    role: "all",
    status: "all",
  });

  useEffect(() => {
    async function fetchAccounts() {
      setLoading(true);
      try {
        const response = await api.get("/v1/account/admin");
        if (response.status === 200) {
          setAccounts(response.data);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, []);

  const handleBan = async (email: string) => {
    try {
      const response = await api.post(`/v1/account/admin/ban?email=${email}`);
      if (response.status === 200) {
        setAccounts((prevAccounts) =>
          prevAccounts.map((account) =>
            account.email === email ? { ...account, status: false } : account
          )
        );
      }
    } catch (err) {}
  };

  const handleUnban = async (email: string) => {
    try {
      const response = await api.post(`/v1/account/admin/unban?email=${email}`);
      if (response.status === 200) {
        setAccounts((prevAccounts) =>
          prevAccounts.map((account) =>
            account.email === email ? { ...account, status: true } : account
          )
        );
      } 
    } catch (err) {}
  };

  const filteredAccounts = accounts.filter(account => {
    const emailMatch = account.email.toLowerCase().includes(filters.email.toLowerCase());
    const roleMatch = filters.role === "all" || account.role === filters.role;
    const statusMatch = filters.status === "all" || 
      (filters.status === "active" && account.status) ||
      (filters.status === "banned" && !account.status);
    
    return emailMatch && roleMatch && statusMatch;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Tài khoản</h2>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm theo email..."
            value={filters.email}
            onChange={(e) => setFilters(prev => ({ ...prev, email: e.target.value }))}
            className="max-w-sm"
          />
        </div>
        <Select
          value={filters.role}
          onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="FREELANCER">Freelancer</SelectItem>
            <SelectItem value="CLIENT">Client</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="banned">Đã khóa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <DataTable
          columns={[
            ...accountColumns,
            {
              id: "actions",
              header: "Actions",
              cell: ({ row }) => {
                const email = row.getValue("email");
                const isBanned = !row.getValue("status");
                return (
                  <div className="flex space-x-2">
                    {isBanned ? (
                      <Button
                        onClick={() => handleUnban(email)}
                        variant="outline"
                        className="text-green-600"
                      >
                        Unban
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleBan(email)}
                        variant="outline"
                        className="text-red-600"
                      >
                        Ban
                      </Button>
                    )}
                  </div>
                );
              },
            },
          ]}
          data={filteredAccounts}
        />
      )}
    </div>
  );
}