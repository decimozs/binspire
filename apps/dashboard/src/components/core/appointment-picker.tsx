import { Button } from "@binspire/ui/components/button";
import { Calendar } from "@binspire/ui/components/calendar";
import { Label } from "@binspire/ui/components/label";
import { Input } from "@binspire/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@binspire/ui/components/popover";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface DateAndTimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function DateAndTimePicker({ value, onChange }: DateAndTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined,
  );
  const [time, setTime] = useState<string>(
    value ? new Date(value).toTimeString().slice(0, 8) : "10:30:00",
  );

  useEffect(() => {
    if (date && time && onChange) {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const updated = new Date(date);
      updated.setHours(hours, minutes, seconds);
      onChange(updated.toISOString());
    }
  }, [date, time]);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label className="px-1">Date</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="center">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(newDate) => {
                setDate(newDate || undefined);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-3">
        <Label className="px-1">Time</Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
