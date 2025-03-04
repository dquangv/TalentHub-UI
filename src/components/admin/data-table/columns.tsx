import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Freelancer columns
export const freelancerColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Họ và tên",
  },
  {
    accessorKey: "categoryName",
    header: "Danh mục công việc",
  },
  {
    accessorKey: "hourlyRate",
    header: "Giá theo giờ",
    cell: ({ row }) => row.getValue("hourlyRate") ? `${row.getValue("hourlyRate")} USD` : "Chưa có",
  },
  {
    accessorKey: "rating",
    header: "Đánh giá",
    cell: ({ row }) => row.getValue("rating") ? row.getValue("rating").toFixed(1) : "Chưa có",
  },
  {
    accessorKey: "skills",
    header: "Kỹ năng",
    cell: ({ row }) => row.getValue("skills").length > 0 ? row.getValue("skills").join(", ") : "Chưa có",
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => row.getValue("description") || "Chưa có mô tả",
  },
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => (
      row.getValue("avatar") ? (
        <img src={`${row.getValue("avatar")}`} alt={row.getValue("name")} className="w-10 h-10 rounded-full" />
      ) : (
        "Chưa có ảnh"
      )
    ),
  },
  {
    header: "Hành động",
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
            <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Vô hiệu hóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];


// Employer columns
export const employerColumns: ColumnDef<any>[] = [
  {
    accessorKey: "id", 
    header: "ID",  
  },
  {
    accessorKey: "fromPrice", 
    header: "Giá từ",
    cell: ({ row }) => row.getValue("fromPrice") ? `${row.getValue("fromPrice")} VNĐ` : "Chưa có",  // Format as currency if needed
  },
  {
    accessorKey: "toPrice", 
    header: "Giá đến",
    cell: ({ row }) => row.getValue("toPrice") ? `${row.getValue("toPrice")} VNĐ` : "Chưa có",  // Format as currency if needed
  },
  {
    accessorKey: "typePrice", 
    header: "Loại tiền",
  },
  {
    accessorKey: "jobsCount", 
    header: "Công việc đã đăng",
  },
  {
    accessorKey: "appointmentsCount", 
    header: "Số lượng cuộc hẹn",
  },
  {
    accessorKey: "email", 
    header: "Email",
  },
  {
    accessorKey: "address", 
    header: "Địa chỉ",
  },
  {
    accessorKey: "image", 
    header: "Ảnh đại diện",
    cell: ({ row }) => (
      row.getValue("image") ? (
        <img src={`${row.getValue("image")}`} alt="Avatar" className="w-10 h-10 rounded-full" />
      ) : (
        "Chưa có ảnh"
      )
    ),
  },
  {
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
            <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Vô hiệu hóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];


// Post columns
export const postColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Tiêu đề",
  },
  {
    accessorKey: "author",
    header: "Tác giả",
  },
  {
    accessorKey: "category",
    header: "Danh mục",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
  },
  {
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
            <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];