import { Users, Weight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PassengerWeightFormProps {
  passengerCount: number;
  onPassengerCountChange: (count: number) => void;
  passengerWeights: string[];
  onPassengerWeightsChange: (weights: string[]) => void;
  luggageWeights: string[];
  onLuggageWeightsChange: (weights: string[]) => void;
}

export const PassengerWeightForm = ({
  passengerCount,
  onPassengerCountChange,
  passengerWeights,
  onPassengerWeightsChange,
  luggageWeights,
  onLuggageWeightsChange,
}: PassengerWeightFormProps) => {
  const updatePassengerWeight = (index: number, value: string) => {
    const newWeights = [...passengerWeights];
    newWeights[index] = value;
    onPassengerWeightsChange(newWeights);
  };

  const updateLuggageWeight = (index: number, value: string) => {
    const newWeights = [...luggageWeights];
    newWeights[index] = value;
    onLuggageWeightsChange(newWeights);
  };
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Users className="h-4 w-4" />
          Number of Passengers
        </Label>
        <div className="flex items-center gap-3 ml-6">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onPassengerCountChange(Math.max(1, passengerCount - 1))}
            className="h-10 w-10"
          >
            -
          </Button>
          <div className="w-16 text-center font-semibold text-lg">{passengerCount}</div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              if (passengerCount >= 3) {
                toast.error("Maximum 3 passengers allowed");
              } else {
                onPassengerCountChange(passengerCount + 1);
              }
            }}
            className="h-10 w-10"
          >
            +
          </Button>
        </div>
      </div>

      <div className="space-y-4 ml-6">
        {Array.from({ length: passengerCount }, (_, index) => (
          <div key={index} className="space-y-2">
            <Label className="text-sm font-medium">
              Passenger {index + 1}
            </Label>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Passenger Weight
                </Label>
                <div className="flex items-center gap-2 max-w-[140px]">
                  <Input
                    type="number"
                    value={passengerWeights[index] || ""}
                    onChange={(e) => updatePassengerWeight(index, e.target.value)}
                    placeholder="150"
                    className="h-12 bg-card"
                  />
                  <span className="text-sm text-muted-foreground">lbs</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Luggage Weight
                </Label>
                <div className="flex items-center gap-2 max-w-[140px]">
                  <Input
                    type="number"
                    value={luggageWeights[index] || ""}
                    onChange={(e) => updateLuggageWeight(index, e.target.value)}
                    placeholder="25"
                    className="h-12 bg-card"
                  />
                  <span className="text-sm text-muted-foreground">lbs</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
