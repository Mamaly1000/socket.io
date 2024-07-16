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
    "public-message",
    ({ message, room }: { message: string; room?: string }) => {
      socket.broadcast.emit("recieve-message", {
        message,
        sender: socket.id,
        room: undefined,
        type: "message",
      });
    }
  );
  socket.on("join-room", function (room) {
    try {
      socket.join(room);
      socket.to(room).emit("recieve-message", {
        message: `${socket.id} joined ${room} room`,
        type: "info",
      });
      socket.emit("chat-header", { room, type: "join" });
      socket.emit("recieve-message", {
        message: `you joined ${room} room`,
        type: "info",
      });
    } catch (e) {
      console.log("[error]", "join room :", e);
      socket.emit("recieve-message", {
        message: "couldnt perform requested action",
        type: "error",
      });
    }
  });
  socket.on("leave-room", (room) => {
    try {
      socket.leave(room);
      socket.emit("chat-header", { room, type: "leave" });
      socket.in(room).emit("recieve-message", {
        message: `${socket.id} left the room`,
        type: "error",
      });
      socket.emit("recieve-message", {
        message: `you left the ${room} room`,
        type: "info",
      });
    } catch (error) {
      console.log(`[socket]:[leave-room] `, error);
      socket.emit("recieve-message", {
        message: "unable to leave " + room + " room",
        type: "error",
      });
    }
  });
  socket.on("room-message", ({ message, room }) => {
    try {
      socket.in(room).emit("recieve-message", { message, type: "message" });
    } catch (error) {
      console.log(`[socket]:[room-message] `, error);
      socket.emit("recieve-message", {
        message: `unable to send message at ${room} room`,
        type: "error",
      });
    }
  });
  socket.on(
    "private-message",
    ({ room, message }: { room: string; message: string }) => {
      try {
        socket.to(room).emit(
          "recieve-message",
          {
            message,
            sender: socket.id,
            type: "private",
          },
          {
            message: `${socket.id} sent you a private message`,
            type: "info",
          }
        );
      } catch (error) {
        console.log(`[socket]:[private-message] `, error);
        socket.emit("error", {
          message: `unable to send message to ${room}`,
          type: "error",
        });
      }
    }
  );
});

instrument(io, { auth: false, mode: "development" });
io.listen(3000);
