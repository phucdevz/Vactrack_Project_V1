
import * as React from "react";
import { MapPin, Building } from "lucide-react";
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
import { Facility } from "@/models/facility";

interface FacilityPickerProps {
  value: string | undefined;
  onChange: (value: string, facilityName: string) => void;
  facilities: Facility[];
  className?: string;
}

export function FacilityPicker({ value, onChange, facilities = [], className }: FacilityPickerProps) {
  const [open, setOpen] = React.useState(false);

  // Make sure we have a valid array even if facilities is undefined
  const facilityList = Array.isArray(facilities) ? facilities : [];

  // Find the selected facility name
  const selectedFacility = facilityList.find(facility => facility.id === value);

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
          <Building className="mr-2 h-4 w-4" />
          {selectedFacility ? (
            <div className="flex flex-col items-start">
              <span>{selectedFacility.name}</span>
              <span className="text-xs text-muted-foreground">{selectedFacility.address}</span>
            </div>
          ) : (
            "Chọn cơ sở"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Tìm cơ sở..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy cơ sở phù hợp.</CommandEmpty>
            {facilityList && facilityList.length > 0 ? (
              <CommandGroup>
                {facilityList.map((facility) => (
                  <CommandItem
                    key={facility.id}
                    value={facility.id}
                    onSelect={() => {
                      onChange(facility.id, facility.name);
                      setOpen(false);
                    }}
                    className="flex flex-col items-start py-3"
                  >
                    <div className="font-medium">{facility.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {facility.address}, {facility.district}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Không có cơ sở nào
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
