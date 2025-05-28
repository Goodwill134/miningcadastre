import { config } from '../config/app'
import winston from 'winston'

const logger = winston.createLogger({
  level: config.app.env === 'development' ? 'debug' : 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

export default logger
