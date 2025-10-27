import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plane, MapPin, Calendar, Users, Car, UtensilsCrossed, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DiningSelection, standardMenuOptions, CUSTOM_CATERING_PRICE } from "@/components/PassengerWeightForm";

interface BookingData {
  pickup_location: string;
  destination: string;
  ride_type: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  passenger_count: number;
  passenger_weights: string[];
  luggage_weights: string[];
  ground_transport: string;
  dining_selections: DiningSelection[];
  flight_cost: number;
  ground_transport_cost: number;
  dining_cost: number;
  total_cost: number;
  service_area?: string;
}

const ReviewAndPay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state as BookingData | null;
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!bookingData) {
      toast.error("No booking data found");
      navigate("/book");
    }
  }, [bookingData, navigate]);

  const handleConfirmPayment = async () => {
    if (!bookingData) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please login to complete booking");
      navigate("/auth");
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.from("bookings").insert({
        user_id: session.user.id,
        pickup_location: bookingData.pickup_location,
        destination: bookingData.destination,
        ride_type: bookingData.ride_type,
        scheduled_date: bookingData.scheduled_date,
        scheduled_time: bookingData.scheduled_time,
        passenger_count: bookingData.passenger_count,
        passenger_weights: bookingData.passenger_weights,
        luggage_weights: bookingData.luggage_weights,
        ground_transport: bookingData.ground_transport,
        dining_options: bookingData.dining_selections as any,
        flight_cost: bookingData.flight_cost,
        ground_transport_cost: bookingData.ground_transport_cost,
        dining_cost: bookingData.dining_cost,
        total_cost: bookingData.total_cost,
        status: "confirmed",
      }).select().single();

      if (error) throw error;

      toast.success("Payment confirmed!");
      
      // Navigate to confirmation page with booking ID
      navigate(`/order-confirmation?id=${data.id}`);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to process payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingData) {
    return null;
  }

  const transportNames: { [key: string]: string } = {
    none: "No Ground Transport",
    standard: "Standard Sedan",
    luxury: "Luxury SUV",
    electric: "Electric Vehicle",
  };


  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Header */}
      <div className="bg-primary/10 border-b">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plane className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Aeolus</h1>
            </div>
            <Button variant="outline" onClick={() => navigate("/book", { state: bookingData })}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Booking
            </Button>
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-2">Review and Pay</h2>
        <p className="text-muted-foreground mb-8">
          Please review your booking details before confirming payment
        </p>

        {/* Booking Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Flight Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Pickup</p>
                  <p className="font-medium">{bookingData.pickup_location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-medium">{bookingData.destination}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Ride Type</p>
                  <p className="font-medium capitalize">{bookingData.ride_type}</p>
                  {bookingData.ride_type === "scheduled" && bookingData.scheduled_date && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {bookingData.scheduled_date} at {bookingData.scheduled_time}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Passengers</p>
                  <p className="font-medium">{bookingData.passenger_count} passenger{bookingData.passenger_count > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {bookingData.ground_transport && bookingData.ground_transport !== "none" && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ground Transport</p>
                    <p className="font-medium">{transportNames[bookingData.ground_transport]}</p>
                  </div>
                </div>
              </>
            )}

            {bookingData.dining_selections && bookingData.dining_selections.some(selection => selection.type !== "none") && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Dining Options</span>
                  </div>
                  <div className="ml-6 space-y-2">
                    {bookingData.dining_selections.map((selection, passengerIndex) => {
                      if (selection.type === "none") return null;
                      
                      return (
                        <div key={passengerIndex} className="text-sm space-y-1">
                          <div className="font-medium">Passenger {passengerIndex + 1}:</div>
                          {selection.type === "standard" && selection.standardOptions?.map(optId => {
                            const option = standardMenuOptions.find(opt => opt.id === optId);
                            if (!option) return null;
                            return (
                              <div key={optId} className="ml-4 text-muted-foreground">
                                • {option.name}
                              </div>
                            );
                          })}
                          {selection.type === "custom" && (
                            <div className="ml-4 text-muted-foreground">
                              • Custom Catering ($50 flat rate)
                              {selection.customOptions && selection.customOptions.length > 0 && (
                                <div className="ml-4 text-xs">
                                  Dietary requirements: {selection.customOptions.join(", ")}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Flight Cost</span>
              <span className="font-medium">${bookingData.flight_cost.toFixed(2)}</span>
            </div>
            {bookingData.ground_transport_cost > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ground Transport</span>
                <span className="font-medium">${bookingData.ground_transport_cost.toFixed(2)}</span>
              </div>
            )}
            {bookingData.dining_cost > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dining</span>
                <span className="font-medium">${bookingData.dining_cost.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${bookingData.total_cost.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Confirm Button */}
        <div className="space-y-4">
          <Button
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            {isProcessing ? "Processing Payment..." : "Complete Purchase"}
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            By confirming, you agree to our terms and conditions. You'll receive a confirmation email after payment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewAndPay;
