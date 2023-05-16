import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/logging'
import authorRoutes from './routes/LogRoute';

const router = express()

mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info('Connected to mongoDB.')
        StartServer()
    })
    .catch((error) => {
        Logging.error('Unable to connect')
        Logging.error(error)
    })


// Start server once mongo connects
// Log the request, the response, and remote address it came from 
const StartServer = () => {
    router.use((req, res, next) => {
        Logging.info(`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            Logging.info(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    // ---- Access Rules ---- //
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        next();
    });

    // ---- Routes ---- //
   router.use('/logs', authorRoutes)


    // route to test connectivity
    router.get('/hello', (req, res, next) => {
        res.status(200).json({ message: 'hi back' })
    });


    // ---- Errors ---- //
    router.use((req, res, next) => {
        const error = new Error('Not found');

        Logging.error(error);
        res.status(404).json({
            message: error.message
        });
    });

    http.createServer(router).listen(config.server.port, () => {
        Logging.info(`Server is running on port ${config.server.port}`)
    });
};
