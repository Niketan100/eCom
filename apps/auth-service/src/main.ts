import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
// import axios from 'axios';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from '../../../packages/errorHandler/error-middleware';
import authRoutes from './routes/auth.routes';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { join } from 'path';

 

const app = express();

const swaggerDocument = JSON.parse(
    readFileSync(join(process.cwd(), 'apps/auth-service/src/swagger-output.json'), 'utf-8')
);

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
    keyGenerator : (req :any) => ipKeyGenerator(req) , // Use IP address as the key for rate limiting

}));

app.use('/auth', authRoutes);
app.use('/api-docs' , swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorMiddleware);

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 6001;


app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API from Auth Service'});
});

app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
});
