import { Socket, io } from "socket.io-client";
import "../css/input.css";
import MessageComponent from "./message";
import { MessageTypes } from "./message";
import Header, { HeaderPorps } from "./header";
import ChatInputComponent, { FormProps } from "./chat-input";
import scrollToBottom from "./utils";

const date = new Date();
const socket: Socket = io("http://localhost:3000").timeout(4000);

const Main_Chat_Input = new ChatInputComponent({
  onSendMessage: ({ message, private_id, room }) => {
    if (!message || message.trim().length === 0) {
      displayMessage({ message: "invalid message", type: "error" });
    }
    if (message && !private_id && !room) {
      displayMessage({
        message,
        type: "message",
        sender: socket.id,
        socket_key: "public-message",
      });
    }
    if (message && private_id && !room) {
      displayMessage({
        message,
        type: "private",
        room: private_id,
        sender: socket.id,
        socket_key: "private-message",
      });
    }
    if (message && !private_id && room) {
      displayMessage({
        message,
        type: "message",
        room,
        sender: socket.id,
        socket_key: "room-message",
      });
    }
    if (message && private_id && room) {
      displayMessage({
        message,
        type: "private",
        room: private_id,
        sender: socket.id,
        socket_key: "private-message",
      });
    }
  },
});
Main_Chat_Input.render();

const chat_container = document.getElementById(
  "message-container"
) as HTMLDivElement;
let connected = 0;
socket.on("connect", () => {
  displayChatHeader({
    socket,
    title: `your id: ${socket.id}`,
    status: "connected",
  });
  connected++;
  if (connected === 1) {
    displayMessage({
      message: "you are connected",
      type: "success",
    });
  }
  socket.on("recieve-message", (...data) => {
    data.forEach(({ message, sender, type, room }) => {
      displayMessage({ message, sender, room, type });
    });
  });
  socket.on("chat-header", ({ room, type }) => {
    if (type === "join") {
      displayChatHeader({
        socket,
        title: `your id: ${socket.id}`,
        status: "connected",
        currentRoom: room,
      });
    } else {
      displayChatHeader({
        socket,
        title: `your id: ${socket.id}`,
        status: "connected",
      });
    }
  });
  socket.on("error", ({ message, type }) => {
    displayMessage({
      message,
      type,
    });
  });
  socket.on("disconnect", (reason) => {
    if (reason === "io server disconnect") {
      displayChatHeader({
        socket,
        title: `your id: ${socket.id}`,
        status: "disconnected",
      });
    }
  });
  socket.on("offline", () => {
    displayChatHeader({
      socket,
      title: `your id: ${socket.id}`,
      status: "disconnected",
    });
  });
  socket.on("connect_error", function () {
    displayChatHeader({
      socket,
      title: `your id: ${socket.id}`,
      status: "disconnected",
    });
  });
});

function displayMessage({
  message,
  socket_key,
  room,
  sender,
  type,
}: {
  type: MessageTypes;
  room?: string;
  socket_key?: string;
  message: string;
  sender?: string;
}) {
  chat_container.appendChild(
    MessageComponent({
      createdAt: date,
      message,
      sender: sender,
      type,
      onReply: (sender) => {
        if (!!sender) Main_Chat_Input.setPrivateID(sender);
      },
    })
  );
  if (socket_key) {
    socket.emit(socket_key, { message, room });
  }
  scrollToBottom(chat_container);
}

function displayChatHeader(headerProps: Partial<HeaderPorps>) {
  Header({
    ...headerProps,
    setRoom: (room) => {
      Main_Chat_Input.setRoom(room);
    },
  });
}
