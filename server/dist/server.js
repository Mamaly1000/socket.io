import { Server } from "socket.io";
var io = new Server({
    cors: {
        origin: ["http://localhost:8080", "http://127.0.0.1:5500"],
    },
});
io.on("connection", function (socket) {
    console.log(socket.id);
});
io.listen(3000);
