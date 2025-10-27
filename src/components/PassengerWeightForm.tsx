import { Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const diningOptions = [
  { id: "none", name: "No Dining Service", price: 0 },
  { id: "gourmet", name: "Gourmet In-Flight Meal", price: 45 },
  { id: "snacks", name: "Premium Snacks & Beverages", price: 20 },
  { id: "champagne", name: "Champagne Service", price: 35 },
  { id: "catering", name: "Custom Catering", price: 75 },
];

interface PassengerWeightFormProps {
  disabled?: boolean;
  passengerCount: number;
  onPassengerCountChange: (count: number) => void;
  passengerWeights: string[];
  onPassengerWeightsChange: (weights: string[]) => void;
  luggageWeights: string[];
  onLuggageWeightsChange: (weights: string[]) => void;
  diningOptions: string[];
  onDiningOptionsChange: (options: string[]) => void;
}

export const PassengerWeightForm = ({
  disabled = false,
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

  const updateDiningOption = (passengerIndex: number, optionId: string) => {
    const newDining = [...selectedDining];
    newDining[passengerIndex] = optionId;
    onDiningOptionsChange(newDining);
  };
  return (
    <div className="space-y-4">
      {disabled && (
        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border">
          Please select both pickup and destination vertiports to continue
        </div>
      )}
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
            disabled={disabled}
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
            disabled={disabled}
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
                    disabled={disabled}
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
                    disabled={disabled}
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
              <Select
                disabled={disabled}
                value={selectedDining[index] || "none"}
                onValueChange={(value) => updateDiningOption(index, value)}
              >
                <SelectTrigger className="h-12 bg-card">
                  <SelectValue placeholder="Select dining option" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {diningOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id} className="cursor-pointer">
                      {option.name} {option.price > 0 && `($${option.price})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
