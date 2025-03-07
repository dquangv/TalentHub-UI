import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Freelancer columns
export const freelancerColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Họ và tên",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "skills",
    header: "Kỹ năng",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
  },
  {
    header:"Hành động",
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
    accessorKey: "companyName",
    header: "Tên công ty",
  },
  {
    accessorKey: "contactPerson",
    header: "Người liên hệ",
  },
  {
    accessorKey: "email",
    header: "Email",
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


export const reportColumns: ColumnDef<any>[] = [
  {
    accessorKey: "reporterName",
    header: "Người tố cáo",
  },
  {
    accessorKey: "reason",
    header: "Lý do",
  },
  {
    accessorKey: "reportedAt",
    header: "Thời gian",
    cell: ({ row }) => {
      return new Date(row.original.reportedAt).toLocaleString("vi-VN");
    },
  },
  {
    accessorKey: "jobTitle",
    header: "Bài đăng",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === "banned"
              ? "destructive"
              : status === "ignored"
              ? "secondary"
              : "default"
          }
        >
          {status === "banned"
            ? "Đã cấm"
            : status === "ignored"
            ? "Đã bỏ qua"
            : "Chưa xử lý"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "adminReason",
    header: "Lý do xử lý",
  },
  {
    accessorKey: "processedAt",
    header: "Thời gian xử lý",
    cell: ({ row }) => {
      const processedAt = row.original.processedAt;
      return processedAt ? new Date(processedAt).toLocaleString("vi-VN") : "-";
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => table.options.meta?.onAction?.(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },
];