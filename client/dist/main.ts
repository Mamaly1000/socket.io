import "../css/input.css";

const chat_form = document.getElementById("chat-form");

const send_message_button = document.getElementById("send-message");
const message_input = document.getElementById(
  "chat-input"
) as HTMLTextAreaElement;

const room_input = document.getElementById("room-input") as HTMLTextAreaElement;
const join_button = document.getElementById("join-button");

const chat_header = document.getElementById("chat-header");
const chat_container = document.getElementById("message-container");

function onSubmit(e: SubmitEvent) {
  e.preventDefault();
  const message = message_input?.value;
  const room = room_input?.value;

  if (message === "" || !message) return;
  displayMessage(message);
  message_input.value = "";
}

function displayMessage(message: string) {
  console.log(message);
  const div = document.createElement("div");
  div.textContent = message;
  chat_container?.appendChild(div);
}

chat_form?.addEventListener("submit", (e) => onSubmit(e));
join_button?.addEventListener("click", (e) => {
  e.preventDefault();
  const room = room_input?.value;
  console.log(room);
});
