import { Socket } from "socket.io-client";

export type StatusTypes = "connecting" | "connected" | "disconnected";
export interface HeaderPorps {
  title: string;
  currentRoom: string;
  status: StatusTypes;
  socket?: Socket;
  setRoom?: (room?: string) => void;
}

const Header = ({
  currentRoom,
  status,
  title,
  socket,
  setRoom,
}: Partial<HeaderPorps>) => {
  const chat_header = document.getElementById("chat-header") as HTMLDivElement;

  chat_header.innerHTML = "";
  chat_header.appendChild(title_section({ status, title }));
  chat_header.appendChild(room_section({ currentRoom, socket, setRoom }));
};

export default Header;

const title_section = ({
  title,
  status,
}: {
  title?: string;
  status?: StatusTypes;
}) => {
  const header_title_section = document.createElement("div");
  header_title_section.classList.add("title-section");
  header_title_section.innerHTML = ` 
  ${
    !!title
      ? ` <span class="text-sm sm:text-[3vw] md:text-[1vw] capitalize font-bold" >${title}</span>`
      : ""
  }
  ${
    !!status
      ? ` <span class="text-xs animate-pulse status-${status}" >${status}</span>`
      : ""
  } `;
  return header_title_section;
};
const room_section = ({
  currentRoom,
  socket,
  setRoom,
}: {
  setRoom?: (room?: string) => void;
  socket?: Socket;
  currentRoom?: string;
}) => {
  const header_room_section = document.createElement("div");
  header_room_section.classList.add("room-section");

  //   room-input
  const room_input = document.createElement("input");
  room_input.classList.add("room-input");
  room_input.placeholder = "join a room...";
  room_input.addEventListener("keypress", (e) => {
    const room = room_input.value;
    if (e.key === "Enter") {
      if (room.trim().length > 0) {
        socket?.emit("join-room", room);
        setRoom!(room);
      }
    }
    if (room_input.value.trim().length > 0) {
      join_button.disabled = false;
    }
  });
  // join button
  const join_button = document.createElement("button");
  join_button.classList.add("room-button");
  join_button.textContent = "join";
  join_button.disabled = room_input.value.trim().length > 0 ? false : true;
  join_button.addEventListener("click", () => {
    const room = room_input.value;
    if (room.trim().length > 0) {
      socket?.emit("join-room", room);
      setRoom!(room);
    }
  });
  // leave button
  const leave_button = document.createElement("button");
  leave_button.classList.add("room-leave-button");
  leave_button.setAttribute("id", "room-button-id");
  leave_button.setAttribute("current-room-name", currentRoom || "");
  leave_button.textContent = "leave " + currentRoom + " room";
  leave_button.addEventListener("click", () => {
    socket?.emit("leave-room", currentRoom);
    room_input.value = "";
    leave_button.setAttribute("current-room-name", "");
    setRoom!(undefined);
  });
  if (currentRoom) {
    header_room_section.appendChild(leave_button);
  } else {
    header_room_section.appendChild(room_input);
    header_room_section.appendChild(join_button);
  }

  return header_room_section;
};
