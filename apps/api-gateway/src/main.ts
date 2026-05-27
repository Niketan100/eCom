import express from 'express';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import initializeConfig from './libs/intialize_config';

// errorMiddleware is loaded dynamically to avoid ESM/CommonJS interop issues


const app = express();

app.set('trust proxy', 1);

app.use(morgan('combined'));

// Allow origins used by both UIs during development. Use a dynamic origin in case
// NEXT_PUBLIC_API_URL or ports change.
const allowedOrigins = [
    'http://localhost:3000', // seller-ui / user-ui default
    'http://localhost:3001', // alternate dev port if used
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, server-side)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        // fallback: allow but log for debugging
        console.warn('CORS blocked origin:', origin);
        return callback(null, false);
    },
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

// app.use(rateLimit({

//     windowMs: 15 * 60 * 1000,

//     max: (req: any) => (
//         req.user ? 1000 : 100
//     ),

//     message: 'Too many requests from this IP, please try again later.',

//     legacyHeaders: true,

//     keyGenerator: (req: any) =>
//         ipKeyGenerator(req.ip),

// }));

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
        },

        // Important: forward Set-Cookie from auth-service so refreshed tokens
        // actually reach the browser. Without this, UI will keep sending the
        // old expired access token and loop on "Token expired".
        userResHeaderDecorator(headers) {
            return headers;
        },

        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if (srcReq.headers && srcReq.headers.cookie) {
                proxyReqOpts.headers = proxyReqOpts.headers || {};
                proxyReqOpts.headers.cookie = srcReq.headers.cookie as string;
            }
            return proxyReqOpts;
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

        // Preserve POST/PUT/DELETE bodies and forward cookies and headers
        proxyReqPathResolver: (req) => {
            const path = `/products${req.url}`;
            console.log('Forwarding To:', `http://localhost:7001${path}`);
            return path;
        },

        proxyReqBodyDecorator: (bodyContent, srcReq) => {
            // express-http-proxy gives parsed body; re-stringify so remote service
            // receives the JSON payload as expected.
            if (!bodyContent) return bodyContent;
            try {
                return JSON.stringify(bodyContent);
            } catch (e) {
                return bodyContent;
            }
        },

        userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
            // forward Set-Cookie from downstream so browser receives auth cookies
            // Note: cookie attributes (SameSite/domain) must be compatible with gateway origin.
            return headers;
        },

        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            // ensure cookie header is forwarded when present
            if (srcReq.headers && srcReq.headers.cookie) {
                proxyReqOpts.headers = proxyReqOpts.headers || {};
                proxyReqOpts.headers.cookie = srcReq.headers.cookie as string;
            }
            return proxyReqOpts;
        },

        // Pass-through logging of proxy errors instead of crashing
        proxyErrorHandler: (err, res, next) => {
            console.error('Proxy error when contacting product-service:', err && err.message ? err.message : err);
            // If headers were already sent, let express handle it
            if (res.headersSent) return next(err);
            res.status(502).json({ success: false, message: 'Bad gateway (product-service).', details: err?.message });
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

// Load error middleware dynamically and start the server. This avoids crashes
// when the error middleware package is published as an ES module.
// Bind to 0.0.0.0 by default so IPv4/IPv6 loopback differences don't cause
// "connection refused" for local probes. Developers can still override via HOST.
const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 8080;

// Use a simple error middleware that will always be present. This avoids
// runtime failures caused by ESM/CommonJS interop in the packages during dev.
app.use((err: any, req: any, res: any, next: any) => {
    console.error('Unhandled error:', err && err.stack ? err.stack : err);
    if (res.headersSent) return next(err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(port, host, () => {
    try {
        initializeConfig();
    } catch (error) {
        console.error('Error initializing config:', error);
    }
    console.log(`[ ready ] http://${host}:${port}`);
});