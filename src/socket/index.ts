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
                if (findExistedUser >= 0 && user.isDisconnect) {
                    this.activeUsers.splice(findExistedUser, 1);
                }
                else if (findExistedUser < 0 && user.id) {
                    this.activeUsers.push(user);
                }
                this.io.emit(roomId, this.activeUsers);
            });
        });
    }
}
export default Socket;