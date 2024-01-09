import mongoose from 'mongoose';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import middlewares from './middlewares';
import RootRouter from './routes';
import getUri from './database';
import Socket, { UserOnline } from './socket';
import { RoomSocket } from './global/enum';

function App(port: number) {
    const app = express();
    const socketIO = new Socket(app);
    const activeUsers: UserOnline[] = [];
    mongoose.connect(getUri());
    app.use(cors())
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.get('', (_, res) => {
        res.status(200).send({
            message: 'Kết nối thành công!'
        })
    });
    app.use('/api/v1', middlewares.delete_IdFromBody, RootRouter)
    socketIO.createRoomConnection(RoomSocket.COMMON, activeUsers);
    socketIO.server.listen(port, () => {
        console.log(`The application is listening on port ${port}!`);
    })
}
export default App
