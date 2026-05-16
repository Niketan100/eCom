import express from 'express';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import { errorMiddleware } from '../../../packages/errorHandler/error-middleware';

const app = express();

app.set('trust proxy', 1);

app.use(morgan('combined'));

app.use(cors({
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(morgan('dev'));

app.use(express.json({
    limit: '100mb'
}));

app.use(express.urlencoded({
    limit: '100mb',
    extended: true
}));

app.use(cookieParser());

app.use(rateLimit({

    windowMs: 15 * 60 * 1000,

    max: (req: any) => (
        req.user ? 1000 : 100
    ),

    message: 'Too many requests from this IP, please try again later.',

    legacyHeaders: true,

    keyGenerator: (req: any) =>
        ipKeyGenerator(req.ip),

}));

/*
|--------------------------------------------------------------------------
| HEALTH
|--------------------------------------------------------------------------
*/

app.get('/gateway-health', (_, res) => {

    res.status(200).json({
        success: true,
        message: 'Gateway working'
    });

});

/*
|--------------------------------------------------------------------------
| AUTH SERVICE
|--------------------------------------------------------------------------
*/

app.use(

    '/auth',

    proxy('http://localhost:6001', {

        proxyReqPathResolver: (req) => {
            return `/auth${req.url}`;
        }

    })

);

/*
|--------------------------------------------------------------------------
| PRODUCT SERVICE
|--------------------------------------------------------------------------
*/

app.use(

    '/products',

    (req, _, next) => {

        console.log('━━━━━━━━━━━━━━━━━━━');
        console.log('PRODUCT SERVICE HIT');
        console.log('Original URL:', req.originalUrl);
        console.log('Method:', req.method);
        console.log('━━━━━━━━━━━━━━━━━━━');

        next();

    },

    proxy('http://localhost:7001', {

        proxyReqPathResolver: (req) => {

            const path = `/products${req.url}`;

            console.log('Forwarding To:', `http://localhost:7001${path}`);

            return path;

        }

    })

);

/*
|--------------------------------------------------------------------------
| ROOT
|--------------------------------------------------------------------------
*/

app.get('/', (_, res) => {

    res.send({
        message: 'Hello API Gateway'
    });

});

app.use(errorMiddleware);

const host = process.env.HOST ?? 'localhost';

const port = process.env.PORT
    ? Number(process.env.PORT)
    : 8080;

app.listen(port, host, () => {

    console.log(
        `[ ready ] http://${host}:${port}`
    );

});