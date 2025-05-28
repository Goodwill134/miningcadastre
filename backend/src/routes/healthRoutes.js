module.exports = async function healthRoutes(fastify) {
  fastify.get('/health', async (request, reply) => {
    try {
      // Test database connection
      await fastify.db.query('SELECT 1');
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected'
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return reply.status(503).send({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed'
      });
    }
  });
};
