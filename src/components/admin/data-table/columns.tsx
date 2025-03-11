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
import { formatCurrency } from "@/lib/utils";

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
      header: "Quyền",
    },
    {
      id: "status", 
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (row.getValue("status") ? "Active" : "Inactive"),
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleString(),
    },
    {
      id: "updatedAt", 
      accessorKey: "updatedAt",
      header: "Ngày sửa",
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
    accessorKey: "id",
    header: "Mã",
  },
  {
    accessorKey: "fullName",
    header: "Người tố cáo",
  },
  {
    accessorKey: "jobTitle",
    header: "Tiêu đề công việc",
    cell: ({ row }) => {
      const job = row.original.job;
      return (
        <div className="space-y-1">
          <div className="font-medium">{job.title}</div>
          <div className="text-sm text-muted-foreground">
            {formatCurrency(job.fromPrice)} - {formatCurrency(job.toPrice)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "reasonFreelancer",
    header: "Lý do tố cáo",
    cell: ({ row }) => row.original.reasonFreelancer || "-",
  },
  {
    accessorKey: "description",
    header: "Mô tả chi tiết",
    cell: ({ row }) => row.original.description || "-",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "success" | "warning" = "default";
      let label = "Đã báo cáo";

      switch (status) {
        case "RESOLVED":
          variant = "success";
          label = "Đã giải quyết";
          break;
        case "IN_PROGRESS":
          variant = "warning";
          label = "Đang xử lý";
          break;
        default:
          variant = "default";
          label = "Đã báo cáo";
      }

      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    accessorKey: "reasonAdmin",
    header: "Lý do xử lý",
    cell: ({ row }) => row.original.reasonAdmin || "-",
  },
  {
    accessorKey: "createdAt",
    header: "Thời gian tố cáo",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleString("vi-VN");
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Thời gian xử lý",
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      return updatedAt ? new Date(updatedAt).toLocaleString("vi-VN") : "-";
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