import { DataTable } from "@/components/admin/data-table/data-table";
import { postColumns } from "@/components/admin/data-table/columns";

const data = [
  {
    title: "Cách tìm việc freelance hiệu quả",
    author: "Admin",
    category: "Hướng dẫn",
    status: "Đã đăng",
  },
];

export default function PostsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Bài viết</h2>
      </div>
      <DataTable columns={postColumns} data={data} />
    </div>
  );
}