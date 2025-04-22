import { DataTable } from "@/components/admin/data-table/data-table";
import { accountColumns } from "@/components/admin/data-table/columns";
import { useEffect, useState } from "react";
import api from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type StatusAccount = 'Xác thực' | 'Chưa xác thực' | 'Khóa';

interface Account {
  id: number;
  email: string;
  role: string;
  status: StatusAccount;
  createdAt: string;
  updatedAt: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    type: "ban" | "unban";
    email: string;
  } | null>(null);
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
        console.error("Error fetching accounts:", err);
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
            account.email === email ? { ...account, status: 'Khóa' } : account
          )
        );
      }
    } catch (err) {
      console.error("Error banning account:", err);
    }
  };

  const handleUnban = async (email: string) => {
    try {
      const response = await api.post(`/v1/account/admin/unban?email=${email}`);
      if (response.status === 200) {
        setAccounts((prevAccounts) =>
          prevAccounts.map((account) =>
            account.email === email ? { ...account, status: 'Xác thực' } : account
          )
        );
      } 
    } catch (err) {
      console.error("Error unbanning account:", err);
    }
  };

  const handleConfirm = async () => {
    if (!selectedAction) return;

    if (selectedAction.type === "ban") {
      await handleBan(selectedAction.email);
    } else {
      await handleUnban(selectedAction.email);
    }
    setShowConfirmDialog(false);
    setSelectedAction(null);
  };

  const filteredAccounts = accounts.filter(account => {
    const emailMatch = account.email.toLowerCase().includes(filters.email.toLowerCase());
    const roleMatch = filters.role === "all" || account.role === filters.role;
    const statusMatch = filters.status === "all" || account.status === filters.status;
    
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
            <SelectItem value="Xác thực">Xác thực</SelectItem>
            <SelectItem value="Chưa xác thực">Chưa xác thực</SelectItem>
            <SelectItem value="Khóa">Khóa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedAction?.type === "ban"
                ? "Bạn có chắc chắn muốn khóa tài khoản này?"
                : "Bạn có chắc chắn muốn mở khóa tài khoản này?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {selectedAction?.type === "ban" ? "Khóa" : "Mở khóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <DataTable
          columns={[
            ...accountColumns,
            {
              id: "actions",
              header: "Thao tác",
              cell: ({ row }) => {
                const email = row.getValue("email");
                const status = row.getValue("status") as StatusAccount;
                const isLocked = status === 'Khóa';
                
                return (
                  <div className="flex space-x-2">
                    {isLocked ? (
                      <Button
                        onClick={() => {
                          setSelectedAction({ type: "unban", email: email as string });
                          setShowConfirmDialog(true);
                        }}
                        variant="outline"
                        className="text-green-600"
                      >
                        Mở khóa
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setSelectedAction({ type: "ban", email: email as string });
                          setShowConfirmDialog(true);
                        }}
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
          ]}
          data={filteredAccounts}
        />
      )}
    </div>
  );
}