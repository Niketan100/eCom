const express = require('express');
const morgan = require('morgan');
const cors = require('cors');   


const app = express();

app.use(morgan('combined'));
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this to your frontend URL
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(morgan('dev'));
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: true}));

app.get('/api', (req, res) => {
    res.send({ 'message': 'Hello API from Kafka Service'});
});

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 7002;
app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
});