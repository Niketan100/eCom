
import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'Auth Service API',
        description: 'API documentation for the Auth Service',
    },
    host: 'localhost:3001',
    schemes: ['http'],
    version: '1.0.0',
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/auth.routes.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);