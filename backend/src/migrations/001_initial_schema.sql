-- Create parcels table
CREATE TABLE parcels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_number VARCHAR(50) UNIQUE NOT NULL,
    area DECIMAL(10,2) NOT NULL,
    geometry GEOMETRY(POLYGON, 4326),
    owner VARCHAR(100),
    address TEXT,
    usage VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial index for parcels
CREATE INDEX idx_parcels_geometry ON parcels USING GIST(geometry);

-- Create properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id UUID REFERENCES parcels(id) ON DELETE CASCADE,
    building_number VARCHAR(20),
    street_name VARCHAR(100),
    postal_code VARCHAR(10),
    city VARCHAR(100),
    property_type VARCHAR(20) CHECK (property_type IN ('RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'AGRICULTURAL')),
    construction_year INTEGER,
    floors INTEGER,
    area DECIMAL(10,2),
    value DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial index for properties
CREATE INDEX idx_properties_parcel_id ON properties(parcel_id);

-- Create owners table
CREATE TABLE owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    identification_number VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    email VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_owners_identification_number ON owners(identification_number);
