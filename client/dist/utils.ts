export default function scrollToBottom(element: HTMLElement) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
}