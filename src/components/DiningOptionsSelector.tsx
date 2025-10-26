import { UtensilsCrossed } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DiningOptionsSelectorProps {
  selectedDining: string[];
  onDiningChange: (dining: string[]) => void;
}

export const diningOptions = [
  { id: "beverages", name: "Premium Beverages", description: "Champagne, wine, and soft drinks", price: 35 },
  { id: "snacks", name: "Gourmet Snacks", description: "Artisan cheese, crackers, and fruits", price: 45 },
  { id: "meal", name: "Full Meal Service", description: "Chef-prepared meal for your journey", price: 65 },
  { id: "dietary", name: "Special Dietary Needs", description: "Vegetarian, vegan, gluten-free options", price: 50 },
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
      <div className="ml-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {selectedDining.length > 0
                ? `${selectedDining.length} option${selectedDining.length > 1 ? 's' : ''} selected`
                : "Select dining options"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)] z-50 bg-popover">
            {diningOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.id}
                checked={selectedDining.includes(option.id)}
                onCheckedChange={() => toggleDining(option.id)}
                className="py-3"
              >
                <div className="flex flex-col gap-1 ml-2 flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <span className="font-medium">{option.name}</span>
                    <span className="font-semibold text-primary whitespace-nowrap">${option.price}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
