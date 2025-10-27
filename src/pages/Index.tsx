import { useState, useEffect } from "react";
import { Plane, LogOut, User, ArrowLeftRight, ArrowDownUp } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import heroImage from "@/assets/hero-evtol.jpg";
import { Button } from "@/components/ui/button";
import { LocationInput } from "@/components/LocationInput";
import { VertiportSelector } from "@/components/VertiportSelector";
import { ServiceAreaSelector } from "@/components/ServiceAreaSelector";
import { RideTypeSelector } from "@/components/RideTypeSelector";
import { ScheduleSelector } from "@/components/ScheduleSelector";
import { PassengerWeightForm, DiningSelection, standardMenuOptions, CUSTOM_CATERING_PRICE } from "@/components/PassengerWeightForm";
import { PaymentSummary } from "@/components/PaymentSummary";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceArea, setServiceArea] = useState("San Francisco Bay Area");
  const [pickup, setPickup] = useState("");
  const [pickupZipcode, setPickupZipcode] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationZipcode, setDestinationZipcode] = useState("");
  const [rideType, setRideType] = useState<"on-demand" | "scheduled">("on-demand");
  const [datetime, setDateTime] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengerWeights, setPassengerWeights] = useState<string[]>(["150"]);
  const [luggageWeights, setLuggageWeights] = useState<string[]>(["25"]);
  const [groundTransport, setGroundTransport] = useState<string>("");
  const [diningSelections, setDiningSelections] = useState<DiningSelection[]>([{ type: "none" }]);
  const [flightCost, setFlightCost] = useState(0);

  // Check authentication status and redirect if not logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login to access the booking page");
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate("/auth");
        }
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Restore booking data from navigation state (when coming back from review page)
  useEffect(() => {
    const bookingData = location.state as any;
    if (bookingData) {
      setPickup(bookingData.pickup_location || "");
      setDestination(bookingData.destination || "");
      setRideType(bookingData.ride_type || "on-demand");
      
      // Restore datetime from separate date and time fields
      if (bookingData.scheduled_date && bookingData.scheduled_time) {
        setDateTime(`${bookingData.scheduled_date}T${bookingData.scheduled_time}`);
      }
      
      setPassengerCount(bookingData.passenger_count || 1);
      setPassengerWeights(bookingData.passenger_weights || ["150"]);
      setLuggageWeights(bookingData.luggage_weights || ["25"]);
      setGroundTransport(bookingData.ground_transport || "");
      setDiningSelections(bookingData.dining_selections || [{ type: "none" }]);
      
      // Restore zipcode states for vertiports
      setPickupZipcode(bookingData.pickup_zipcode || "");
      setDestinationZipcode(bookingData.destination_zipcode || "");
      
      // Clear the state so it doesn't persist on future visits
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  // Check for matching vertiports and auto-switch if needed
  useEffect(() => {
    const checkAndUpdateMatchingVertiports = async () => {
      if (pickup && destination && pickup === destination) {
        // Fetch vertiports to find next available option
        const { data: zipcodeData } = await supabase
          .from('zipcodes')
          .select('vertiport_id, service_area_name')
          .eq('zipcode', destinationZipcode)
          .maybeSingle();
        
        if (zipcodeData) {
          const { data: serviceAreaVertiportIds } = await supabase
            .from('zipcodes')
            .select('vertiport_id')
            .eq('service_area_name', zipcodeData.service_area_name);
          
          if (serviceAreaVertiportIds && serviceAreaVertiportIds.length > 0) {
            const validVertiportIds = [...new Set(serviceAreaVertiportIds.map(z => z.vertiport_id))];
            const nextVertiport = validVertiportIds.find(id => id !== pickup);
            if (nextVertiport) {
              setDestination(nextVertiport);
            }
          }
        }
      }
    };
    
    checkAndUpdateMatchingVertiports();
  }, [pickup, destination, destinationZipcode]);

  // Calculate flight cost based on distance whenever pickup or destination changes
  useEffect(() => {
    const calculateFlightCost = async () => {
      if (!pickup || !destination) {
        setFlightCost(0);
        return;
      }
      
      try {
        // Fetch both vertiports
        const { data: vertiports } = await supabase
          .from('vertiports')
          .select('id, latitude, longitude')
          .in('id', [pickup, destination]);
        
        if (!vertiports || vertiports.length !== 2) {
          setFlightCost(0);
          return;
        }
        
        const pickupPort = vertiports.find(v => v.id === pickup);
        const destPort = vertiports.find(v => v.id === destination);
        
        if (!pickupPort || !destPort) {
          setFlightCost(0);
          return;
        }
        
        // Calculate distance using Haversine formula
        const R = 3959; // Earth's radius in miles
        const lat1 = Number(pickupPort.latitude);
        const lng1 = Number(pickupPort.longitude);
        const lat2 = Number(destPort.latitude);
        const lng2 = Number(destPort.longitude);
        
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = 
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        
        // Price per mile: $2.50 per mile with a minimum of $150
        const pricePerMile = 2.5;
        const basePricePerPassenger = Math.max(150, Math.round(distance * pricePerMile));
        
        // Progressive discount pricing: 1st passenger full price, subsequent passengers get discounts
        let totalFlightCost = 0;
        
        for (let i = 1; i <= passengerCount; i++) {
          if (i === 1) {
            totalFlightCost += basePricePerPassenger; // Full price
          } else if (i === 2) {
            totalFlightCost += Math.round(basePricePerPassenger * 0.83); // ~17% discount
          } else if (i === 3) {
            totalFlightCost += Math.round(basePricePerPassenger * 0.67); // ~33% discount
          } else {
            totalFlightCost += Math.round(basePricePerPassenger * 0.50); // 50% discount for 4th+ passengers
          }
        }
        
        setFlightCost(totalFlightCost);
      } catch (error) {
        console.error('Error calculating flight cost:', error);
        setFlightCost(0);
      }
    };
    
    calculateFlightCost();
  }, [pickup, destination, passengerCount]);

  const calculateCosts = () => {
    const transportCost = !groundTransport || groundTransport === "none" ? 0 : groundTransport === "standard" ? 75 : groundTransport === "luxury" ? 150 : groundTransport === "electric" ? 90 : 0;
    
    // Calculate total dining cost across all passengers
    const diningCost = diningSelections.reduce((total, selection) => {
      if (selection.type === "standard" && selection.standardOptions) {
        return total + selection.standardOptions.reduce((optTotal, optId) => {
          const option = standardMenuOptions.find(opt => opt.id === optId);
          return optTotal + (option?.price || 0);
        }, 0);
      } else if (selection.type === "custom") {
        // Flat rate for custom catering regardless of options selected
        return total + CUSTOM_CATERING_PRICE;
      }
      return total;
    }, 0);
    
    return { flightCost, groundTransport: transportCost, dining: diningCost };
  };

  const handleBooking = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to book a flight");
      navigate("/auth");
      return;
    }

    if (!pickup || !destination) {
      toast.error("Please enter pickup and destination locations");
      return;
    }
    if (rideType === "scheduled" && !datetime) {
      toast.error("Please select date and time for scheduled flight");
      return;
    }

    // Navigate to review page with booking data
    const { flightCost: calculatedFlightCost, groundTransport: groundTransportCost, dining: diningCost } = costs;
    const totalCost = calculatedFlightCost + groundTransportCost + diningCost;
    
    // Split datetime into date and time for storage
    let scheduledDate = null;
    let scheduledTime = null;
    if (rideType === "scheduled" && datetime) {
      const [datePart, timePart] = datetime.split("T");
      scheduledDate = datePart;
      scheduledTime = timePart;
    }
    
    const bookingData = {
      pickup_location: pickup,
      destination: destination,
      ride_type: rideType,
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
      passenger_count: passengerCount,
      passenger_weights: passengerWeights,
      luggage_weights: luggageWeights,
      ground_transport: groundTransport,
      dining_selections: diningSelections,
      flight_cost: calculatedFlightCost,
      ground_transport_cost: groundTransportCost,
      dining_cost: diningCost,
      total_cost: totalCost,
      pickup_zipcode: pickupZipcode,
      destination_zipcode: destinationZipcode,
    };
    
    // Pass data via navigation state
    navigate("/review-and-pay", { state: bookingData });
  };

  const handleLogout = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Manually clear any remaining auth data from localStorage
    localStorage.removeItem('sb-zncnvilkgpoolkcycsjd-auth-token');
    
    // Clear local state
    setUser(null);
    
    // Show success and navigate
    toast.success("Logged out successfully");
    
    // Use setTimeout to ensure state is cleared before navigation
    setTimeout(() => {
      navigate("/auth", { replace: true });
    }, 100);
  };

  const handleSwapVertiports = () => {
    // Swap the vertiport selections and zipcodes
    const tempVertiport = pickup;
    const tempZipcode = pickupZipcode;
    
    setPickup(destination);
    setPickupZipcode(destinationZipcode);
    setDestination(tempVertiport);
    setDestinationZipcode(tempZipcode);
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
              onClick={() => navigate("/auth")}
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
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-2xl font-bold">Book Your Flight</h2>
                <ServiceAreaSelector
                  value={serviceArea}
                  onChange={(newArea) => {
                    setServiceArea(newArea);
                    // Clear selections when service area changes
                    setPickup("");
                    setPickupZipcode("");
                    setDestination("");
                    setDestinationZipcode("");
                  }}
                />
              </div>

              <RideTypeSelector value={rideType} onChange={setRideType} />

              <div className="relative">
                <div className="grid md:grid-cols-2 gap-4">
                  <VertiportSelector
                    label="Pickup Vertiport"
                    value={pickup}
                    onChange={setPickup}
                    zipcode={pickupZipcode}
                    onZipcodeChange={setPickupZipcode}
                    serviceArea={serviceArea}
                    otherVertiportValue={destination}
                  />
                  
                  {/* Swap Button - Mobile (between sections) */}
                  <div className="flex justify-center md:hidden -my-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleSwapVertiports}
                      disabled={!pickup || !destination}
                      className="h-10 w-10 rounded-full bg-background shadow-lg border-2 hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                      aria-label="Swap pickup and destination"
                    >
                      <ArrowDownUp className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <VertiportSelector
                    label="Destination Vertiport"
                    value={destination}
                    onChange={setDestination}
                    zipcode={destinationZipcode}
                    onZipcodeChange={setDestinationZipcode}
                    serviceArea={serviceArea}
                    otherVertiportValue={pickup}
                  />
                </div>
                
                {/* Swap Button - Desktop (centered between columns) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleSwapVertiports}
                    disabled={!pickup || !destination}
                    className="h-10 w-10 rounded-full bg-background shadow-lg border-2 hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                    aria-label="Swap pickup and destination"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {rideType === "scheduled" && (
                <ScheduleSelector
                  datetime={datetime}
                  onDateTimeChange={setDateTime}
                />
              )}

              <PassengerWeightForm
                passengerCount={passengerCount}
                onPassengerCountChange={(count) => {
                  setPassengerCount(count);
                  // Resize arrays when passenger count changes with default values
                  setPassengerWeights(prev => {
                    const newWeights = [...prev];
                    while (newWeights.length < count) newWeights.push("150");
                    return newWeights.slice(0, count);
                  });
                  setLuggageWeights(prev => {
                    const newWeights = [...prev];
                    while (newWeights.length < count) newWeights.push("25");
                    return newWeights.slice(0, count);
                  });
                  setDiningSelections(prev => {
                    const newSelections = [...prev];
                    while (newSelections.length < count) newSelections.push({ type: "none" });
                    return newSelections.slice(0, count);
                  });
                }}
                passengerWeights={passengerWeights}
                onPassengerWeightsChange={setPassengerWeights}
                luggageWeights={luggageWeights}
                onLuggageWeightsChange={setLuggageWeights}
                diningSelections={diningSelections}
                onDiningSelectionsChange={setDiningSelections}
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
            passengerCount={passengerCount}
            diningSelections={diningSelections}
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
