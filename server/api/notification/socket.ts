import { Server, Socket } from "socket.io";

type SocketDataType ={
    id: string,
    userAgent: string | undefined,
    userId: number |undefined
}
let SocketData: SocketDataType[] = [];

export const configureOtherSocket = (io: Server) => {
    const notif = io.of("/notification")

    notif.on("connection", (socket: Socket) => {
        // console.log("A user connected to Notification");
        SocketData.push({
            id: socket.id,
            userAgent: socket.handshake.headers['user-agent'],
            userId: undefined,
        })
        // Identifikasi pengguna di namespace ini
        socket.on("identify", (userId: number) => {
            // Store user information or perform other actions
            const data = SocketData.find((s) => s.id === socket.id)
            
            if (data) {
                data.userId = userId
            }
        });
        socket.on("disconnect", () => {
            SocketData = SocketData.filter((s) => s.id != socket.id)
        })
    });
};

// Fungsi untuk mengirim notifikasi ke pengguna
export const sendNotificationToUser = (io: Server, userId: number, data: any) => {
    const lUserSocket = SocketData.filter((s) => s.userId === userId);
    const lUserAgent: string[] = []
    for (const userSocket of lUserSocket) {
        if (!lUserAgent.some(s => s ==  userSocket.userAgent)) {
            console.log(userSocket.id);
            
            io.of("/notification").to(userSocket.id as string).emit("show-notification", data);
            lUserAgent.push(userSocket.userAgent as string)
        }
    }
  };
