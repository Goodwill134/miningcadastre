const fastify = require('fastify');
const { config } = require('./config/app');
const { pool, initDatabase } = require('./config/database');
const logger = require('./utils/logger');
const routes = require('./routes');

// Initialize app
const app = fastify({
  logger: {
    level: config.app.env === 'development' ? 'debug' : 'info'
  }
});

// Register routes
app.register(routes);

// Error handler
app.setErrorHandler((error, request, reply) => {
  logger.error(error);
  reply.status(500).send({ error: 'Internal Server Error' });
});

// Initialize database
async function initializeDatabase() {
  try {
    await initDatabase();
    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize database:', error);
    throw error;
  }
}

// Start server
const start = async () => {
  try {
    await initializeDatabase();
    await app.listen({ port: config.app.port });
    logger.info(`Server running on port ${config.app.port}`);
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Start the server
start();

module.exports = app;
