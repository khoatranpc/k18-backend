import mongoose from 'mongoose';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import middlewares from './middlewares';
import RootRouter from './routes';
import connectToDatabase from "./database/connectMongoDB"
import Socket from './socket';
import { RoomSocket } from './global/enum';

export const SocketIo: { socketIo?: Socket } = {};
async function App(port: number) {
    const app = express();
    const socketIO = new Socket(app);
    SocketIo['socketIo'] = socketIO;
    connectToDatabase().catch(err => console.error(err));
    app.use(cors())
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.get('', (_, res) => {
        res.status(200).send({
            message: 'Kết nối thành công!'
        })
    });
    app.use('/api/v1', middlewares.delete_IdFromBody, RootRouter);
    socketIO.createRoomConnection(RoomSocket.COMMON);
    socketIO.createTestQuizz();
    socketIO.server.listen(port, () => {
        console.log(`The application is listening on port ${port}!`);
    })
}
export default App
