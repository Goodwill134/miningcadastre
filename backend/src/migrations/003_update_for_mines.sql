-- Drop old tables that are no longer needed
BEGIN;

-- =============================================
-- Remove legacy tables no longer needed
-- =============================================
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS parcels;
DROP TABLE IF EXISTS owners;

-- =============================================
-- Optimize mines table for performance
-- =============================================
-- Spatial index for geometric queries
CREATE INDEX IF NOT EXISTS idx_mines_geom ON mines USING GIST(geom);

-- Indexes for frequently queried fields
CREATE INDEX IF NOT EXISTS idx_mines_licence_no ON mines("Licence No");
CREATE INDEX IF NOT EXISTS idx_mines_district ON mines("District");

-- =============================================
-- Optional: Add new columns if needed
-- =============================================
-- ALTER TABLE mines ADD COLUMN IF NOT EXISTS status VARCHAR(50);
-- ALTER TABLE mines ADD COLUMN IF NOT EXISTS expiration_date DATE;
-- ALTER TABLE mines ADD COLUMN IF NOT EXISTS production_capacity NUMERIC;

COMMIT;

-- Note: Add corresponding DROP INDEX statements in undo script if needed
