import { Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ServiceAreaSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ServiceAreaSelector = ({ value, onChange }: ServiceAreaSelectorProps) => {
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);

  useEffect(() => {
    const fetchServiceAreas = async () => {
      const { data, error } = await supabase
        .from('zipcodes')
        .select('service_area_name')
        .not('service_area_name', 'is', null);
      
      if (data && !error) {
        // Get unique service area names
        const uniqueAreas = Array.from(new Set(data.map(item => item.service_area_name).filter(Boolean))) as string[];
        setServiceAreas(uniqueAreas.sort());
        
        // Auto-select if only one service area exists
        if (uniqueAreas.length === 1 && !value) {
          onChange(uniqueAreas[0]);
        }
      }
    };
    
    fetchServiceAreas();
  }, []);

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg border-2 border-accent/50 bg-accent/5 transition-all hover:border-accent">
      <Globe className="h-4 w-4 text-accent" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 w-[200px] bg-background border-2 border-accent/30 focus:border-accent transition-colors font-semibold">
          <SelectValue placeholder="Select service area" />
        </SelectTrigger>
        <SelectContent className="z-50 bg-popover">
          {serviceAreas.map((area) => (
            <SelectItem key={area} value={area} className="font-medium">
              {area}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
