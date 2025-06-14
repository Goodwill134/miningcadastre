import { Pool } from 'pg';

// Database connection pool
const poolConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000 // Return an error after 5 seconds if connection could not be established
};

// console.log('DEBUG_DB_JS: Pool configuration about to be used:', poolConfig);

const pool = new Pool(poolConfig);

// Basic query function with error handling
export const query = async (
  sql,
  values = []
) => {
  try {
    const client = await pool.connect()
    try {
      const result = await client.query(sql, values)
      return result
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
}

// Transaction support
export const transaction = async (
  callback
) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Transaction error:', error)
    throw error
  } finally {
    client.release()
  }
}

// Mining claim operations
export const createMiningClaim = async (claimNumber, claimType, status, holder, geometry) => {
  const sql = `
    INSERT INTO mining_claims (claim_number, claim_type, status, holder, geometry)
    VALUES ($1, $2, $3, $4, ST_GeomFromGeoJSON($5))
    RETURNING *
  `;
  return query(sql, [claimNumber, claimType, status, holder, geometry]);
};

export const getAllMiningClaims = async () => {
  const sql = `
    SELECT id, claim_number, claim_type, status, holder, ST_AsGeoJSON(geometry) as geometry, created_at, updated_at
    FROM mining_claims
  `;
  return query(sql);
};

// Mine operations
export const getAllMines = async () => {
  const sql = `
    SELECT 
      id,
      "Mine Name" as mine_name,
      "Mineral",
      "Area",
      "District",
      "Licence No" as licence_no,
      "Mine No" as mine_no,
      "Rights",
      "Ristrictns" as restrictions,
      ST_AsGeoJSON(geom) as geometry
    FROM mines
  `;
  return query(sql);
};

export const createMine = async (mineData) => {
  const sql = `
    INSERT INTO mines (
      "Mine Name",
      "Mineral",
      "Area",
      "District",
      "Licence No",
      "Mine No",
      "Rights",
      "Ristrictns",
      geom
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ST_GeomFromGeoJSON($9))
    RETURNING *
  `;
  return query(sql, [
    mineData.mineName,
    mineData.mineral,
    mineData.area,
    mineData.district,
    mineData.licenceNo,
    mineData.mineNo,
    mineData.rights,
    mineData.restrictions,
    mineData.geometry
  ]);
};

// Initialize database
export const initDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Ensure spatial index exists for mines table
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_mines_geom ON mines USING GIST(geom);
    `);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Test function to list tables in the public schema
export const listPublicTables = async () => {
  const sql = `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';`;
  return query(sql);
};

// Close the pool when the application ends
process.on('SIGINT', () => {
  pool.end()
  process.exit(0)
})

process.on('SIGTERM', () => {
  pool.end()
  process.exit(0)
})
