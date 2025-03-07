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


// Post columnsconst 
export const  postColumns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: "Tiêu đề",
    },
    {
      accessorKey: "categoryName",
      header: "Danh mục",
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
    },
    {
      accessorKey: "clientEmail",
      header: "Email khách hàng",
    },
    {
      accessorKey: "quantity",
      header: "Số lượng",
    },
    {
      accessorKey: "appliedQuantity",
      header: "Đã ứng tuyển",
    },
    {
      accessorKey: "cancelledQuantity",
      header: "Đã hủy",
    },
    {
      accessorKey: "inProgressQuantity",
      header: "Đang tiến hành",
    },
    {
      accessorKey: "viewedQuantity",
      header: "Đã xem",
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
  export const accountColumns = [
    {
      id: "email", 
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "role", 
      accessorKey: "role",
      header: "Role",
    },
    {
      id: "status", 
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (row.getValue("status") ? "Active" : "Inactive"),
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleString(),
    },
    {
      id: "updatedAt", // Add an id here for the updatedAt column
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => new Date(row.getValue("updatedAt")).toLocaleString(),
    },
   
  ];
  
  
export const bannerColumns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "Mã",
  },
  {
    accessorKey: "title",
    header: "Tiêu đề",
  },
  {
    accessorKey: "image",
    header: "Hình ảnh",
    cell: ({ row }) => {
      return (
        <div className="relative h-20 w-40">
          <img
            src={row.original.image}
            alt={row.original.title}
            className="absolute inset-0 h-full w-full object-cover rounded-md"
          />
        </div>
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