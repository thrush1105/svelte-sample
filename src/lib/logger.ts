import { createLogger, format, Logger, transports } from 'winston';

const logger: Logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: () => new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
    }),
    format.printf(({ level, message, timestamp, ...meta }) => {
      const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
      return `${timestamp} [${level}]: ${message} ${metaStr}`;
    })
  ),
  transports: [new transports.Console(), new transports.File({ filename: 'app.log' })]
});

export default logger;
