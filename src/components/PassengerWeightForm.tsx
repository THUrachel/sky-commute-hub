import { Users, Weight, UtensilsCrossed } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export const diningOptions = [
  { id: "gourmet", name: "Gourmet In-Flight Meal", price: 45 },
  { id: "snacks", name: "Premium Snacks & Beverages", price: 20 },
  { id: "champagne", name: "Champagne Service", price: 35 },
  { id: "catering", name: "Custom Catering", price: 75 },
];

interface PassengerWeightFormProps {
  passengerCount: number;
  onPassengerCountChange: (count: number) => void;
  passengerWeights: string[];
  onPassengerWeightsChange: (weights: string[]) => void;
  luggageWeights: string[];
  onLuggageWeightsChange: (weights: string[]) => void;
  diningOptions: string[][];
  onDiningOptionsChange: (options: string[][]) => void;
}

export const PassengerWeightForm = ({
  passengerCount,
  onPassengerCountChange,
  passengerWeights,
  onPassengerWeightsChange,
  luggageWeights,
  onLuggageWeightsChange,
  diningOptions: selectedDining,
  onDiningOptionsChange,
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

  const updateDiningOption = (passengerIndex: number, optionId: string, checked: boolean) => {
    const newDining = [...selectedDining];
    if (!newDining[passengerIndex]) {
      newDining[passengerIndex] = [];
    }
    
    if (checked) {
      newDining[passengerIndex] = [...newDining[passengerIndex], optionId];
    } else {
      newDining[passengerIndex] = newDining[passengerIndex].filter(id => id !== optionId);
    }
    
    onDiningOptionsChange(newDining);
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
          <div key={index} className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
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

            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground">
                Dining Options
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {diningOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dining-${index}-${option.id}`}
                      checked={selectedDining[index]?.includes(option.id) || false}
                      onCheckedChange={(checked) => 
                        updateDiningOption(index, option.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`dining-${index}-${option.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {option.name} (${option.price})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
