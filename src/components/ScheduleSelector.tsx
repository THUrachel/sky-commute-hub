import { Calendar, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ScheduleSelectorProps {
  date: string;
  onDateChange: (date: string) => void;
  time: string;
  onTimeChange: (time: string) => void;
}

export const ScheduleSelector = ({
  date,
  onDateChange,
  time,
  onTimeChange,
}: ScheduleSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4 ml-6 max-w-md">
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date
          </Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="h-12 bg-card w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time
          </Label>
          <Input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="h-12 bg-card w-full"
          />
        </div>
      </div>
    </div>
  );
};
