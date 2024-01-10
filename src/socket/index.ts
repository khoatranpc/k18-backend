import http from 'http';
import { Express } from 'express';
import { Server, Socket as SocketInterface } from "socket.io";
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

interface UserOnline {
    userName: string;
    role: string;
    position?: string;
    img?: string;
    id: string;
    isDisconnect?: boolean;
    // side server
    socketId?: string;
}
class Socket {
    private app: Express;
    private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    public server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    private activeUsers: UserOnline[] = []
    constructor(app: Express) {
        this.app = app;
        this.server = http.createServer(this.app);
        this.io = this.createServerSocket();
    }
    private createServerSocket() {
        const io = new Server(this.server, {
            cors: {
                origin: '*'
            },
        });
        return io;
    }
    createRoomConnection(roomId: string) {
        this.io.on('connection', (socket: SocketInterface) => {
            socket.on(roomId, (user: UserOnline) => {
                const findExistedUser = this.activeUsers.findIndex((item) => {
                    return item.id === user.id;
                });
                if (findExistedUser < 0 && user.id) {
                    this.activeUsers.push({
                        ...user,
                        socketId: socket.id
                    });
                    this.io.emit(roomId, this.activeUsers);
                }
            });
            socket.on('disconnect', () => {
                const findClient = this.activeUsers.findIndex(item => item.socketId === socket.id);
                if (findClient >= 0) {
                    this.activeUsers.splice(findClient, 1);
                    this.io.emit(roomId, this.activeUsers);
                }
            });
        });
    }
}
export default Socket;