import { Socket, io } from "socket.io-client";
import "../css/input.css";
import MessageComponent from "./message";
import { MessageTypes } from "./message";

const date = new Date();
const socket: Socket = io("http://localhost:3000");
const chat_form = document.getElementById("chat-form");

const send_message_button = document.getElementById("public-message");
const message_input = document.getElementById(
  "chat-input"
) as HTMLTextAreaElement;

const room_input = document.getElementById("room-input") as HTMLTextAreaElement;
const join_button = document.getElementById("join-button") as HTMLButtonElement;

const chat_header = document.getElementById("chat-header") as HTMLDivElement;
const chat_container = document.getElementById(
  "message-container"
) as HTMLDivElement;

socket.on("connect", () => {
  displayChatHeader(`your id: ${socket.id}`);

  socket.on("recieve-message", (...data) => {
    data.forEach(({ message, sender, type, room }) => {
      displayMessage({ message, sender, room, type });
    });
  });
  socket.on("chat-header", (room) => {
    displayChatHeader(`your id: ${socket.id} room: ${room}`);
  });
  socket.on("error", ({ message, type }) => {
    displayMessage({
      message,
      type,
    });
  });
});

function onSubmit(e: SubmitEvent) {
  e.preventDefault();
  const message = message_input?.value;
  const room = room_input?.value;

  if (message.trim() === "" || !message) return;

  if (!room) {
    displayMessage({
      message,
      socket_key: "public-message",
      sender: socket.id,
      type: "message",
    });
  } else {
    displayMessage({
      room,
      message,
      socket_key: "private-message",
      sender: socket.id,
      type: "message",
    });
  }
  scrollToBottom();
}

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
  chat_container?.appendChild(
    MessageComponent({
      createdAt: date,
      message,
      sender: sender,
      type,
    })
  );
  if (socket_key) {
    socket.emit(socket_key, { message, room });
  }
  message_input.value = "";
  scrollToBottom();
}

function displayChatHeader(message: string) {
  chat_header.textContent = message;
}

function scrollToBottom() {
  chat_container.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
}

chat_form?.addEventListener("submit", (e) => onSubmit(e));
join_button.addEventListener("click", (e) => {
  const room = room_input.value;
  if (room.trim().length > 0) {
    socket.emit("join-room", room);
  }
});

[room_input, message_input].forEach((input) =>
  input.addEventListener("keypress", (e) => {
    const message_value = message_input.value;
    const room_value = room_input.value;
    if (e.key === "Enter") {
      e.preventDefault();

      if (room_value === "" && message_value === "") return;
      if (room_value.trim().length > 0 && message_value.trim().length > 0) {
        displayMessage({
          message: message_value,
          socket_key: "private-message",
          room: room_value,
          sender: socket.id,
          type: "private",
        });
      }
      if (room_value.trim().length === 0 && message_value.trim().length > 0) {
        displayMessage({
          message: message_value,
          socket_key: "public-message",
          sender: socket.id,
          type: "message",
        });
      }
      scrollToBottom();
    }
  })
);
