import CONFIG from '../config.js';
import express from 'express';
import expressJwt from 'express-jwt';
import { validationResult } from 'express-validator';
import { logHttp } from '../log/log.js';

const app = express();
app.use(express.json());
app.disable('x-powered-by');
app.use(logHttp);
app.use((req, res, next) => {
    res.setHeader('x-powered-by', 'Professor Chris Whitty\'s patience')
    next();
});
// add auth
if (CONFIG.httpAuth) {
    app.use(expressJwt({ secret: CONFIG.httpAuthSecret, algorithms: [CONFIG.httpAuthAlgorithm]}));
    app.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
            res.status(401).send('Unauthorized');
        }
    });
}

// parallel validator
const validate = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({ errors: errors.array() });
    };
};

export { app, validate };