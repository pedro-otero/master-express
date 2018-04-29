const winston = require('winston');

const discogs = require('../api/discogs');
const search = require('../search');

const createLogger = ({ id }) => winston.createLogger({
  levels: {
    error: 0,
    info: 1,
    debug: 2,
  },
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({ level: 'info' }),
    new winston.transports.File({ filename: `app/log/${id}.log`, level: 'debug' }),
  ],
});

module.exports = search(discogs, createLogger);
