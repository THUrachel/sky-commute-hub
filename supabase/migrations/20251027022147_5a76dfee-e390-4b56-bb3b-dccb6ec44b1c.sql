-- Add Kirkland vertiport
INSERT INTO public.vertiports (id, name, city, state, latitude, longitude) VALUES
  ('kirkland-downtown', 'Kirkland Downtown Vertiport', 'Kirkland', 'WA', 47.6815, -122.2087);

-- Update Kirkland and nearby zipcodes to use the new vertiport
UPDATE public.zipcodes 
SET vertiport_id = 'kirkland-downtown' 
WHERE zipcode IN ('98033', '98034', '98072');

-- Also update some nearby Bellevue/Redmond zipcodes that are closer to Kirkland
UPDATE public.zipcodes 
SET vertiport_id = 'kirkland-downtown' 
WHERE zipcode IN ('98011', '98083');