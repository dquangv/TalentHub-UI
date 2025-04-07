import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Loader2, Link as LinkIcon, Clock } from "lucide-react";
import api from "@/api/axiosConfig";
import { notification } from "antd";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AppointmentData {
    id: number;
    clientId: number;
    freelancerJobId: number;
    topic: string;
    description: string;
    startTime: string;
    duration: number;
    link: string;
    name?: string;
    mail?: string;
    phone?: string;
    jobId?: number;
    jobTitle?: string;
}

interface EditAppointmentDialogProps {
    appointment: AppointmentData;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (updatedAppointment: AppointmentData) => void;
}

const formatDateForVietnamese = (date) => {
    if (!date || isNaN(date.getTime())) {
        console.error("Invalid date provided to formatDateForVietnamese:", date);
        return "";
    }

    try {
        const weekdays = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
        const weekday = weekdays[date.getDay()];

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${weekday}, ${day}/${month}/${year}`;
    } catch (error) {
        console.error("Error formatting date:", error, date);
        return "";
    }
};

const CustomDatePicker = ({ value, onChange, hasError }) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef(null);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };

        if (showCalendar) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCalendar]);

    const getDaysInMonth = (year, month) => {
        const date = new Date(year, month, 1);
        const days = [];
        const firstDay = new Date(year, month, 1).getDay();

        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        return days;
    };

    const [currentMonth, setCurrentMonth] = useState(value ? value.getMonth() : new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(value ? value.getFullYear() : new Date().getFullYear());

    useEffect(() => {
        if (value && !isNaN(value.getTime())) {
            setCurrentMonth(value.getMonth());
            setCurrentYear(value.getFullYear());
        }
    }, [value]);

    const days = getDaysInMonth(currentYear, currentMonth);

    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const getMonthName = (month) => {
        const monthNames = [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ];
        return monthNames[month];
    };

    const isToday = (day) => {
        if (!day) return false;
        const today = new Date();
        return day.getDate() === today.getDate() &&
            day.getMonth() === today.getMonth() &&
            day.getFullYear() === today.getFullYear();
    };

    const isSelected = (day) => {
        if (!day || !value || isNaN(value.getTime())) return false;
        return day.getDate() === value.getDate() &&
            day.getMonth() === value.getMonth() &&
            day.getFullYear() === value.getFullYear();
    };

    const isDisabled = (day) => {
        if (!day) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return day < today;
    };

    const handleSelectDay = (day) => {
        if (!day || isDisabled(day)) return;

        let newDate = new Date(day);

        if (value && !isNaN(value.getTime())) {
            newDate.setHours(value.getHours(), value.getMinutes(), 0, 0);
        } else {
            newDate.setHours(8, 0, 0, 0);
        }

        onChange(newDate);
        setShowCalendar(false);
    };

    return (
        <div className="relative w-full" ref={calendarRef}>
            <button
                type="button"
                className={cn(
                    "w-full px-4 py-2 flex items-center justify-between border rounded-md text-left",
                    hasError ? "border-red-500" : "border-gray-300",
                    "hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
                onClick={() => setShowCalendar(!showCalendar)}
            >
                <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                    {value && !isNaN(value.getTime()) ? (
                        <span>{formatDateForVietnamese(value)}</span>
                    ) : (
                        <span className={hasError ? "text-red-500" : "text-gray-500"}>
                            Chọn ngày
                        </span>
                    )}
                </div>
                <div className="flex-shrink-0">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </button>

            {showCalendar && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                        <button
                            type="button"
                            className="p-1 hover:bg-gray-100 rounded-full"
                            onClick={goToPreviousMonth}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <div className="font-medium">
                            {getMonthName(currentMonth)} {currentYear}
                        </div>
                        <button
                            type="button"
                            className="p-1 hover:bg-gray-100 rounded-full"
                            onClick={goToNextMonth}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 mb-1">
                        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
                            <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, index) => (
                            <button
                                key={index}
                                type="button"
                                disabled={!day || isDisabled(day)}
                                className={cn(
                                    "h-8 w-full flex items-center justify-center rounded",
                                    !day ? "text-gray-300" : "text-gray-700",
                                    isDisabled(day) && day ? "text-gray-300 cursor-not-allowed" : "",
                                    isToday(day) ? "border border-blue-300" : "",
                                    isSelected(day) ? "bg-blue-500 text-white hover:bg-blue-600" : "hover:bg-blue-100",
                                    "focus:outline-none transition-colors"
                                )}
                                onClick={() => handleSelectDay(day)}
                            >
                                {day ? day.getDate() : ""}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


const EditAppointmentDialog = ({
    appointment,
    open,
    onOpenChange,
    onSuccess
}: EditAppointmentDialogProps) => {
    const [loading, setLoading] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [form, setForm] = useState({
        topic: "",
        description: "",
        startTime: null as Date | null,
        duration: "",
        link: "",
    });

    // Load appointment data when dialog opens
    useEffect(() => {
        if (appointment && open) {
            try {
                let startTimeDate = null;

                if (appointment.startTime) {
                    startTimeDate = new Date(appointment.startTime);

                    if (isNaN(startTimeDate.getTime())) {
                        console.error("Invalid date:", appointment.startTime);
                        startTimeDate = new Date();
                    }

                    console.log("Original startTime:", appointment.startTime);
                    console.log("Parsed startTime:", startTimeDate);
                    console.log("Hours:", startTimeDate.getHours(), "Minutes:", startTimeDate.getMinutes());
                }

                setForm({
                    topic: appointment.topic || "",
                    description: appointment.description || "",
                    startTime: startTimeDate,
                    duration: appointment.duration?.toString() || "30",
                    link: appointment.link || "",
                });
                setDateError(false);

            } catch (error) {
                console.error("Error setting appointment data:", error);
                setForm({
                    topic: appointment.topic || "",
                    description: appointment.description || "",
                    startTime: new Date(),
                    duration: "30",
                    link: "",
                });
            }
        }
    }, [appointment, open]);

    // Handle form changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle date change
    const handleDateChange = (date: Date | null) => {
        if (!date) {
            setDateError(true);
            return;
        }

        // Preserve the current time when changing the date
        if (form.startTime) {
            date.setHours(
                form.startTime.getHours(),
                form.startTime.getMinutes(),
                0,
                0
            );
        }

        setDateError(false);
        setForm((prev) => ({
            ...prev,
            startTime: date,
        }));
        console.log("Date selected:", date);
    };

    // Time selector component
    const CustomTimeSelector = () => {
        // Get current hours and minutes
        const hours = form.startTime ? form.startTime.getHours() : 8;
        const minutes = form.startTime ? form.startTime.getMinutes() : 0;

        // Create options for hours (0-23)
        const hourOptions = Array.from({ length: 24 }, (_, i) => i);

        // Create options for minutes (0, 5, 10, 15, etc)
        const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5);
        // Add current minute if not in list
        if (!minuteOptions.includes(minutes) && minutes > 0) {
            const sortedOptions = [...minuteOptions, minutes].sort((a, b) => a - b);
            // Use the sorted options only if the custom minute isn't already in the list
            if (!minuteOptions.includes(minutes)) {
                minuteOptions.length = 0;
                minuteOptions.push(...sortedOptions);
            }
        }

        // Handle hour change
        const handleHourChange = (e) => {
            const newHour = parseInt(e.target.value, 10);
            if (!form.startTime) {
                const newDate = new Date();
                newDate.setHours(newHour, minutes, 0, 0);
                setForm(prev => ({
                    ...prev,
                    startTime: newDate
                }));
                setDateError(false);
                return;
            }

            const newDate = new Date(form.startTime);
            newDate.setHours(newHour);

            setForm(prev => ({
                ...prev,
                startTime: newDate
            }));
            console.log("Changed hour to:", newHour, "New date:", newDate);
        };

        // Handle minute change
        const handleMinuteChange = (e) => {
            const newMinute = parseInt(e.target.value, 10);
            if (!form.startTime) {
                const newDate = new Date();
                newDate.setHours(hours, newMinute, 0, 0);
                setForm(prev => ({
                    ...prev,
                    startTime: newDate
                }));
                setDateError(false);
                return;
            }

            const newDate = new Date(form.startTime);
            newDate.setMinutes(newMinute);

            setForm(prev => ({
                ...prev,
                startTime: newDate
            }));
            console.log("Changed minute to:", newMinute, "New date:", newDate);
        };

        return (
            <div className="flex space-x-2 items-center">
                <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                </div>

                <select
                    value={hours}
                    onChange={handleHourChange}
                    className="rounded border border-gray-300 p-2"
                >
                    {hourOptions.map(h => (
                        <option key={`hour-${h}`} value={h}>
                            {h.toString().padStart(2, '0')}
                        </option>
                    ))}
                </select>

                <span className="text-gray-500">:</span>

                <select
                    value={minutes}
                    onChange={handleMinuteChange}
                    className="rounded border border-gray-300 p-2"
                >
                    {minuteOptions.map(m => (
                        <option key={`minute-${m}`} value={m}>
                            {m.toString().padStart(2, '0')}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if date is selected
        if (!form.startTime) {
            setDateError(true);
            notification.error({
                message: 'Thiếu thông tin',
                description: 'Vui lòng chọn ngày và giờ cho lịch hẹn',
                placement: 'topRight'
            });
            return;
        }

        setLoading(true);

        try {
            // Make sure startTime is a valid Date
            if (!form.startTime || isNaN(form.startTime.getTime())) {
                throw new Error("Invalid date");
            }

            // Log the exact time before submitting
            console.log("Submit time:",
                form.startTime.getHours().toString().padStart(2, "0") + ":" +
                form.startTime.getMinutes().toString().padStart(2, "0")
            );

            const data = {
                ...form,
                clientId: appointment.clientId,
                freelancerJobId: appointment.freelancerJobId,
                startTime: form.startTime.toISOString(), // Convert to ISO format
                duration: parseInt(form.duration, 10),
            };

            console.log("Submitting appointment data:", data);

            const response = await api.put(`/v1/appointments/${appointment.id}`, data);

            notification.success({
                message: 'Thành công',
                description: 'Cập nhật lịch hẹn thành công',
                placement: 'topRight'
            });

            onSuccess(response.data);
            onOpenChange(false);
        } catch (error) {
            console.error("Error updating appointment:", error);

            // Show detailed error
            let errorMessage = 'Có lỗi xảy ra khi cập nhật lịch hẹn';
            if (error.message === "Invalid date") {
                errorMessage = 'Ngày giờ không hợp lệ. Vui lòng chọn lại ngày và giờ.';
            }

            notification.error({
                message: 'Lỗi',
                description: errorMessage,
                placement: 'topRight'
            });
        } finally {
            setLoading(false);
        }
    };

    // Check if URL is valid
    const isValidUrl = (url: string) => {
        if (!url) return true; // Empty is OK
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa lịch hẹn</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="topic" className="text-right">
                            Chủ đề <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="topic"
                            name="topic"
                            value={form.topic}
                            onChange={handleChange}
                            className="col-span-3"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="description" className="text-right pt-2">
                            Mô tả
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="col-span-3 min-h-[80px]"
                            rows={3}
                            placeholder="Nhập mô tả ngắn về nội dung cuộc hẹn"
                        />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="text-sm font-medium mb-3">Thời gian cuộc hẹn</h3>

                        <div className="grid grid-cols-4 items-center gap-4 mb-3">
                            <Label className="text-right">
                                Ngày <span className="text-red-500">*</span>
                            </Label>
                            <div className="col-span-3">
                                <CustomDatePicker
                                    value={form.startTime}
                                    onChange={handleDateChange}
                                    hasError={dateError}
                                />
                                {dateError && (
                                    <p className="text-red-500 text-xs mt-1">
                                        Vui lòng chọn ngày
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">
                                Giờ <span className="text-red-500">*</span>
                            </Label>
                            <div className="col-span-3">
                                <CustomTimeSelector />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="text-sm font-medium mb-3">Chi tiết cuộc hẹn</h3>

                        <div className="grid grid-cols-4 items-center gap-4 mb-3">
                            <Label htmlFor="duration" className="text-right">
                                Thời lượng <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={form.duration}
                                onValueChange={(value) =>
                                    setForm((prev) => ({ ...prev, duration: value }))
                                }
                                required
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Chọn thời lượng" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="15">15 phút</SelectItem>
                                    <SelectItem value="30">30 phút</SelectItem>
                                    <SelectItem value="45">45 phút</SelectItem>
                                    <SelectItem value="60">60 phút</SelectItem>
                                    <SelectItem value="90">90 phút</SelectItem>
                                    <SelectItem value="120">120 phút</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="link" className="text-right">
                                Link hội họp
                            </Label>
                            <div className="col-span-3 relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <LinkIcon className="h-4 w-4 text-gray-400" />
                                </div>
                                <Input
                                    id="link"
                                    name="link"
                                    value={form.link}
                                    onChange={handleChange}
                                    placeholder="https://meet.google.com/..."
                                    className="pl-10"
                                    aria-invalid={!isValidUrl(form.link)}
                                />
                                {form.link && !isValidUrl(form.link) && (
                                    <p className="text-red-500 text-xs mt-1">
                                        URL không hợp lệ. Vui lòng nhập đúng định dạng
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Hủy
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={loading || !form.topic || dateError || (form.link && !isValidUrl(form.link))}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Cập nhật
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditAppointmentDialog;