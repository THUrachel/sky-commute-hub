import { Users, Weight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PassengerWeightFormProps {
  passengerCount: number;
  onPassengerCountChange: (count: number) => void;
  passengerWeight: string;
  onPassengerWeightChange: (weight: string) => void;
  luggageWeight: string;
  onLuggageWeightChange: (weight: string) => void;
}

export const PassengerWeightForm = ({
  passengerCount,
  onPassengerCountChange,
  passengerWeight,
  onPassengerWeightChange,
  luggageWeight,
  onLuggageWeightChange,
}: PassengerWeightFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Users className="h-4 w-4" />
          Number of Passengers
        </Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onPassengerCountChange(Math.max(1, passengerCount - 1))}
            className="h-10 w-10"
          >
            -
          </Button>
          <div className="flex-1 text-center font-semibold text-lg">{passengerCount}</div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onPassengerCountChange(Math.min(4, passengerCount + 1))}
            className="h-10 w-10"
          >
            +
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Weight className="h-4 w-4" />
            Passenger Weight (lbs)
          </Label>
          <Input
            type="number"
            value={passengerWeight}
            onChange={(e) => onPassengerWeightChange(e.target.value)}
            placeholder="Per person"
            className="h-12 bg-card"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Luggage Weight (lbs)</Label>
          <Input
            type="number"
            value={luggageWeight}
            onChange={(e) => onLuggageWeightChange(e.target.value)}
            placeholder="Per person"
            className="h-12 bg-card"
          />
        </div>
      </div>
    </div>
  );
};
