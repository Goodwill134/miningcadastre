import {
  getAllMines,
  createMine,
  createMiningClaim,
  getAllMiningClaims,
  listPublicTables, // Ensure this is imported
  createOwner,
  getAllOwners,
  getOwnerById,
  updateOwner,
  deleteOwner,
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

  // Owner routes
  fastify.get('/api/owners', async (request, reply) => {
    try {
      const result = await getAllOwners();
      reply.send(result.rows);
    } catch (error) {
      request.log.error('Error fetching all owners:', error);
      reply.status(500).send({ error: 'Failed to fetch owners' });
    }
  });

  fastify.get('/api/owners/:id', async (request, reply) => {
    const { id } = request.params;
    try {
      const result = await getOwnerById(id);
      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Owner not found' });
      }
      reply.send(result.rows[0]);
    } catch (error) {
      request.log.error(`Error fetching owner ${id}:`, error);
      reply.status(500).send({ error: 'Failed to fetch owner' });
    }
  });

  fastify.post('/api/owners', async (request, reply) => {
    const { name, contact_info, address } = request.body;
    if (!name) {
        return reply.status(400).send({ error: 'Missing required owner field: name' });
    }
    try {
      const result = await createOwner(name, contact_info, address);
      reply.status(201).send(result.rows[0]);
    } catch (error) {
      request.log.error('Error creating owner:', error);
      reply.status(500).send({ error: 'Failed to create owner', details: error.message });
    }
  });

  fastify.put('/api/owners/:id', async (request, reply) => {
    const { id } = request.params;
    const { name, contact_info, address } = request.body;
     if (!name) {
        return reply.status(400).send({ error: 'Missing required owner field: name' });
    }
    try {
      const result = await updateOwner(id, name, contact_info, address);
       if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Owner not found for update' });
      }
      reply.send(result.rows[0]);
    } catch (error) {
      request.log.error(`Error updating owner ${id}:`, error);
      reply.status(500).send({ error: 'Failed to update owner', details: error.message });
    }
  });

  fastify.delete('/api/owners/:id', async (request, reply) => {
    const { id } = request.params;
    try {
      const result = await deleteOwner(id);
      if (result.rowCount === 0) {
        return reply.status(404).send({ error: 'Owner not found for deletion' });
      }
      reply.status(204).send();
    } catch (error) {
      request.log.error(`Error deleting owner ${id}:`, error);
      reply.status(500).send({ error: 'Failed to delete owner' });
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
