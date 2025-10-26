import { useState, useEffect } from "react";
import { Plane, LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-evtol.jpg";
import { Button } from "@/components/ui/button";
import { LocationInput } from "@/components/LocationInput";
import { VertiportSelector } from "@/components/VertiportSelector";
import { RideTypeSelector } from "@/components/RideTypeSelector";
import { ScheduleSelector } from "@/components/ScheduleSelector";
import { PassengerWeightForm } from "@/components/PassengerWeightForm";
import { GroundTransportSelector } from "@/components/GroundTransportSelector";
import { DiningOptionsSelector, diningOptions } from "@/components/DiningOptionsSelector";
import { PaymentSummary } from "@/components/PaymentSummary";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pickup, setPickup] = useState("");
  const [pickupZipcode, setPickupZipcode] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationZipcode, setDestinationZipcode] = useState("");
  const [rideType, setRideType] = useState<"on-demand" | "scheduled">("on-demand");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengerWeights, setPassengerWeights] = useState<string[]>([""]);
  const [luggageWeights, setLuggageWeights] = useState<string[]>([""]);
  const [groundTransport, setGroundTransport] = useState<string>("");
  const [dining, setDining] = useState<string[]>([]);

  // Check authentication status and redirect if not logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login to access the booking page");
        navigate("/");
        return;
      }
      setUser(session.user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate("/");
        }
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const calculateCosts = () => {
    const baseFlight = 299 * passengerCount;
    const transportCost = !groundTransport || groundTransport === "none" ? 0 : groundTransport === "standard" ? 75 : groundTransport === "luxury" ? 150 : groundTransport === "electric" ? 90 : 0;
    const diningCost = dining.reduce((total, diningId) => {
      const option = diningOptions.find(opt => opt.id === diningId);
      return total + (option?.price || 0);
    }, 0);
    return { flightCost: baseFlight, groundTransport: transportCost, dining: diningCost };
  };

  const handleBooking = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to book a flight");
      navigate("/");
      return;
    }

    if (!pickup || !destination) {
      toast.error("Please enter pickup and destination locations");
      return;
    }
    if (rideType === "scheduled" && (!date || !time)) {
      toast.error("Please select date and time for scheduled flight");
      return;
    }

    // Navigate to review page with booking data
    const { flightCost, groundTransport: groundTransportCost, dining: diningCost } = costs;
    const totalCost = flightCost + groundTransportCost + diningCost;
    
    const bookingData = {
      pickup_location: pickup,
      destination: destination,
      ride_type: rideType,
      scheduled_date: rideType === "scheduled" ? date : null,
      scheduled_time: rideType === "scheduled" ? time : null,
      passenger_count: passengerCount,
      passenger_weights: passengerWeights,
      luggage_weights: luggageWeights,
      ground_transport: groundTransport,
      dining_options: dining,
      flight_cost: flightCost,
      ground_transport_cost: groundTransportCost,
      dining_cost: diningCost,
      total_cost: totalCost,
    };
    
    // Pass data via navigation state
    navigate("/review-and-pay", { state: bookingData });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const costs = calculateCosts();

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Aeolus eVTOL Aircraft"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-background/95" />
        </div>
        
        {/* Auth buttons in top right */}
        <div className="absolute top-6 right-6 z-20">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-white text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/")}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <User className="h-4 w-4 mr-2" />
              Login / Sign Up
            </Button>
          )}
        </div>

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto space-y-6 animate-float">
            <div className="inline-flex items-center gap-3 mb-4">
              <Plane className="h-12 w-12 text-accent animate-glow" />
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                Aeolus
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-white/90 font-light">
              Trusted Transport in the Third Dimension
            </p>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="container max-w-7xl mx-auto px-4 -mt-20 pb-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-elevated p-6 md:p-8 space-y-6 border border-border">
              <h2 className="text-2xl font-bold">Book Your Flight</h2>

              <RideTypeSelector value={rideType} onChange={setRideType} />

              <div className="grid md:grid-cols-2 gap-4">
                <VertiportSelector
                  label="Pickup Vertiport"
                  value={pickup}
                  onChange={setPickup}
                  zipcode={pickupZipcode}
                  onZipcodeChange={setPickupZipcode}
                />
                <VertiportSelector
                  label="Destination Vertiport"
                  value={destination}
                  onChange={setDestination}
                  zipcode={destinationZipcode}
                  onZipcodeChange={setDestinationZipcode}
                />
              </div>

              {rideType === "scheduled" && (
                <ScheduleSelector
                  date={date}
                  onDateChange={setDate}
                  time={time}
                  onTimeChange={setTime}
                />
              )}

              <PassengerWeightForm
                passengerCount={passengerCount}
                onPassengerCountChange={(count) => {
                  setPassengerCount(count);
                  // Resize arrays when passenger count changes
                  setPassengerWeights(prev => {
                    const newWeights = [...prev];
                    while (newWeights.length < count) newWeights.push("");
                    return newWeights.slice(0, count);
                  });
                  setLuggageWeights(prev => {
                    const newWeights = [...prev];
                    while (newWeights.length < count) newWeights.push("");
                    return newWeights.slice(0, count);
                  });
                }}
                passengerWeights={passengerWeights}
                onPassengerWeightsChange={setPassengerWeights}
                luggageWeights={luggageWeights}
                onLuggageWeightsChange={setLuggageWeights}
              />

              <GroundTransportSelector
                selectedTransport={groundTransport}
                onTransportChange={setGroundTransport}
              />

              <DiningOptionsSelector
                selectedDining={dining}
                onDiningChange={setDining}
              />
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <PaymentSummary
                flightCost={costs.flightCost}
                groundTransport={costs.groundTransport}
                dining={costs.dining}
                onBooking={handleBooking}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
