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
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface VertiportSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  zipcode: string;
  onZipcodeChange: (value: string) => void;
  serviceArea?: string;
}

interface Vertiport {
  id: string;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

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

export const VertiportSelector = ({ label, value, onChange, zipcode, onZipcodeChange, serviceArea }: VertiportSelectorProps) => {
  const [filteredVertiports, setFilteredVertiports] = useState<Vertiport[]>([]);
  const [allVertiports, setAllVertiports] = useState<Vertiport[]>([]);

  // Fetch all vertiports on mount
  useEffect(() => {
    const fetchVertiports = async () => {
      const { data, error } = await supabase
        .from('vertiports')
        .select('*');
      
      if (data && !error) {
        setAllVertiports(data);
      }
    };
    
    fetchVertiports();
  }, []);

  // Filter vertiports based on zipcode
  const filterVertiportsByZipcode = async (zip: string) => {
    if (!zip || zip.length < 5) {
      setFilteredVertiports([]);
      return;
    }

    // Build query with service area filter if provided
    let query = supabase
      .from('zipcodes')
      .select('vertiport_id, latitude, longitude, service_area_name')
      .eq('zipcode', zip);
    
    if (serviceArea) {
      query = query.eq('service_area_name', serviceArea);
    }
    
    const { data: zipcodeData, error } = await query.maybeSingle();

    if (error || !zipcodeData) {
      setFilteredVertiports([]);
      return;
    }

    // Get the associated vertiport and nearby vertiports
    const { data: nearbyVertiports } = await supabase
      .from('vertiports')
      .select('*');

    if (!nearbyVertiports) {
      setFilteredVertiports([]);
      return;
    }

    // Sort by distance from the zipcode
    const userLat = Number(zipcodeData.latitude);
    const userLng = Number(zipcodeData.longitude);
    
    const sorted = nearbyVertiports
      .map(vertiport => ({
        ...vertiport,
        distance: calculateDistance(
          userLat,
          userLng,
          Number(vertiport.latitude),
          Number(vertiport.longitude)
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5); // Show top 5 nearest vertiports

    setFilteredVertiports(sorted);
    
    // Auto-select the closest vertiport
    if (sorted.length > 0) {
      onChange(sorted[0].id);
    }
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

  // Show message if no service area selected
  if (!serviceArea) {
    return (
      <div className="space-y-3 opacity-50">
        <Label className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {label}
        </Label>
        <div className="ml-6 p-4 bg-muted/50 rounded-lg border border-dashed border-muted-foreground/20">
          <p className="text-sm text-muted-foreground text-center">
            Please select a service area first
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        {label}
      </Label>
      <div className="ml-6 space-y-3">
        <div>
          <Label htmlFor="zipcode" className="text-xs text-muted-foreground mb-1.5 block">
            Enter a Zipcode inside the Service Area
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

