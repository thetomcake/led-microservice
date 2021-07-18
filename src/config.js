import dotenv from "dotenv";
dotenv.config();
import cryptoRandomString from 'crypto-random-string';

export default {
    // log config
    logLevel: process.env.hasOwnProperty('LOG_LEVEL') ? process.env.LOG_LEVEL : 'debug', // One of 'fatal', 'error', 'warn', 'info', 'debug', 'trace' or 'silent'
    logPretty: process.env.hasOwnProperty('LOG_PRETTY') ? Boolean(process.env.LOG_PRETTY) : true,
    logPrettyColorize: process.env.hasOwnProperty('LOG_PRETTY_COLORIZE') ? Boolean(process.env.LOG_PRETTY_COLORIZE) : true,

    // http config
    httpPort: process.env.hasOwnProperty('HTTP_PORT') ? parseInt(process.env.HTTP_PORT) : 3000,

    // http auth config
    httpAuth: process.env.hasOwnProperty('HTTP_AUTH') ? Boolean(process.env.HTTP_AUTH) : true,
    httpAuthAlgorithm: process.env.hasOwnProperty('HTTP_AUTH_ALGORITHM') ? process.env.HTTP_AUTH_ALGORITHM : 'HS256',
    httpAuthSecret: process.env.hasOwnProperty('HTTP_AUTH_SECRET') ? process.env.HTTP_AUTH_SECRET : cryptoRandomString({length: 32}),

    // board config
    boardPort: process.env.hasOwnProperty('BOARD_PORT') ? process.env.BOARD_PORT : '/dev/ttyACM0',
    numStripLeds: process.env.hasOwnProperty('NUM_STRIP_LEDS') ? parseInt(process.env.NUM_STRIP_LEDS) : 60,
};