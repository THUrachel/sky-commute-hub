import { MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface VertiportSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  zipcode: string;
  onZipcodeChange: (value: string) => void;
}

interface Vertiport {
  id: string;
  name: string;
  city: string;
  state: string;
  zipcodeRanges: string[];
  coordinates: { lat: number; lng: number };
}

// Available vertiports across major cities with their zipcode coverage
const vertiports: Vertiport[] = [
  { id: "sfo-downtown", name: "San Francisco Downtown Vertiport", city: "San Francisco", state: "CA", zipcodeRanges: ["941"], coordinates: { lat: 37.7749, lng: -122.4194 } },
  { id: "sfo-airport", name: "SFO Airport Vertiport", city: "San Francisco", state: "CA", zipcodeRanges: ["941", "943", "944"], coordinates: { lat: 37.6213, lng: -122.3790 } },
  { id: "oak-downtown", name: "Oakland Downtown Vertiport", city: "Oakland", state: "CA", zipcodeRanges: ["946"], coordinates: { lat: 37.8044, lng: -122.2712 } },
  { id: "sjc-downtown", name: "San Jose Downtown Vertiport", city: "San Jose", state: "CA", zipcodeRanges: ["950", "951", "952", "953", "954", "955"], coordinates: { lat: 37.3382, lng: -121.8863 } },
  { id: "la-downtown", name: "Los Angeles Downtown Vertiport", city: "Los Angeles", state: "CA", zipcodeRanges: ["900", "901", "902"], coordinates: { lat: 34.0522, lng: -118.2437 } },
  { id: "la-lax", name: "LAX Airport Vertiport", city: "Los Angeles", state: "CA", zipcodeRanges: ["900", "901", "902", "903", "904", "905"], coordinates: { lat: 33.9416, lng: -118.4085 } },
  { id: "sd-downtown", name: "San Diego Downtown Vertiport", city: "San Diego", state: "CA", zipcodeRanges: ["919", "920", "921"], coordinates: { lat: 32.7157, lng: -117.1611 } },
  { id: "nyc-manhattan", name: "Manhattan Downtown Vertiport", city: "New York", state: "NY", zipcodeRanges: ["100", "101", "102"], coordinates: { lat: 40.7128, lng: -74.0060 } },
  { id: "nyc-jfk", name: "JFK Airport Vertiport", city: "New York", state: "NY", zipcodeRanges: ["100", "101", "102", "103", "104", "110", "111", "112", "113", "114", "115", "116"], coordinates: { lat: 40.6413, lng: -73.7781 } },
  { id: "miami-downtown", name: "Miami Downtown Vertiport", city: "Miami", state: "FL", zipcodeRanges: ["331", "332", "333"], coordinates: { lat: 25.7617, lng: -80.1918 } },
  { id: "chicago-downtown", name: "Chicago Downtown Vertiport", city: "Chicago", state: "IL", zipcodeRanges: ["606", "607", "608"], coordinates: { lat: 41.8781, lng: -87.6298 } },
  { id: "seattle-downtown", name: "Seattle Downtown Vertiport", city: "Seattle", state: "WA", zipcodeRanges: ["981"], coordinates: { lat: 47.6062, lng: -122.3321 } },
  { id: "seattle-seatac", name: "Sea-Tac Airport Vertiport", city: "SeaTac", state: "WA", zipcodeRanges: ["981", "988"], coordinates: { lat: 47.4502, lng: -122.3088 } },
  { id: "bellevue-downtown", name: "Bellevue Downtown Vertiport", city: "Bellevue", state: "WA", zipcodeRanges: ["980"], coordinates: { lat: 47.6101, lng: -122.2015 } },
  { id: "tacoma-downtown", name: "Tacoma Downtown Vertiport", city: "Tacoma", state: "WA", zipcodeRanges: ["984"], coordinates: { lat: 47.2529, lng: -122.4443 } },
  { id: "everett-downtown", name: "Everett Downtown Vertiport", city: "Everett", state: "WA", zipcodeRanges: ["982"], coordinates: { lat: 47.9790, lng: -122.2021 } },
  { id: "redmond-tech", name: "Redmond Tech Hub Vertiport", city: "Redmond", state: "WA", zipcodeRanges: ["980"], coordinates: { lat: 47.6740, lng: -122.1215 } },
];

