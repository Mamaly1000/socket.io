import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
var io = new Server({
    cors: {
        origin: ["http://127.0.0.1:5500", "https://admin.socket.io"],
        credentials: true,
    },
});
io.on("connection", function (socket) {
    socket.on("send-message", function (_a) {
        var message = _a.message, room = _a.room;
        if (!room) {
            socket.broadcast.emit("recieve-message", message);
        }
        else {
            socket.to(room).emit("recieve-message", message);
        }
    });
    socket.on("join-room", function (room) {
        try {
            socket.join(room);
            socket
                .to(room)
                .emit("recieve-message", "".concat(socket.id, " joined ").concat(room, " room"));
            socket.emit("chat-header", room);
            socket.emit("recieve-message", "you joined ".concat(room, " room"));
        }
        catch (e) {
            console.log("[error]", "join room :", e);
            socket.emit("recieve-message", "couldnt perform requested action");
        }
    });
});
instrument(io, { auth: false, mode: "development" });
io.listen(3000);
