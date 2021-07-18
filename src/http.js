import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { log } from './log/log.js';
import CONFIG from './config.js';
import { app, validate } from './http/expressBootstrap.js';
import Led from "./board/led.js";

const led = new Led;

const rgbValidation = [
    body('r').isNumeric().custom(number => parseInt(number) >= 0 && parseInt(number) <= 255),
    body('g').isNumeric().custom(number => parseInt(number) >= 0 && parseInt(number) <= 255),
    body('b').isNumeric().custom(number => parseInt(number) >= 0 && parseInt(number) <= 255),
];

export default new function() {
    app.post('/on', validate([
        // validation example - docs: https://express-validator.github.io/docs/index.html
        ...rgbValidation
    ]), async (req, res) => {
        await led.on(parseInt(req.body.r), parseInt(req.body.g), parseInt(req.body.b), true);
        req.log.info('On ' + req.body.r + ',' + req.body.g + ',' + req.body.b);
        return res.json({status: 'on'});
    });
    app.post('/off', async (req, res) => {
        await led.off(true);
        req.log.info('Off');
        return res.json({status: 'off'});
    });
    app.post('/flash', validate([
        // validation example - docs: https://express-validator.github.io/docs/index.html
        ...rgbValidation,
        body('interval').custom(number => parseInt(number) >= 50 && parseInt(number) <= 10000).optional(),
        body('limit').custom(number => parseInt(number) >= -1 && parseInt(number) <= 100).optional(),
    ]), async (req, res) => {
        await led.flash(parseInt(req.body.r), parseInt(req.body.g), parseInt(req.body.b), parseInt(req.body.interval || 500), parseInt(req.body.limit || -1));
        return res.json({status: 'flash'});
    });
    app.post('/wave', validate([
        // validation example - docs: https://express-validator.github.io/docs/index.html
        ...rgbValidation,
        body('waves').custom(number => parseInt(number) >= 1 && parseInt(number) <= 10).optional(),
    ]), async (req, res) => {
        await led.wave(parseInt(req.body.r), parseInt(req.body.g), parseInt(req.body.b), parseInt(req.body.waves || 1));
        return res.json({status: 'wave'});
    });

    app.post('/fade', validate([
        // validation example - docs: https://express-validator.github.io/docs/index.html
        ...rgbValidation,
        body('speed').isNumeric().custom(number => parseInt(number) >= 500 && parseInt(number) <= 25000).optional(),
    ]), async (req, res) => {
        await led.fade(parseInt(req.body.r), parseInt(req.body.g), parseInt(req.body.b), parseInt(req.body.speed || 2000));
        return res.json({status: 'fade'});
    });

    this.start = function() {
        // logging example - docs: https://github.com/pinojs/pino/tree/185dc159166d8d31471a31532fede220d5a8d588
        log.debug('Starting HTTP on port ' + CONFIG.httpPort);
        if (CONFIG.httpAuth) {
            log.debug('HTTP auth enabled with with secret ' + CONFIG.httpAuthSecret);
            log.debug('HTTP auth access token: ' + jwt.sign({}, CONFIG.httpAuthSecret, {algorithm: CONFIG.httpAuthAlgorithm}));
        } else {
            log.debug('HTTP auth disabled');
        }
        app.listen(CONFIG.httpPort);
        log.info('HTTP listening on ' + CONFIG.httpPort);
    };
};