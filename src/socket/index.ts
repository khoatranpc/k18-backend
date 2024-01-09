import http from 'http';
import { Express } from 'express';
import { Server, Socket as SocketInterface } from "socket.io";
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export interface UserOnline {
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
            transports: ["websocket", "polling"]
        });
        return io;
    }
    createRoomConnection(roomId: string, activeUsers: UserOnline[]) {
        this.io.on('connection', (socket: SocketInterface) => {
            socket.on(roomId, (user: UserOnline) => {
                const findExistedUser = activeUsers.findIndex((item) => {
                    return item.id === user.id;
                });
                if (findExistedUser < 0) {
                    activeUsers.push(user);
                }
                if (findExistedUser >= 0 && user.isDisconnect) {
                    activeUsers.splice(findExistedUser, 1);
                }
                this.io.emit(roomId, activeUsers);
            });
        });
    }
}
export default Socket;