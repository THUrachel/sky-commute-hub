-- Update all zipcodes to use standardized vertiport IDs
UPDATE zipcodes SET vertiport_id = 'SFO' WHERE vertiport_id IN ('sf-downtown', 'sf-sfo');
UPDATE zipcodes SET vertiport_id = 'OAK' WHERE vertiport_id = 'oakland-downtown';
UPDATE zipcodes SET vertiport_id = 'SJC' WHERE vertiport_id = 'san-jose-central';
UPDATE zipcodes SET vertiport_id = 'PAO' WHERE vertiport_id = 'palo-alto';

-- Delete duplicate vertiports
DELETE FROM vertiports WHERE id IN ('sf-downtown', 'sf-sfo', 'oakland-downtown', 'san-jose-central', 'palo-alto');