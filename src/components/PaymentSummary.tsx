import { CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DiningSelection, standardMenuOptions, CUSTOM_CATERING_PRICE } from "@/components/PassengerWeightForm";

interface PaymentSummaryProps {
  flightCost: number;
  groundTransport: number;
  dining: number;
  passengerCount: number;
  diningSelections: DiningSelection[];
  onBooking: () => void;
  isLoading?: boolean;
}

export const PaymentSummary = ({
  flightCost,
  groundTransport,
  dining,
  passengerCount,
  diningSelections,
  onBooking,
  isLoading = false,
}: PaymentSummaryProps) => {
  const total = flightCost + groundTransport + dining;

  // Calculate individual passenger prices based on total flight cost
  const getPassengerPrices = () => {
    if (passengerCount === 0 || flightCost === 0) return [];
    
    const prices: number[] = [];
    let remainingCost = flightCost;
    
    // Calculate what the base price per passenger should be by working backwards
    // from the total flight cost given the discount structure
    let totalMultiplier = 0;
    for (let i = 1; i <= passengerCount; i++) {
      if (i === 1) totalMultiplier += 1;
      else if (i === 2) totalMultiplier += 0.83;
      else if (i === 3) totalMultiplier += 0.67;
      else totalMultiplier += 0.50;
    }
    
    const basePrice = flightCost / totalMultiplier;
    
    // Now calculate each passenger's price
    for (let i = 1; i <= passengerCount; i++) {
      if (i === 1) {
        prices.push(Math.round(basePrice));
      } else if (i === 2) {
        prices.push(Math.round(basePrice * 0.83));
      } else if (i === 3) {
        prices.push(Math.round(basePrice * 0.67));
      } else {
        prices.push(Math.round(basePrice * 0.50));
      }
    }
    
    return prices;
  };

  const passengerPrices = getPassengerPrices();

  return (
    <Card className="p-6 bg-card border-border shadow-elevated">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Booking Summary</h3>
        </div>

        <div className="space-y-3">
          <div className="font-semibold">Flight</div>
          {passengerPrices.map((price, i) => (
            <div key={i} className="flex justify-between text-sm pl-4">
              <span className="text-muted-foreground">
                Passenger {i + 1}
                {i > 0 && <span className="text-xs ml-1 text-primary">(Discounted)</span>}
              </span>
              <span className="font-medium">${price.toFixed(2)}</span>
            </div>
          ))}
          {groundTransport > 0 && (
            <>
              <div className="font-semibold mt-3">Ground Transport</div>
              <div className="flex justify-between text-sm pl-4">
                <span className="text-muted-foreground">Transportation</span>
                <span className="font-medium">${groundTransport.toFixed(2)}</span>
              </div>
            </>
          )}
          {diningSelections.some(selection => selection.type !== "none") && (
            <>
              <div className="font-semibold mt-3">Dining</div>
              {diningSelections.map((selection, passengerIndex) => {
                if (selection.type === "none") return null;
                
                return (
                  <div key={passengerIndex} className="space-y-1">
                    {selection.type === "standard" && selection.standardOptions?.map(optId => {
                      const option = standardMenuOptions.find(opt => opt.id === optId);
                      if (!option) return null;
                      return (
                        <div key={`${passengerIndex}-${optId}`} className="flex justify-between text-sm pl-4">
                          <span className="text-muted-foreground">P{passengerIndex + 1} - {option.name}</span>
                          <span className="font-medium">${option.price.toFixed(2)}</span>
                        </div>
                      );
                    })}
                    {selection.type === "custom" && (
                      <div className="flex justify-between text-sm pl-4">
                        <span className="text-muted-foreground">P{passengerIndex + 1} - Custom Catering</span>
                        <span className="font-medium">${CUSTOM_CATERING_PRICE.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>

        <Separator />

        <div className="flex justify-between items-center pt-2">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-bold text-2xl text-primary">${total.toFixed(2)}</span>
        </div>

        <Button
          onClick={onBooking}
          disabled={isLoading}
          className="w-full h-12 text-base font-semibold bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          {isLoading ? "Processing..." : "Review and Pay"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          You'll be charged after your flight is confirmed
        </p>
      </div>
    </Card>
  );
};
