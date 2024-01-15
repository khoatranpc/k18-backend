import http from 'http';
import { Express } from 'express';
import { Namespace, Server, Socket as SocketInterface } from "socket.io";
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import RoomQuizzTestModel from '../models/roomQuizzTest';
import { Obj } from '../global/interface';

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
interface RoomTest {
    codeClass: string;
    start: boolean;
    finish: boolean;
    join: boolean;
    time: number;
    duringInTheTest: boolean;
    student?: {
        studentName: string;
        email: string;
        clientId?: string;
    };
}
class Socket {
    private app: Express;
    private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    public server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    private activeUsers: UserOnline[] = [];
    private roomQuizzCache: Obj = {};
    private listStudentOnRoom: { [k: string]: Obj[] } = {};
    private dataRoomQuizz: { [k: string]: Obj } = {};
    private listQuizz: { [k: string]: Obj } = {};

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
    createTestQuizz() {
        const quizzIo = this.io.of('/quizz/test');
        quizzIo.on('connection', async (socket: SocketInterface) => {
            const room = socket.handshake.query.room as string;
            const findCachedRoom = this.roomQuizzCache[`${room}`];
            if (!findCachedRoom) {
                const existedRoom = await RoomQuizzTestModel.findOne({
                    codeClass: room,
                });
                if (existedRoom && existedRoom.active) {
                    this.roomQuizzCache[`${existedRoom.codeClass}`] = existedRoom.codeClass;
                    this.callbackRoomQuizz(existedRoom.codeClass, socket, quizzIo);
                } else {
                    socket.emit(`${room}`, {
                        data: null,
                        message: 'Phiên kiểm tra không tồn tại hoặc đã kết thúc!'
                    });
                }
            } else {
                this.callbackRoomQuizz(room, socket, quizzIo);
            }
        });
    }
    private callbackRoomQuizz(room: string, socket: SocketInterface, io: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
        socket.on(room, (data: RoomTest) => {
            const getStudent = data.student;
            if (getStudent) {
                const mapData = {
                    ...getStudent,
                    clientId: socket.id
                }
                this.listStudentOnRoom[room] = this.listStudentOnRoom[room] ? ([...this.listStudentOnRoom[room], mapData]) : [mapData];
            }
            this.dataRoomQuizz[room] = {
                ...data,
                listStudent: this.listStudentOnRoom[room] || []
            };
            // missing condition student enrolled
            if (data.join && !data.start && !data.finish && !data.duringInTheTest) {
                io.emit(room, this.dataRoomQuizz[room]);
            }
            else if (data.join && data.start && !data.finish && !data.duringInTheTest) {
                this.countTime(4, (time) => {
                    (this.dataRoomQuizz[room] as Obj).time = time;
                    if (time === 0) {
                        (this.dataRoomQuizz[room] as Obj).duringInTheTest = true;
                    }
                    io.emit(room, this.dataRoomQuizz[room]);
                });
            }
        });
        socket.on('disconnect', () => {
            const clientId = socket.id;
            const getListStudent = this.listStudentOnRoom[room];
            if (getListStudent) {
                const studentOut = getListStudent.findIndex(item => item.clientId === clientId);
                if (studentOut > -1) {
                    getListStudent.splice(studentOut, 1);
                }
            }
            io.emit(room, {
                ...(this.dataRoomQuizz[room] as Obj),
                listStudent: this.listStudentOnRoom[room] || []
            });
        });
    }
    private countTime(start: number, callBack: (time: number) => void) {
        let time = start;
        const countingTime = setInterval(() => {
            if (time > 0) {
                time--;
                callBack(time);
            } else {
                clearInterval(countingTime);
            }
        }, 1000);
    }
}
export default Socket;