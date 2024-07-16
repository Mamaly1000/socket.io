import { formatDistanceToNowStrict } from "date-fns";

export type MessageTypes = "message" | "info" | "error" | "warn" | "private";

const MessageComponent = ({
  message,
  type,
  createdAt,
  sender,
}: {
  message: string;
  type: MessageTypes;
  createdAt: Date;
  sender?: string;
}) => {
  const MessageElement = document.createElement("article");
  MessageElement.classList.add("message-component", type);
  const showSender = type === "message" || type === "private";
  MessageElement.innerHTML = `
 ${showSender ? ` <div class="circle circle-${type}" ></div>` : ""}
  <div class="flex flex-col items-start justify-start w-full max-w-full" >
  <div class="message-text" >${message}</div>
 ${
   showSender
     ? ` <div class="message-info" >
 ${sender ? `<span>sender: ${sender}</span>` : ""}
  <span>${formatDistanceToNowStrict(createdAt, { addSuffix: true })}</span>
  </div>  `
     : ""
 }
  </div>
    `;
  return MessageElement;
};
export default MessageComponent;
