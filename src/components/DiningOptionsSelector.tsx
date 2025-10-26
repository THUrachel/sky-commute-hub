import { UtensilsCrossed, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface DiningOptionsSelectorProps {
  selectedDining: string[];
  onDiningChange: (dining: string[]) => void;
}

const diningOptions = [
  { id: "beverages", name: "Premium Beverages", description: "Champagne, wine, and soft drinks" },
  { id: "snacks", name: "Gourmet Snacks", description: "Artisan cheese, crackers, and fruits" },
  { id: "meal", name: "Full Meal Service", description: "Chef-prepared meal for your journey" },
  { id: "dietary", name: "Special Dietary Needs", description: "Vegetarian, vegan, gluten-free options" },
];

export const DiningOptionsSelector = ({
  selectedDining,
  onDiningChange,
}: DiningOptionsSelectorProps) => {
  const toggleDining = (id: string) => {
    if (selectedDining.includes(id)) {
      onDiningChange(selectedDining.filter((d) => d !== id));
    } else {
      onDiningChange([...selectedDining, id]);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <UtensilsCrossed className="h-4 w-4" />
        Dining Options
      </Label>
      <div className="grid gap-3">
        {diningOptions.map((option) => (
          <Card
            key={option.id}
            onClick={() => toggleDining(option.id)}
            className={`p-4 cursor-pointer transition-all border-2 hover:border-primary ${
              selectedDining.includes(option.id)
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{option.name}</div>
                <div className="text-sm text-muted-foreground">{option.description}</div>
              </div>
              {selectedDining.includes(option.id) && (
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
