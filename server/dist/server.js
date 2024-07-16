import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
var io = new Server({
    cors: {
        origin: ["http://127.0.0.1:5500", "https://admin.socket.io"],
        credentials: true,
    },
});
io.on("connection", function (socket) {
    socket.on("public-message", function (_a) {
        var message = _a.message, room = _a.room;
        socket.broadcast.emit("recieve-message", {
            message: message,
            sender: socket.id,
            room: undefined,
            type: "message",
        });
    });
    socket.on("join-room", function (room) {
        try {
            socket.join(room);
            socket.to(room).emit("recieve-message", {
                message: "".concat(socket.id, " joined ").concat(room, " room"),
                type: "info",
            });
            socket.emit("chat-header", { room: room, type: "join" });
            socket.emit("recieve-message", {
                message: "you joined ".concat(room, " room"),
                type: "info",
            });
        }
        catch (e) {
            console.log("[error]", "join room :", e);
            socket.emit("recieve-message", {
                message: "couldnt perform requested action",
                type: "error",
            });
        }
    });
    socket.on("leave-room", function (room) {
        try {
            socket.leave(room);
            socket.emit("chat-header", { room: room, type: "leave" });
            socket.in(room).emit("recieve-message", {
                message: "".concat(socket.id, " left the room"),
                type: "error",
            });
            socket.emit("recieve-message", {
                message: "you left the ".concat(room, " room"),
                type: "info",
            });
        }
        catch (error) {
            console.log("[socket]:[leave-room] ", error);
            socket.emit("recieve-message", {
                message: "unable to leave " + room + " room",
                type: "error",
            });
        }
    });
    socket.on("room-message", function (_a) {
        var message = _a.message, room = _a.room;
        try {
            socket.in(room).emit("recieve-message", { message: message, type: "message" });
        }
        catch (error) {
            console.log("[socket]:[room-message] ", error);
            socket.emit("recieve-message", {
                message: "unable to send message at ".concat(room, " room"),
                type: "error",
            });
        }
    });
    socket.on("private-message", function (_a) {
        var room = _a.room, message = _a.message;
        try {
            socket.to(room).emit("recieve-message", {
                message: message,
                sender: socket.id,
                type: "private",
            }, {
                message: "".concat(socket.id, " sent you a private message"),
                type: "info",
            });
        }
        catch (error) {
            console.log("[socket]:[private-message] ", error);
            socket.emit("error", {
                message: "unable to send message to ".concat(room),
                type: "error",
            });
        }
    });
});
instrument(io, { auth: false, mode: "development" });
io.listen(3000);
