import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Plus, Search, Loader2 } from "lucide-react";
import {
  useAutofillInput,
  AutofillInputProps,
  entityConfigs,
} from "@/services/autoFillService";
import { Empty } from "antd";

interface AutofillInputComponentProps extends AutofillInputProps {
  label?: string;
  className?: string;
}

const AutofillInput: React.FC<AutofillInputComponentProps> = ({
  entityType,
  value,
  initialText,
  onChange,
  placeholder,
  disabled,
  label,
  className,
  excludeIds,
}) => {
  const {
    searchText,
    isDropdownOpen,
    inputRef,
    dropdownRef,
    handleInputChange,
    toggleDropdown,
    selectItem,
    handleCreateItem,
    filteredItems,
    loading,
  } = useAutofillInput({
    entityType,
    value,
    initialText,
    onChange,
    placeholder,
    disabled,
    excludeIds,
  });

  // Get the name field from entity config
  const nameField = entityConfigs[entityType]?.nameField || "name";

  // Function to check if item creation should be allowed
  const shouldAllowItemCreation = () => {
    // Don't allow creating items with "Chưa có" text
    return searchText && searchText.trim() !== "Chưa có" && !loading;
  };

  return (
    <div className={`relative ${className || ""}`}>
      {label && (
        <label className="text-sm font-medium mb-1 block">{label}</label>
      )}

      <div className="relative">
        <Input
          ref={inputRef}
          value={searchText}
          onChange={handleInputChange}
          onClick={toggleDropdown}
          onFocus={() => {
            if (searchText) toggleDropdown();
          }}
          placeholder={placeholder || `Chọn hoặc nhập...`}
          disabled={disabled || loading}
          className="pr-10"
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full px-3 py-1"
          onClick={toggleDropdown}
          disabled={disabled || loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-popover rounded-md border border-input shadow-md"
        >
          <div className="max-h-60 overflow-auto py-1">
            {filteredItems.length > 0 ? (
              <>
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent ${
                      value === item.id ? "bg-accent" : ""
                    }`}
                    onClick={() => selectItem(item.id, item[nameField])}
                  >
                    {value === item.id && (
                      <Check className="h-4 w-4 mr-2 text-primary" />
                    )}
                    {item[nameField]}
                  </div>
                ))}
              </>
            ) : (
              <div className="p-2 text-sm text-center">
                <div className="text-muted-foreground mb-2">
                  {loading ? (
                    "Đang tải..."
                  ) : (
                    <Empty description="Không tìm thấy kết quả" />
                  )}
                </div>
                {shouldAllowItemCreation() && (
                  <Button onClick={handleCreateItem} className="bg-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm mới: {searchText}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutofillInput;
