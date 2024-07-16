export type StatusTypes = "connecting" | "connected" | "disconnected";
export interface HeaderPorps {
  title: string;
  sub_title: string;
  currentRoom: string;
  status: StatusTypes;
}

const Header = ({}: Partial<HeaderPorps>) => {
  const chat_header = document.getElementById("chat-header") as HTMLDivElement;
  const content = `
  <div class="" ></div>
  <div class="" ></div> 
  `;
};

export default Header;
