import express from 'express';
import proxy from 'express-http-proxy'
import morgan from 'morgan';
import cors from 'cors';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

// import axios from 'axios';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from '../../../packages/errorHandler/error-middleware';

const app = express();  

app.set('trust proxy', 1);
app.use(morgan('combined'));
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this to your frontend URL
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(morgan('dev'));
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: true}));


app.use(cookieParser());

app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: (req :any) =>( req.user ? 1000 : 100 ), // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    legacyHeaders : true,
    keyGenerator: (req:any) => ipKeyGenerator(req.ip), // Use safe IPv4/IPv6 aware key generation

}));

app.use('/gateway-health', proxy('http://localhost:3001',));

app.use(errorMiddleware);

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 8080;


app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API'});
});

app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
});
