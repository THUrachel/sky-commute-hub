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
}

// Available vertiports across major cities with their zipcode coverage
const vertiports: Vertiport[] = [
  { id: "sfo-downtown", name: "San Francisco Downtown Vertiport", city: "San Francisco", state: "CA", zipcodeRanges: ["941"] },
  { id: "sfo-airport", name: "SFO Airport Vertiport", city: "San Francisco", state: "CA", zipcodeRanges: ["941", "943", "944"] },
  { id: "oak-downtown", name: "Oakland Downtown Vertiport", city: "Oakland", state: "CA", zipcodeRanges: ["946"] },
  { id: "sjc-downtown", name: "San Jose Downtown Vertiport", city: "San Jose", state: "CA", zipcodeRanges: ["950", "951", "952", "953", "954", "955"] },
  { id: "la-downtown", name: "Los Angeles Downtown Vertiport", city: "Los Angeles", state: "CA", zipcodeRanges: ["900", "901", "902"] },
  { id: "la-lax", name: "LAX Airport Vertiport", city: "Los Angeles", state: "CA", zipcodeRanges: ["900", "901", "902", "903", "904", "905"] },
  { id: "sd-downtown", name: "San Diego Downtown Vertiport", city: "San Diego", state: "CA", zipcodeRanges: ["919", "920", "921"] },
  { id: "nyc-manhattan", name: "Manhattan Downtown Vertiport", city: "New York", state: "NY", zipcodeRanges: ["100", "101", "102"] },
  { id: "nyc-jfk", name: "JFK Airport Vertiport", city: "New York", state: "NY", zipcodeRanges: ["100", "101", "102", "103", "104", "110", "111", "112", "113", "114", "115", "116"] },
  { id: "miami-downtown", name: "Miami Downtown Vertiport", city: "Miami", state: "FL", zipcodeRanges: ["331", "332", "333"] },
  { id: "chicago-downtown", name: "Chicago Downtown Vertiport", city: "Chicago", state: "IL", zipcodeRanges: ["606", "607", "608"] },
  { id: "seattle-downtown", name: "Seattle Downtown Vertiport", city: "Seattle", state: "WA", zipcodeRanges: ["981"] },
  { id: "seattle-seatac", name: "Sea-Tac Airport Vertiport", city: "SeaTac", state: "WA", zipcodeRanges: ["981", "988"] },
  { id: "bellevue-downtown", name: "Bellevue Downtown Vertiport", city: "Bellevue", state: "WA", zipcodeRanges: ["980"] },
  { id: "tacoma-downtown", name: "Tacoma Downtown Vertiport", city: "Tacoma", state: "WA", zipcodeRanges: ["984"] },
  { id: "everett-downtown", name: "Everett Downtown Vertiport", city: "Everett", state: "WA", zipcodeRanges: ["982"] },
  { id: "redmond-tech", name: "Redmond Tech Hub Vertiport", city: "Redmond", state: "WA", zipcodeRanges: ["980"] },
];

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
    
    // Filter vertiports by zipcode ranges or state
    const filtered = vertiports.filter(vertiport => {
      // Check if zipcode prefix matches any of the vertiport's coverage areas
      const matchesZipcode = vertiport.zipcodeRanges.some(range => prefix.startsWith(range));
      // Or if the vertiport is in the same state
      const matchesState = states.includes(vertiport.state);
      
      return matchesZipcode || matchesState;
    });

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

