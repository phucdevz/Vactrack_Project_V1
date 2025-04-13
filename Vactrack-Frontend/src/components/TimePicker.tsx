
import * as React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { BookingSlot } from "@/models/booking";

interface TimePickerProps {
  value: string | undefined;
  onChange: (value: string) => void;
  timeSlots: BookingSlot[];
  className?: string;
  disabled?: boolean;
}

export function TimePicker({ value, onChange, timeSlots = [], className, disabled = false }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Ensure timeSlots is always an array to prevent "undefined is not iterable" error
  const slots = Array.isArray(timeSlots) ? timeSlots : [];
  
  // Only proceed with sorting if we have slots
  const sortedTimeSlots = [...slots].sort((a, b) => {
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
    return timeA[1] - timeB[1];
  });

  const morningSlots = sortedTimeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour < 12;
  });

  const afternoonSlots = sortedTimeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 12;
  });

  return (
    <Popover open={open && !disabled} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            disabled && "opacity-70 cursor-not-allowed",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? value : "Chọn giờ"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Tìm giờ..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy giờ phù hợp.</CommandEmpty>
            {sortedTimeSlots.length > 0 ? (
              <div className="max-h-[300px] overflow-y-auto">
                {morningSlots.length > 0 && (
                  <CommandGroup heading="Buổi sáng">
                    <div className="grid grid-cols-2 gap-1 p-1">
                      {morningSlots.map((slot) => (
                        <CommandItem
                          key={slot.id}
                          value={slot.time}
                          onSelect={(currentValue) => {
                            onChange(currentValue);
                            setOpen(false);
                          }}
                          disabled={!slot.available}
                          className={cn(
                            "flex items-center justify-center py-2 px-3 rounded m-1",
                            !slot.available && "opacity-50 cursor-not-allowed",
                            slot.available && slot.time === value && "bg-brand-100 text-brand-900"
                          )}
                        >
                          {slot.time}
                          {!slot.available && " ✗"}
                        </CommandItem>
                      ))}
                    </div>
                  </CommandGroup>
                )}
                
                {afternoonSlots.length > 0 && (
                  <CommandGroup heading="Buổi chiều">
                    <div className="grid grid-cols-2 gap-1 p-1">
                      {afternoonSlots.map((slot) => (
                        <CommandItem
                          key={slot.id}
                          value={slot.time}
                          onSelect={(currentValue) => {
                            onChange(currentValue);
                            setOpen(false);
                          }}
                          disabled={!slot.available}
                          className={cn(
                            "flex items-center justify-center py-2 px-3 rounded m-1",
                            !slot.available && "opacity-50 cursor-not-allowed",
                            slot.available && slot.time === value && "bg-brand-100 text-brand-900"
                          )}
                        >
                          {slot.time}
                          {!slot.available && " ✗"}
                        </CommandItem>
                      ))}
                    </div>
                  </CommandGroup>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Chọn ngày và cơ sở để xem giờ trống
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
