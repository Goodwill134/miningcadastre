BEGIN;

-- Remove indexes added in 003
DROP INDEX IF EXISTS idx_mines_geom;
DROP INDEX IF EXISTS idx_mines_licence_no;
DROP INDEX IF EXISTS idx_mines_district;

-- Recreate old tables (basic structure only)
CREATE TABLE parcels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_number VARCHAR(50) UNIQUE NOT NULL,
    geometry GEOMETRY(POLYGON, 4326)
);

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id UUID REFERENCES parcels(id)
);

CREATE TABLE owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL
);

-- Recreate old indexes
CREATE INDEX idx_parcels_geometry ON parcels USING GIST(geometry);
CREATE INDEX idx_properties_parcel_id ON properties(parcel_id);

COMMIT;
