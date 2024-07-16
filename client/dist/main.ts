import { Socket, io } from "socket.io-client";
import "../css/input.css";
import MessageComponent from "./message";
import { MessageTypes } from "./message";
import Header, { HeaderPorps } from "./header";

const date = new Date();
const socket: Socket = io("http://localhost:3000").timeout(4000);
const chat_form = document.getElementById("chat-form");

const message_input = document.getElementById(
  "chat-input"
) as HTMLTextAreaElement;

const room_input = document.getElementById("room-input") as HTMLTextAreaElement;
const join_button = document.getElementById("join-button") as HTMLButtonElement;

const chat_container = document.getElementById(
  "message-container"
) as HTMLDivElement;

socket.on("connect", () => {
  displayChatHeader({
    socket,
    title: `your id: ${socket.id}`,
    status: "connected",
  });
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

function onSubmit(e: SubmitEvent) {
  e.preventDefault();
  const message = message_input?.value;
  const room =
    document
      .getElementById("room-button-id")
      ?.getAttribute("current-room-name") || "";

  if (message.trim() === "" || !message) return;
  console.log(room);

  if (!!room) {
    displayMessage({
      message,
      socket_key: "room-message",
      sender: socket.id,
      type: "message",
      room,
    });
  } else {
    displayMessage({
      message,
      socket_key: "public-message",
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

function displayChatHeader(headerProps: Partial<HeaderPorps>) {
  Header(headerProps);
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
    const private_chat_id = room_input.value;
    const room_id =
      document
        .getElementById("room-button-id")
        ?.getAttribute("current-room-name") || "";
    if (e.key === "Enter") {
      e.preventDefault();

      if (private_chat_id === "" && message_value === "") return;
      if (
        private_chat_id.trim().length > 0 &&
        message_value.trim().length > 0
      ) {
        displayMessage({
          message: message_value,
          socket_key: "private-message",
          room: private_chat_id,
          sender: socket.id,
          type: "private",
        });
      }
      if (
        private_chat_id.trim().length === 0 &&
        message_value.trim().length > 0
      ) {
        if (room_id.trim().length > 0) {
          displayMessage({
            message: message_value,
            socket_key: "room-message",
            sender: socket.id,
            type: "message",
            room: room_id,
          });
        } else {
          displayMessage({
            message: message_value,
            socket_key: "public-message",
            sender: socket.id,
            type: "message",
          });
        }
      }
      scrollToBottom();
    }
  })
);
