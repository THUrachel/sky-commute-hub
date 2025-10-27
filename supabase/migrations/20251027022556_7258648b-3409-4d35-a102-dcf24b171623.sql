-- Add service_area_name column to zipcodes table
ALTER TABLE public.zipcodes 
ADD COLUMN service_area_name TEXT;

-- Update NYC zipcodes (all 5 boroughs)
UPDATE public.zipcodes 
SET service_area_name = 'New York City'
WHERE borough IN ('Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island');

-- Update Greater Seattle zipcodes (all WA zipcodes)
UPDATE public.zipcodes 
SET service_area_name = 'Greater Seattle'
WHERE vertiport_id IN (
  SELECT id FROM public.vertiports WHERE state = 'WA'
);