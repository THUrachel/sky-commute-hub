import { useState } from "react";
import { Plane } from "lucide-react";
import { toast } from "sonner";
import heroImage from "@/assets/hero-evtol.jpg";
import { LocationInput } from "@/components/LocationInput";
import { RideTypeSelector } from "@/components/RideTypeSelector";
import { ScheduleSelector } from "@/components/ScheduleSelector";
import { PassengerWeightForm } from "@/components/PassengerWeightForm";
import { GroundTransportSelector } from "@/components/GroundTransportSelector";
import { DiningOptionsSelector } from "@/components/DiningOptionsSelector";
import { PaymentSummary } from "@/components/PaymentSummary";

const Index = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [rideType, setRideType] = useState<"on-demand" | "scheduled">("on-demand");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengerWeights, setPassengerWeights] = useState<string[]>([""]);
  const [luggageWeights, setLuggageWeights] = useState<string[]>([""]);
  const [groundTransport, setGroundTransport] = useState<string | null>(null);
  const [dining, setDining] = useState<string[]>([]);

  const calculateCosts = () => {
    const baseFlight = 299 * passengerCount;
    const transportCost = groundTransport === "none" ? 0 : groundTransport === "standard" ? 75 : groundTransport === "luxury" ? 150 : groundTransport === "electric" ? 90 : 0;
    const diningCost = dining.length * 45;
    return { flightCost: baseFlight, groundTransport: transportCost, dining: diningCost };
  };

  const handleBooking = () => {
    if (!pickup || !destination) {
      toast.error("Please enter pickup and destination locations");
      return;
    }
    if (rideType === "scheduled" && (!date || !time)) {
      toast.error("Please select date and time for scheduled flight");
      return;
    }
    toast.success("Booking confirmed! You'll receive a confirmation email shortly.");
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
                <LocationInput
                  label="Pickup Location"
                  placeholder="Enter pickup vertiport"
                  value={pickup}
                  onChange={setPickup}
                />
                <LocationInput
                  label="Destination"
                  placeholder="Enter destination vertiport"
                  value={destination}
                  onChange={setDestination}
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
