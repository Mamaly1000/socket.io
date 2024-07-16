import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const io = new Server({
  cors: {
    origin: ["http://127.0.0.1:5500", "https://admin.socket.io"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on(
    "send-message",
    ({ message, room }: { message: string; room?: string }) => {
      if (!room) {
        socket.broadcast.emit("recieve-message", message);
      } else {
        socket.to(room).emit("recieve-message", message);
      }
    }
  );
  socket.on("join-room", function (room) {
    try {
      socket.join(room);
      socket
        .to(room)
        .emit("recieve-message", `${socket.id} joined ${room} room`);
      socket.emit("chat-header", room);
      socket.emit("recieve-message", `you joined ${room} room`);
    } catch (e) {
      console.log("[error]", "join room :", e);
      socket.emit("recieve-message", "couldnt perform requested action");
    }
  });
});

instrument(io, { auth: false, mode: "development" });
io.listen(3000);
