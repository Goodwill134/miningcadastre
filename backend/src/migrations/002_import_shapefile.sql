-- Import shapefile data using QGIS
-- This script assumes you have imported the shapefile into QGIS and saved it to the database

-- No table creation needed since QGIS will handle it
-- The parcels table will be created with proper PostGIS geometry type

-- Insert data into the main parcels table
INSERT INTO parcels (
    id,
    parcel_number,
    area,
    geometry,
    owner,
    address,
    usage,
    created_at,
    updated_at
)
SELECT 
    id,
    parcel_number,
    area,
    geometry,
    owner,
    address,
    usage,
    created_at,
    updated_at
FROM temp_parcels;

-- Clean up
DROP TABLE temp_parcels;
