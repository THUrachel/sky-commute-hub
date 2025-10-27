import { Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ScheduleSelectorProps {
  datetime: string;
  onDateTimeChange: (datetime: string) => void;
}

export const ScheduleSelector = ({
  datetime,
  onDateTimeChange,
}: ScheduleSelectorProps) => {
  // Parse the datetime string to Date and time parts
  const parseDateTime = (datetimeStr: string) => {
    if (!datetimeStr) return { date: undefined, time: "" };
    const date = new Date(datetimeStr);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return { date, time: `${hours}:${minutes}` };
  };

  const { date: selectedDate, time: selectedTime } = parseDateTime(datetime);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // Preserve the time when changing date
    const [hours, minutes] = selectedTime ? selectedTime.split(':') : ['12', '00'];
    date.setHours(parseInt(hours), parseInt(minutes));
    
    const formatted = formatToDateTimeLocal(date);
    onDateTimeChange(formatted);
  };

  const handleTimeChange = (time: string) => {
    const date = selectedDate || new Date();
    const [hours, minutes] = time.split(':');
    date.setHours(parseInt(hours), parseInt(minutes));
    
    const formatted = formatToDateTimeLocal(date);
    onDateTimeChange(formatted);
  };

  const formatToDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <CalendarIcon className="h-4 w-4" />
        Date & Time
      </Label>
      <div className="ml-6 max-w-md space-y-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-12 bg-card",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
        <Input
          type="time"
          value={selectedTime}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="h-12 bg-card w-full"
        />
      </div>
    </div>
  );
};
