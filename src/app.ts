import mongoose from 'mongoose';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import middlewares from './middlewares';
import RootRouter from './routes';
import getUri from './database';

function App(port: number) {
    const app = express();
    mongoose.connect(getUri());
    app.use(cors({
        origin: [process.env.CLIENT_DOMAIN as string, process.env.CLIENT_DOMAIN_HOST as string]
    }))
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.get('', (_, res) => {
        res.status(200).send({
            message: 'Kết nối thành công!'
        })
    })
    app.use('/api/v1', middlewares.delete_IdFromBody, RootRouter)

    app.listen(port, () => {
        console.log(`The application is listening on port ${port}!`);
    })
}
export default App
