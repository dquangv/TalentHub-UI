import { DataTable } from "@/components/admin/data-table/data-table";
import { accountColumns } from "@/components/admin/data-table/columns";
import { useEffect, useState } from "react";
import api from "@/api/axiosConfig";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component to use

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Tài khoản</h2>
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
          data={accounts}
        />
      )}
    </div>
  );
}