// Helper function to get approximate coordinates from zipcode prefix
const getZipcodeCoordinates = (zipcode: string): { lat: number; lng: number } | null => {
  const prefix = zipcode.substring(0, 3);
  
  // Map zipcode prefixes to approximate coordinates (center of region)
  const zipcodeMap: { [key: string]: { lat: number; lng: number } } = {
    // California
    "900": { lat: 34.0522, lng: -118.2437 }, // LA
    "901": { lat: 34.0522, lng: -118.2437 },
    "902": { lat: 34.0522, lng: -118.2437 },
    "903": { lat: 34.0522, lng: -118.2437 },
    "904": { lat: 34.0522, lng: -118.2437 },
    "905": { lat: 34.0522, lng: -118.2437 },
    "919": { lat: 32.7157, lng: -117.1611 }, // SD
    "920": { lat: 32.7157, lng: -117.1611 },
    "921": { lat: 32.7157, lng: -117.1611 },
    "941": { lat: 37.7749, lng: -122.4194 }, // SF
    "943": { lat: 37.7749, lng: -122.4194 },
    "944": { lat: 37.7749, lng: -122.4194 },
    "946": { lat: 37.8044, lng: -122.2712 }, // Oakland
    "950": { lat: 37.3382, lng: -121.8863 }, // San Jose
    "951": { lat: 37.3382, lng: -121.8863 },
    "952": { lat: 37.3382, lng: -121.8863 },
    "953": { lat: 37.3382, lng: -121.8863 },
    "954": { lat: 37.3382, lng: -121.8863 },
    "955": { lat: 37.3382, lng: -121.8863 },
    // New York
    "100": { lat: 40.7128, lng: -74.0060 },
    "101": { lat: 40.7128, lng: -74.0060 },
    "102": { lat: 40.7128, lng: -74.0060 },
    "103": { lat: 40.7128, lng: -74.0060 },
    "104": { lat: 40.7128, lng: -74.0060 },
    "110": { lat: 40.7128, lng: -74.0060 },
    "111": { lat: 40.7128, lng: -74.0060 },
    "112": { lat: 40.7128, lng: -74.0060 },
    "113": { lat: 40.7128, lng: -74.0060 },
    "114": { lat: 40.7128, lng: -74.0060 },
    "115": { lat: 40.7128, lng: -74.0060 },
    "116": { lat: 40.7128, lng: -74.0060 },
    // Florida
    "331": { lat: 25.7617, lng: -80.1918 }, // Miami
    "332": { lat: 25.7617, lng: -80.1918 },
    "333": { lat: 25.7617, lng: -80.1918 },
    // Illinois
    "606": { lat: 41.8781, lng: -87.6298 }, // Chicago
    "607": { lat: 41.8781, lng: -87.6298 },
    "608": { lat: 41.8781, lng: -87.6298 },
    // Washington
    "980": { lat: 47.6101, lng: -122.2015 }, // Bellevue/Redmond
    "981": { lat: 47.6062, lng: -122.3321 }, // Seattle
    "982": { lat: 47.9790, lng: -122.2021 }, // Everett
    "984": { lat: 47.2529, lng: -122.4443 }, // Tacoma
    "988": { lat: 47.4502, lng: -122.3088 }, // SeaTac
  };
  
  return zipcodeMap[prefix] || null;
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Helper function to get state from zipcode prefix
const getStateFromZipcode = (zipcode: string): string[] => {
  const prefix = zipcode.substring(0, 3);
  
  // Map zipcode prefixes to states
  if (prefix >= "900" && prefix <= "961") return ["CA"];
  if (prefix >= "100" && prefix <= "119") return ["NY"];
  if (prefix >= "330" && prefix <= "339") return ["FL"];
  if (prefix >= "600" && prefix <= "629") return ["IL"];
  if (prefix >= "980" && prefix <= "994") return ["WA"];
  
  return [];
};

export const VertiportSelector = ({ label, value, onChange, zipcode, onZipcodeChange }: VertiportSelectorProps) => {
  const [filteredVertiports, setFilteredVertiports] = useState<Vertiport[]>([]);

  // Filter vertiports based on zipcode
  const filterVertiportsByZipcode = (zip: string) => {
    if (!zip || zip.length < 3) {
      setFilteredVertiports([]);
      return;
    }

    const prefix = zip.substring(0, 3);
    const states = getStateFromZipcode(zip);
    const userCoords = getZipcodeCoordinates(zip);
    
    // Filter vertiports by zipcode ranges or state
    const filtered = vertiports.filter(vertiport => {
      const matchesZipcode = vertiport.zipcodeRanges.some(range => prefix.startsWith(range));
      const matchesState = states.includes(vertiport.state);
      return matchesZipcode || matchesState;
    });

    // Sort by distance if we have user coordinates
    if (userCoords && filtered.length > 0) {
      filtered.sort((a, b) => {
        const distA = calculateDistance(
          userCoords.lat,
          userCoords.lng,
          a.coordinates.lat,
          a.coordinates.lng
        );
        const distB = calculateDistance(
          userCoords.lat,
          userCoords.lng,
          b.coordinates.lat,
          b.coordinates.lng
        );
        return distA - distB;
      });
    }

    setFilteredVertiports(filtered);
  };

  const handleZipcodeChange = (newZipcode: string) => {
    // Only allow numeric input and limit to 5 digits
    const sanitized = newZipcode.replace(/\D/g, '').slice(0, 5);
    onZipcodeChange(sanitized);
    filterVertiportsByZipcode(sanitized);
    
    // Clear selected vertiport when zipcode changes
    if (value && sanitized !== zipcode) {
      onChange("");
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        {label}
      </Label>
      <div className="ml-6 space-y-3">
        <div>
          <Label htmlFor="zipcode" className="text-xs text-muted-foreground mb-1.5 block">
            Enter Your Zipcode
          </Label>
          <Input
            id="zipcode"
            type="text"
            inputMode="numeric"
            placeholder="e.g., 94102"
            value={zipcode}
            onChange={(e) => handleZipcodeChange(e.target.value)}
            className="h-12 bg-card border-border focus:border-primary transition-colors"
            maxLength={5}
          />
        </div>
        
        {zipcode.length >= 3 && (
          <div>
            <Label htmlFor="vertiport" className="text-xs text-muted-foreground mb-1.5 block">
              Select Vertiport
            </Label>
            <Select value={value} onValueChange={onChange} disabled={filteredVertiports.length === 0}>
              <SelectTrigger id="vertiport" className="h-12 bg-card border-border focus:border-primary transition-colors">
                <SelectValue placeholder={filteredVertiports.length === 0 ? "No vertiports available in this area" : "Select a vertiport"} />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover">
                {filteredVertiports.map((vertiport) => (
                  <SelectItem key={vertiport.id} value={vertiport.id}>
                    {vertiport.name} ({vertiport.city}, {vertiport.state})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

