import {
  getAllMines,
  createMine,
  createMiningClaim,
  getAllMiningClaims,
  listPublicTables, // Ensure this is imported
  query
} from '../utils/db.js';

// Default export for Fastify routes plugin
export default async function (fastify, opts) {
  // Health check (example, keep if you have one)
  fastify.get('/api/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Test route to list tables
  fastify.get('/api/test-db-tables', async (request, reply) => {
    try {
      const result = await listPublicTables();
      reply.send(result.rows.map(row => row.tablename));
    } catch (error) {
      request.log.error('Error listing tables:', error); // Use request.log for Fastify
      reply.status(500).send({ error: 'Failed to list tables', details: error.message });
    }
  });

  // Mining claim routes
  fastify.get('/api/mining-claims', async (request, reply) => {
    try {
      const result = await getAllMiningClaims();
      return result.rows;
    } catch (error) {
      request.log.error('Error fetching mining claims:', error);
      reply.status(500).send({ error: 'Failed to fetch mining claims' });
    }
  });

  fastify.post('/api/mining-claims', async (request, reply) => {
    try {
      const { claimNumber, claimType, status, holder, geometry } = request.body;
      const result = await createMiningClaim(claimNumber, claimType, status, holder, geometry);
      return result.rows[0];
    } catch (error) {
      request.log.error('Error creating mining claim:', error);
      reply.status(500).send({ error: 'Failed to create mining claim' });
    }
  });

  // Mine routes
  fastify.get('/api/mines', async (request, reply) => {
    try {
      const result = await getAllMines();
      reply.send(result.rows);
    } catch (error) {
      request.log.error('Error fetching mines:', error);
      reply.status(500).send({ error: 'Failed to fetch mines' });
    }
  });

  fastify.post('/api/mines', async (request, reply) => {
    try {
      const result = await createMine(request.body);
      reply.status(201).send(result.rows[0]);
    } catch (error) {
      request.log.error('Error creating mine:', error);
      reply.status(500).send({ 
        error: 'Failed to create mine',
        details: error.message 
      });
    }
  });

  // Preci Parcels route (Fastify style)
  fastify.get('/api/preci-parcels', async (request, reply) => {
    try {
      const result = await query(`
        SELECT id, "HouseNumbe", "Landuse", address, "parcelId",
               ST_AsGeoJSON(geom)::json AS geometry
        FROM "public"."preci|option:ADJUST_TYPE=YES|option:ADJUST_GEOM_TYPE=ALL_SHAPES"
      `);
      reply.send(result.rows);
    } catch (error) {
      request.log.error('Error fetching preci parcels:', error);
      reply.status(500).send({ error: 'Failed to fetch preci parcels', details: error.message });
    }
  });

  // Graceful shutdown, etc.
  // done(); // This might be needed depending on your Fastify plugin structure
}
