import CONFIG from '../config.js';
import pino from 'pino';
import pinoHttp from 'pino-http';

const log = pino({
    prettyPrint: CONFIG.logPretty ? (CONFIG.logPrettyColorize ? {colorize: true} : true) : false,
    level: CONFIG.logLevel
});
const logHttp = pinoHttp({
    logger: log
});

export {
    log,
    logHttp
};