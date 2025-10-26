import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Calendar } from "lucide-react";

interface RideTypeSelectorProps {
  value: "on-demand" | "scheduled";
  onChange: (value: "on-demand" | "scheduled") => void;
}

export const RideTypeSelector = ({ value, onChange }: RideTypeSelectorProps) => {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as "on-demand" | "scheduled")} className="w-full">
      <TabsList className="grid w-full grid-cols-2 h-12 bg-secondary">
        <TabsTrigger value="on-demand" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <Zap className="h-4 w-4" />
          Now
        </TabsTrigger>
        <TabsTrigger value="scheduled" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <Calendar className="h-4 w-4" />
          Scheduled
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
