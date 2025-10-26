import { MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

interface VertiportSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

interface Vertiport {
  id: string;
  name: string;
  city: string;
  state: string;
  coordinates: { lat: number; lng: number };
}

// Available vertiports across major cities
const vertiports: Vertiport[] = [
  { id: "sfo-downtown", name: "San Francisco Downtown Vertiport", city: "San Francisco", state: "CA", coordinates: { lat: 37.7749, lng: -122.4194 } },
  { id: "sfo-airport", name: "SFO Airport Vertiport", city: "San Francisco", state: "CA", coordinates: { lat: 37.6213, lng: -122.3790 } },
  { id: "oak-downtown", name: "Oakland Downtown Vertiport", city: "Oakland", state: "CA", coordinates: { lat: 37.8044, lng: -122.2712 } },
  { id: "sjc-downtown", name: "San Jose Downtown Vertiport", city: "San Jose", state: "CA", coordinates: { lat: 37.3382, lng: -121.8863 } },
  { id: "la-downtown", name: "Los Angeles Downtown Vertiport", city: "Los Angeles", state: "CA", coordinates: { lat: 34.0522, lng: -118.2437 } },
  { id: "la-lax", name: "LAX Airport Vertiport", city: "Los Angeles", state: "CA", coordinates: { lat: 33.9416, lng: -118.4085 } },
  { id: "sd-downtown", name: "San Diego Downtown Vertiport", city: "San Diego", state: "CA", coordinates: { lat: 32.7157, lng: -117.1611 } },
  { id: "nyc-manhattan", name: "Manhattan Downtown Vertiport", city: "New York", state: "NY", coordinates: { lat: 40.7128, lng: -74.0060 } },
  { id: "nyc-jfk", name: "JFK Airport Vertiport", city: "New York", state: "NY", coordinates: { lat: 40.6413, lng: -73.7781 } },
  { id: "miami-downtown", name: "Miami Downtown Vertiport", city: "Miami", state: "FL", coordinates: { lat: 25.7617, lng: -80.1918 } },
  { id: "chicago-downtown", name: "Chicago Downtown Vertiport", city: "Chicago", state: "IL", coordinates: { lat: 41.8781, lng: -87.6298 } },
  { id: "seattle-downtown", name: "Seattle Downtown Vertiport", city: "Seattle", state: "WA", coordinates: { lat: 47.6062, lng: -122.3321 } },
];

export const VertiportSelector = ({ label, value, onChange }: VertiportSelectorProps) => {
  const [sortedVertiports, setSortedVertiports] = useState(vertiports);

  useEffect(() => {
    // Try to get user's location and sort vertiports by distance
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          // Calculate distance and sort
          const sorted = [...vertiports].sort((a, b) => {
            const distA = Math.sqrt(
              Math.pow(a.coordinates.lat - userLat, 2) + 
              Math.pow(a.coordinates.lng - userLng, 2)
            );
            const distB = Math.sqrt(
              Math.pow(b.coordinates.lat - userLat, 2) + 
              Math.pow(b.coordinates.lng - userLng, 2)
            );
            return distA - distB;
          });
          
          setSortedVertiports(sorted);
        },
        () => {
          // If location access denied, keep default order
          setSortedVertiports(vertiports);
        }
      );
    }
  }, []);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        {label}
      </Label>
      <div className="ml-6">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="h-12 bg-card border-border focus:border-primary transition-colors">
            <SelectValue placeholder="Select a vertiport" />
          </SelectTrigger>
          <SelectContent className="z-50">
            {sortedVertiports.map((vertiport) => (
              <SelectItem key={vertiport.id} value={vertiport.id}>
                {vertiport.name} ({vertiport.city}, {vertiport.state})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

