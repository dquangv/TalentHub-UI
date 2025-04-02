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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const freelancerColumns = [
  {
    accessorKey: "name",
    header: "Họ và tên",
    cell: ({ row }) => {
      const name = row.getValue("name");
      return (
        <div className="flex items-center gap-3">
          <Avatar
            src={row.original.avatar || undefined}
            alt={name}
            className="w-10 h-10"
          >
            <AvatarFallback className="bg-primary/10 text-primary text-[10px] md:text-xs">
              {name?.slice(0, 2).toUpperCase() || "UN"}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Gmail",
  },
  {
    accessorKey: "categoryName",
    header: "Lĩnh vực",
  },
  // {
  //   accessorKey: "hourlyRate",
  //   header: "Giá theo giờ",
  //   cell: ({ row }) => row.getValue("hourlyRate") ? `${row.getValue("hourlyRate").toLocaleString()} USD` : "Chưa có",
  // },
  {
    accessorKey: "rating",
    header: "Đánh giá",
    cell: ({ row }) => row.getValue("rating") ? row.getValue("rating").toFixed(1) : "Chưa có",
  },
  // {
  //   accessorKey: "skills",
  //   header: "Kỹ năng",
  //   cell: ({ row }) => {
  //     const skills = row.getValue("skills");
  //     return Array.isArray(skills) && skills.length > 0 ? skills.join(", ") : "Chưa có";
  //   },
  // },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => row.getValue("description") || "Chưa có mô tả",
  },
  {
    id: "actions",
    header: "Thao tác",
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


export const employerColumns = [
  {
    accessorKey: "name",
    header: "Họ và tên",
    accessorFn: (row) => `${row.lastName} ${row.firstName}`,
    cell: ({ row }) => {
      const fullName = `${row.original.lastName} ${row.original.firstName}`;
      return (
        <div className="flex items-center gap-3">
          <Avatar
            src={row.original.image || undefined}
            alt={fullName}
            className="w-10 h-10"
          >
            <AvatarFallback className="bg-primary/10 text-primary text-[10px] md:text-xs">
              {`${row.original.lastName?.[0] || ""}${row.original.firstName?.[0] || ""}`}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{fullName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "fromPrice",
    header: "Giá từ",
    cell: ({ row }) => row.getValue("fromPrice") ? `${row.getValue("fromPrice").toLocaleString()} ${row.original.typePrice}` : "Chưa có",
  },
  {
    accessorKey: "toPrice",
    header: "Giá đến",
    cell: ({ row }) => row.getValue("toPrice") ? `${row.getValue("toPrice").toLocaleString()} ${row.original.typePrice}` : "Chưa có",
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
    accessorFn: (row) => `${row.province}, ${row.country}`,
    cell: ({ row }) => `${row.original.province}, ${row.original.country}`,
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
export const postColumns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "Mã",
  },
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
  // {
  //   accessorKey: "quantity",
  //   header: "Số lượng",
  // },
  {
    accessorKey: "appliedQuantity",
    header: "Đã ứng tuyển",
  },
  {
    accessorKey: "cancelledQuantity",
    header: "Đã hủy",
  },
  // {
  //   accessorKey: "inProgressQuantity",
  //   header: "Đang tiến hành",
  // },
  {
    accessorKey: "viewedQuantity",
    header: "Đã xem",
  }

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
    cell: ({ row }) => (row.getValue("status") ? "Đang hoạt động" : "Đã khóa"),
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
    accessorKey: "vendor",
    header: "Nhà cung cấp",
  },
  {
    accessorKey: "price",
    header: "Giá",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return price.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return status ? "Đang hiển thị" : "Đã ẩn";
    },
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
  {
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => {
      return (
        <div className="relative h-16 w-16">
          <img
            src={row.original.logo}
            alt={`${row.original.title} logo`}
            className="absolute inset-0 h-full w-full object-contain rounded-md"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: "Ngày bắt đầu",
    cell: ({ row }) => {
      const date = new Date(row.getValue("startTime"));
      return date.toLocaleDateString("vi-VN");
    },
  },
  {
    accessorKey: "endTime",
    header: "Ngày kết thúc",
    cell: ({ row }) => {
      const date = new Date(row.getValue("endTime"));
      return date.toLocaleDateString("vi-VN");
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


export const schoolColumns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "schoolName",
    header: "Tên Trường",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <span className={row.original.status === "ACTIVE" ? "text-green-600" : "text-red-600"}>
        {row.original.status === "ACTIVE" ? "Hoạt động" : "Ngừng hoạt động"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => (
      <Button variant="outline" size="sm" onClick={() => row.original.onAction(row.original)}>
        Chỉnh sửa
      </Button>
    ),
  },
];