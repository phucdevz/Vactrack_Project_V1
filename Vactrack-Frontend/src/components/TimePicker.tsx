
import * as React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
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
}

export function TimePicker({ value, onChange, timeSlots, className }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? value : "Chọn giờ"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Tìm giờ..." />
          <CommandEmpty>Không tìm thấy giờ phù hợp.</CommandEmpty>
          <CommandGroup>
            {timeSlots.map((slot) => (
              <CommandItem
                key={slot.id}
                value={slot.time}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                  setOpen(false);
                }}
                disabled={!slot.available}
                className={cn(
                  !slot.available && "opacity-50 cursor-not-allowed",
                  slot.time === value && "bg-accent text-accent-foreground"
                )}
              >
                {slot.time}
                {!slot.available && " (Đã đặt)"}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
