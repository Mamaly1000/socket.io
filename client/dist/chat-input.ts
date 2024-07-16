export interface FormProps {
  disabled?: boolean;
  message: string;
  room?: string;
  private_id?: string;
}

class ChatInputComponent {
  onSendMessage: (obj: Omit<FormProps, "disabled">) => void;
  chat_form: HTMLFormElement | null;
  chat_input: HTMLTextAreaElement | null;
  chat_submit: HTMLButtonElement | null;
  message: string;
  disabled: boolean;
  private_id?: string;
  room?: string;
  constructor({
    onSendMessage,
  }: {
    onSendMessage: (obj: Omit<FormProps, "disabled">) => void;
  }) {
    this.onSendMessage = onSendMessage;
    this.chat_input = null;
    this.chat_form = null;
    this.chat_submit = null;
    this.message = "";
    this.disabled = true;
    this.private_id = undefined;
    this.room = undefined;
  }
  chat_input_container() {
    const input_container = document.createElement("div");
    input_container.classList.add("input-container");
    input_container.appendChild(this.chat_input_component());
    input_container.appendChild(this.sunbmit_chat_button());
    return input_container;
  }
  chat_input_component() {
    let input = document.getElementById(
      "chat-input-id"
    ) as HTMLTextAreaElement | null;
    if (!!!input) {
      input = document.createElement("textarea");
      input.setAttribute("id", "chat-input-id");
      input.value = this.message;
      input.placeholder = "chat now...";
      input.setAttribute("type", "text");
      input.autofocus = true;
    }
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (this.message.trim().length > 0) {
          this.onSendMessage({
            message: this.message,
            private_id: this.private_id,
            room: this.room,
          });
          this.onReset();
        }
      }
    });
    input.addEventListener("input", () => {
      if (this.chat_submit) {
        this.message = input.value;
        if (input.value.length === 0) {
          this.disabled = true;
          this.chat_submit.disabled = true;
        } else {
          this.disabled = false;
          this.chat_submit.disabled = false;
        }
      }
    });
    return input;
  }
  sunbmit_chat_button() {
    let btn = document.getElementById(
      "send-message-button"
    ) as HTMLButtonElement | null;
    if (!!!btn) {
      btn = document.createElement("button");
      btn.setAttribute("type", "submit");
      btn.setAttribute("id", "send-message-button");
      btn.disabled = this.disabled;
      btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
           <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
      
      `;
    }
    btn.disabled = this.disabled;
    return btn;
  }
  reset_chat_button() {
    const btn = document.createElement("button");
    btn.setAttribute("id", "reset-chat-input");
    btn.classList.add("reset-chat-button");
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      this.onReset();
    });
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`;
    return btn;
  }
  reply_component(privateID?: string) {
    let rep_div = document.getElementById("chat-reply-component");

    if (!!privateID) {
      if (!!!rep_div) {
        rep_div = document.createElement("div");
        rep_div.classList.add("reply-component");
        rep_div.setAttribute("id", "chat-reply-component");
        rep_div.textContent = `reply to ${privateID}`;
        rep_div.addEventListener("click", (e) => {
          e.preventDefault();
          this.setPrivateID(undefined);
          this.reply_component(undefined);
        });
        this.chat_form?.appendChild(rep_div);
      } else {
        rep_div.textContent = `reply to ${privateID}`;
        rep_div.addEventListener("click", (e) => {
          e.preventDefault();
          this.setPrivateID(undefined);
          this.reply_component(undefined);
        });
      }
      this.chat_form?.classList.remove("pb-0");
      this.chat_form?.classList.add("pb-5");
    } else {
      this.chat_form?.removeChild(rep_div!);
      this.chat_form?.classList.remove("pb-5");
      this.chat_form?.classList.add("pb-0");
    }
  }
  onReset() {
    if (!!this.chat_input && !!this.chat_submit) {
      this.disabled = true;
      this.chat_submit.disabled = true;
      this.message = "";
      this.chat_input.value = "";
    }
  }
  setRoom(room?: string) {
    this.room = room;
  }
  setPrivateID(id?: string) {
    this.private_id = id;
    this.reply_component(id);
  }
  render() {
    const chat_form = document.createElement("form");
    chat_form.setAttribute("id", "chat-form");

    chat_form.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault();
      if (this.message.trim().length > 0) {
        this.onSendMessage({
          message: this.message,
          private_id: this.private_id,
          room: this.room,
        });
        this.onReset();
      }
    });

    chat_form.appendChild(this.reset_chat_button());
    chat_form.appendChild(this.chat_input_container());
    document.body.appendChild(chat_form);
    this.chat_form = document.getElementById("chat-form") as any;
    this.chat_input = document.getElementById("chat-input-id") as any;
    this.chat_submit = document.getElementById("send-message-button") as any;
  }
}

export default ChatInputComponent;
