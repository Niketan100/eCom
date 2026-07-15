import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
// import axios from 'axios';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from '../../../packages/errorHandler/error-middleware';
import router from './routes/router';

import { kafka } from '../../../packages/libs/kafka';



const app = express();

app.use(morgan('combined'));
app.use(cors({
    origin: ['https://s-ui-nlpb.onrender.com','https://api-gateway-1c6p.onrender.com','https://user-ui-y5m6.onrender.com','http://localhost:3000','http://localhost:3001' ], // Adjust this to your frontend URL
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

const con = async () =>{
    try {
        const producer = kafka.producer();

await producer.connect();

await producer.send({
  topic: 'orders',
  messages: [
    { value: 'Product Service Created' }
  ],
});   
} catch (error) {
        console.error('Error connecting to Kafka:', error);     
    }
}



app.use(errorMiddleware);

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 7001;


app.use('/products', router);

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API from Product Service'});
});

app.listen(port, host, async () => {
    await con();
    console.log(`[ ready ] http://${host}:${port}`);
});
