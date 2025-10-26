import { CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface PaymentSummaryProps {
  flightCost: number;
  groundTransport: number;
  dining: number;
  passengerCount: number;
  onBooking: () => void;
  isLoading?: boolean;
}

export const PaymentSummary = ({
  flightCost,
  groundTransport,
  dining,
  passengerCount,
  onBooking,
  isLoading = false,
}: PaymentSummaryProps) => {
  const total = flightCost + groundTransport + dining;

  return (
    <Card className="p-6 bg-card border-border shadow-elevated">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Booking Summary</h3>
        </div>

        <div className="space-y-3">
          {passengerCount === 1 ? (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Flight (1 passenger)</span>
              <span className="font-medium">${flightCost.toFixed(2)}</span>
            </div>
          ) : (
            <>
              {Array.from({ length: passengerCount }, (_, i) => {
                let price = 299;
                if (i === 1) price = 249;
                else if (i === 2) price = 199;
                else if (i >= 3) price = 149;
                
                return (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Passenger {i + 1}
                      {i > 0 && <span className="text-xs ml-1 text-primary">(Discounted)</span>}
                    </span>
                    <span className="font-medium">${price.toFixed(2)}</span>
                  </div>
                );
              })}
            </>
          )}
          {groundTransport > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ground Transport</span>
              <span className="font-medium">${groundTransport.toFixed(2)}</span>
            </div>
          )}
          {dining > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Dining</span>
              <span className="font-medium">${dining.toFixed(2)}</span>
            </div>
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
