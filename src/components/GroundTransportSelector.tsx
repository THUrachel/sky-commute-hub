import { Car } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const selectedOption = transportOptions.find(opt => opt.id === selectedTransport);
  
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Car className="h-4 w-4" />
        Ground Transport Partnership
      </Label>
      <div className="ml-6">
        <Select value={selectedTransport || undefined} onValueChange={onTransportChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select ground transport option">
              {selectedOption && <span>{selectedOption.name}</span>}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="z-50">
            {transportOptions.map((option) => (
              <SelectItem key={option.id} value={option.id} className="py-3">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{option.name}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
