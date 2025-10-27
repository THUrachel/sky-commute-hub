import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
    const date = selectedDate || new Date();
    const [currentHours, currentMinutes] = selectedTime ? selectedTime.split(':') : ['12', '00'];
    
    if (type === 'hour') {
      date.setHours(parseInt(value), parseInt(currentMinutes));
    } else {
      date.setHours(parseInt(currentHours), parseInt(value));
    }
    
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

  const [hours, minutes] = selectedTime ? selectedTime.split(':') : ['12', '00'];

  // Generate hour and minute options
  const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

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
        
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-12 bg-card",
                !selectedTime && "text-muted-foreground"
              )}
            >
              <Clock className="mr-2 h-4 w-4" />
              {selectedTime ? selectedTime : <span>Pick a time</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <div className="flex gap-2">
              <Select value={hours} onValueChange={(value) => handleTimeChange('hour', value)}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent>
                  {hourOptions.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <span className="flex items-center">:</span>
              
              <Select value={minutes} onValueChange={(value) => handleTimeChange('minute', value)}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {minuteOptions.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
