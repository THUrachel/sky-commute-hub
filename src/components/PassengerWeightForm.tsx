import { Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export const standardMenuOptions = [
  { id: "gourmet", name: "Gourmet In-Flight Meal", price: 45 },
  { id: "snacks", name: "Premium Snacks & Beverages", price: 20 },
  { id: "champagne", name: "Champagne Service", price: 35 },
];

export const customCateringOptions = [
  { id: "vegetarian", name: "Vegetarian" },
  { id: "gluten-free", name: "Gluten Free" },
  { id: "lactose-free", name: "Lactose Free" },
];

export const CUSTOM_CATERING_PRICE = 50;

export interface DiningSelection {
  type: "none" | "standard" | "custom";
  standardOptions?: string[];
  customOptions?: string[];
}

interface PassengerWeightFormProps {
  passengerCount: number;
  onPassengerCountChange: (count: number) => void;
  passengerWeights: string[];
  onPassengerWeightsChange: (weights: string[]) => void;
  luggageWeights: string[];
  onLuggageWeightsChange: (weights: string[]) => void;
  diningSelections: DiningSelection[];
  onDiningSelectionsChange: (selections: DiningSelection[]) => void;
}

export const PassengerWeightForm = ({
  passengerCount,
  onPassengerCountChange,
  passengerWeights,
  onPassengerWeightsChange,
  luggageWeights,
  onLuggageWeightsChange,
  diningSelections,
  onDiningSelectionsChange,
}: PassengerWeightFormProps) => {
  const updatePassengerWeight = (index: number, value: string) => {
    const numValue = Number(value);
    if (value && numValue > 256) {
      toast.error("Passenger weight cannot exceed 256 lbs");
      return;
    }
    const newWeights = [...passengerWeights];
    newWeights[index] = value;
    onPassengerWeightsChange(newWeights);
  };

  const updateLuggageWeight = (index: number, value: string) => {
    const numValue = Number(value);
    if (value && numValue > 50) {
      toast.error("Luggage weight cannot exceed 50 lbs");
      return;
    }
    const newWeights = [...luggageWeights];
    newWeights[index] = value;
    onLuggageWeightsChange(newWeights);
  };

  const updateDiningType = (passengerIndex: number, type: "none" | "standard" | "custom") => {
    const newSelections = [...diningSelections];
    newSelections[passengerIndex] = {
      type,
      standardOptions: type === "standard" ? [] : undefined,
      customOptions: type === "custom" ? [] : undefined,
    };
    onDiningSelectionsChange(newSelections);
  };

  const toggleStandardOption = (passengerIndex: number, optionId: string) => {
    const newSelections = [...diningSelections];
    const current = newSelections[passengerIndex];
    const currentOptions = current.standardOptions || [];
    
    if (currentOptions.includes(optionId)) {
      newSelections[passengerIndex] = {
        ...current,
        standardOptions: currentOptions.filter(id => id !== optionId),
      };
    } else {
      newSelections[passengerIndex] = {
        ...current,
        standardOptions: [...currentOptions, optionId],
      };
    }
    onDiningSelectionsChange(newSelections);
  };

  const toggleCustomOption = (passengerIndex: number, optionId: string) => {
    const newSelections = [...diningSelections];
    const current = newSelections[passengerIndex];
    const currentOptions = current.customOptions || [];
    
    if (currentOptions.includes(optionId)) {
      newSelections[passengerIndex] = {
        ...current,
        customOptions: currentOptions.filter(id => id !== optionId),
      };
    } else {
      newSelections[passengerIndex] = {
        ...current,
        customOptions: [...currentOptions, optionId],
      };
    }
    onDiningSelectionsChange(newSelections);
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
                    min="0"
                    max="256"
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
                    min="0"
                    max="50"
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
              
              {/* Primary Selection */}
              <Select
                value={diningSelections[index]?.type || "none"}
                onValueChange={(value: "none" | "standard" | "custom") => updateDiningType(index, value)}
              >
                <SelectTrigger className="h-12 bg-card">
                  <SelectValue placeholder="Select dining service" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="none" className="cursor-pointer">
                    No Dining Service
                  </SelectItem>
                  <SelectItem value="standard" className="cursor-pointer">
                    Standard Menu
                  </SelectItem>
                  <SelectItem value="custom" className="cursor-pointer">
                    Custom Catering ($50)
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Standard Menu Options */}
              {diningSelections[index]?.type === "standard" && (
                <div className="space-y-2 p-3 bg-muted/20 rounded-md border border-border">
                  <Label className="text-xs font-medium">Select Menu Items</Label>
                  {standardMenuOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`standard-${index}-${option.id}`}
                        checked={diningSelections[index]?.standardOptions?.includes(option.id) || false}
                        onCheckedChange={() => toggleStandardOption(index, option.id)}
                      />
                      <label
                        htmlFor={`standard-${index}-${option.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {option.name} (${option.price})
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* Custom Catering Options */}
              {diningSelections[index]?.type === "custom" && (
                <div className="space-y-2 p-3 bg-muted/20 rounded-md border border-border">
                  <Label className="text-xs font-medium">Select Dietary Requirements</Label>
                  {customCateringOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`custom-${index}-${option.id}`}
                        checked={diningSelections[index]?.customOptions?.includes(option.id) || false}
                        onCheckedChange={() => toggleCustomOption(index, option.id)}
                      />
                      <label
                        htmlFor={`custom-${index}-${option.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {option.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
