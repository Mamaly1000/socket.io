import { formatDistanceToNowStrict } from "date-fns";
import { Socket } from "socket.io-client";

export type MessageTypes =
  | "message"
  | "info"
  | "error"
  | "warn"
  | "private"
  | "success";

const MessageComponent = ({
  message,
  type,
  createdAt,
  sender,
  socket,
  onReply,
}: {
  onReply: (sender?: string) => void;
  message: string;
  type: MessageTypes;
  createdAt: Date;
  sender?: string;
  socket?: Socket;
}) => {
  const MessageElement = document.createElement("article");
  MessageElement.classList.add("message-component", type);

  const showSender = type === "message" || type === "private";
  const canReply = socket?.id !== sender;

  MessageElement.innerHTML = `
 ${showSender ? ` <div class="circle circle-${type}" ></div>` : ""}
  <div class="flex flex-wrap items-start justify-start w-full max-w-full" >
  <div class="message-text" >${message}</div>
      ${
        showSender
          ? ` <div class="message-info" >  ${
              sender ? `<span>sender: ${sender}</span>` : ""
            }   </div>  `
          : ""
      }
  </div>
    `;
  if (showSender) {
    MessageElement?.lastElementChild?.lastElementChild?.appendChild(
      Message_action_section({
        createdAt: formatDistanceToNowStrict(createdAt, {
          addSuffix: true,
        }),
        onClick: onReply,
        sender,
        canReply,
      })
    );
  }
  return MessageElement;
};
export default MessageComponent;

const Message_action_section = ({
  createdAt,
  sender,
  canReply,
  onClick,
}: {
  onClick: (sender?: string) => void;
  sender?: string;
  createdAt: string;
  canReply?: boolean;
}) => {
  const container = document.createElement("div");
  container.classList.add("message-action-section");
  container.innerHTML = `<span class="text-neutral-400 text-xs capitalize font-light">${createdAt}</span>`;

  const reply_btn = document.createElement("button");
  reply_btn.classList.add("reply-button");
  reply_btn.onclick = () => onClick(sender);
  reply_btn.textContent = "reply";

  if (sender && canReply) {
    container.appendChild(reply_btn);
  }

  return container;
};
