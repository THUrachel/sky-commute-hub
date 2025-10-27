-- Update service area name from "Greater Seattle" to "Greater Seattle Area"
UPDATE zipcodes 
SET service_area_name = 'Greater Seattle Area' 
WHERE service_area_name = 'Greater Seattle';