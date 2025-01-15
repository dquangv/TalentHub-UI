import { DataTable } from "@/components/admin/data-table/data-table";
import { employerColumns } from "@/components/admin/data-table/columns";

const data = [
  {
    companyName: "Công ty ABC",
    contactPerson: "Trần Văn B",
    email: "contact@abc.com",
    status: "Đang hoạt động",
  },
];

export default function EmployersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Nhà tuyển dụng</h2>
      </div>
      <DataTable columns={employerColumns} data={data} />
    </div>
  );
}