import { Car, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface GroundTransportSelectorProps {
  selectedTransport: string | null;
  onTransportChange: (transport: string | null) => void;
}

const transportOptions = [
  { id: "none", name: "No Ground Transport", description: "I'll arrange my own" },
  { id: "standard", name: "Standard Sedan", description: "Comfortable ride, up to 3 passengers" },
  { id: "luxury", name: "Luxury SUV", description: "Premium comfort, up to 6 passengers" },
  { id: "electric", name: "Electric Vehicle", description: "Eco-friendly, up to 4 passengers" },
];

export const GroundTransportSelector = ({
  selectedTransport,
  onTransportChange,
}: GroundTransportSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Car className="h-4 w-4" />
        Ground Transport Partnership
      </Label>
      <div className="grid gap-3">
        {transportOptions.map((option) => (
          <Card
            key={option.id}
            onClick={() => onTransportChange(option.id === selectedTransport ? null : option.id)}
            className={`p-4 cursor-pointer transition-all border-2 hover:border-primary ${
              selectedTransport === option.id
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{option.name}</div>
                <div className="text-sm text-muted-foreground">{option.description}</div>
              </div>
              {selectedTransport === option.id && (
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
