-- Add vertiports for remaining NYC boroughs
INSERT INTO public.vertiports (id, name, city, state, latitude, longitude) VALUES
  ('nyc-brooklyn', 'Brooklyn Downtown Vertiport', 'Brooklyn', 'NY', 40.6782, -73.9442),
  ('nyc-queens', 'Queens Center Vertiport', 'Queens', 'NY', 40.7282, -73.7949),
  ('nyc-bronx', 'Bronx Hub Vertiport', 'Bronx', 'NY', 40.8448, -73.8648),
  ('nyc-staten', 'Staten Island Vertiport', 'Staten Island', 'NY', 40.5795, -74.1502);

-- Update Brooklyn zipcodes to use Brooklyn vertiport
UPDATE public.zipcodes 
SET vertiport_id = 'nyc-brooklyn' 
WHERE borough = 'Brooklyn';

-- Update Queens zipcodes to use Queens vertiport
UPDATE public.zipcodes 
SET vertiport_id = 'nyc-queens' 
WHERE borough = 'Queens';

-- Update Bronx zipcodes to use Bronx vertiport
UPDATE public.zipcodes 
SET vertiport_id = 'nyc-bronx' 
WHERE borough = 'Bronx';

-- Update Staten Island zipcodes to use Staten Island vertiport
UPDATE public.zipcodes 
SET vertiport_id = 'nyc-staten' 
WHERE borough = 'Staten Island';