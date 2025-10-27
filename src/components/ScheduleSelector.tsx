import { Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ScheduleSelectorProps {
  datetime: string;
  onDateTimeChange: (datetime: string) => void;
}

export const ScheduleSelector = ({
  datetime,
  onDateTimeChange,
}: ScheduleSelectorProps) => {
  // Get minimum datetime (current date and time)
  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Date & Time
      </Label>
      <div className="ml-6 max-w-md">
        <Input
          type="datetime-local"
          value={datetime}
          onChange={(e) => onDateTimeChange(e.target.value)}
          min={getMinDateTime()}
          className="h-12 bg-card w-full"
        />
      </div>
    </div>
  );
};
