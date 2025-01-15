import { DataTable } from "@/components/admin/data-table/data-table";
import { freelancerColumns } from "@/components/admin/data-table/columns";

const data = [
  {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    skills: "React, Node.js",
    status: "Hoạt động",
  },
];

export default function FreelancersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Freelancer</h2>
      </div>
      <DataTable columns={freelancerColumns} data={data} />
    </div>
  );
}