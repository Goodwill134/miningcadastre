import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import appConfig from './config/app.config.js'
import appRoutes from './src/routes/index.js'

console.log('Loaded configuration:', appConfig)

// Initialize Fastify app
const app = fastify({ 
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
});

// Middleware
app.register(fastifyCors, {
  origin: appConfig.cors.origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});
app.register(fastifyHelmet);

// Register routes
app.register(appRoutes);

// Error handling
app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  return reply.status(500).send({ error: 'Internal Server Error' });
});

// Start server with detailed logging
const start = async () => {
  try {
    console.log('Attempting to start server on:', appConfig.host, appConfig.port)
    const address = await app.listen({ 
      port: appConfig.port,
      host: appConfig.host 
    });
    console.log('Server successfully started on:', address);
    app.log.info(`Server listening on ${appConfig.host}:${appConfig.port}`);
  } catch (err) {
    console.error('Server failed to start:', err)
    app.log.error(err);
    process.exit(1);
  }
};

start();
