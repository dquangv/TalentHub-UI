import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

interface DatePickerInputProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>; // Props cho Input
  calendarProps?: React.ComponentProps<typeof Calendar>; // Props cho Calendar
}

function DatePickerInput({
  selectedDate,
  onDateChange,
  inputProps,
  calendarProps,
}: DatePickerInputProps) {
  const [showCalendar, setShowCalendar] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const handleDateSelect = (date: Date | undefined) => {
    onDateChange(date);
    setShowCalendar(false); // Ẩn calendar sau khi chọn ngày
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setShowCalendar(false); // Ẩn calendar nếu bấm ra ngoài
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Input */}
      <Input
        type="text"
        placeholder="Chọn ngày"
        value={selectedDate ? selectedDate.toLocaleDateString("vi-VN") : ""}
        readOnly
        onClick={() => setShowCalendar((prev) => !prev)} // Hiển thị/Ẩn calendar khi bấm vào input
        className="cursor-pointer"
        {...inputProps} // Truyền thêm props vào Input
      />

      {/* Calendar */}
      {showCalendar && (
        <div className="absolute z-10 mt-2 bg-white border rounded shadow">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            {...calendarProps} // Truyền thêm props vào Calendar
          />
        </div>
      )}
    </div>
  );
}

export default DatePickerInput;