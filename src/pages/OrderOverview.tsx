import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plane, MapPin, Calendar, Users, Car, UtensilsCrossed, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BookingDetails {
  id: string;
  pickup_location: string;
  destination: string;
  ride_type: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  passenger_count: number;
  ground_transport: string;
  dining_options: string[];
  flight_cost: number;
  ground_transport_cost: number;
  dining_cost: number;
  total_cost: number;
  status: string;
  created_at: string;
}

const OrderOverview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("id");
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        toast.error("No booking ID provided");
        navigate("/book");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login to view your booking");
        navigate("/");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("id", bookingId)
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          toast.error("Booking not found");
          navigate("/book");
          return;
        }

        setBooking(data as BookingDetails);
      } catch (error) {
        console.error("Error fetching booking:", error);
        toast.error("Failed to load booking details");
        navigate("/book");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-sky flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const transportNames: { [key: string]: string } = {
    none: "No Ground Transport",
    standard: "Standard Sedan",
    luxury: "Luxury SUV",
    electric: "Electric Vehicle",
  };

  const diningNames: { [key: string]: string } = {
    beverages: "Premium Beverages",
    snacks: "Gourmet Snacks",
    meal: "Full Meal Service",
    dietary: "Special Dietary Needs",
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
            <Button variant="outline" onClick={() => navigate("/book")}>
              Book Another Flight
            </Button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6 border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <div>
                <h2 className="text-2xl font-bold text-green-900 dark:text-green-100">
                  Booking Confirmed!
                </h2>
                <p className="text-green-700 dark:text-green-300 mt-1">
                  Your flight has been successfully booked. A confirmation email has been sent to you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  <p className="font-medium">{booking.pickup_location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-medium">{booking.destination}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Ride Type</p>
                  <p className="font-medium capitalize">{booking.ride_type}</p>
                  {booking.ride_type === "scheduled" && booking.scheduled_date && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {booking.scheduled_date} at {booking.scheduled_time}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Passengers</p>
                  <p className="font-medium">{booking.passenger_count} passenger{booking.passenger_count > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {booking.ground_transport && booking.ground_transport !== "none" && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ground Transport</p>
                    <p className="font-medium">{transportNames[booking.ground_transport]}</p>
                  </div>
                </div>
              </>
            )}

            {booking.dining_options && booking.dining_options.length > 0 && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <UtensilsCrossed className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Dining Options</p>
                    <ul className="font-medium space-y-1">
                      {booking.dining_options.map((option) => (
                        <li key={option}>• {diningNames[option]}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Flight Cost</span>
              <span className="font-medium">${booking.flight_cost.toFixed(2)}</span>
            </div>
            {booking.ground_transport_cost > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ground Transport</span>
                <span className="font-medium">${booking.ground_transport_cost.toFixed(2)}</span>
              </div>
            )}
            {booking.dining_cost > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dining</span>
                <span className="font-medium">${booking.dining_cost.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${booking.total_cost.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Booking ID: {booking.id}</p>
          <p className="mt-1">Need help? Contact us at support@aeolus.com</p>
        </div>
      </div>
    </div>
  );
};

export default OrderOverview;
