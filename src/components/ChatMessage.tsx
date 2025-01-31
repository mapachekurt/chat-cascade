import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={cn(
        "flex w-full animate-message-fade-in opacity-0",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
          isUser
            ? "bg-chat-bubble-user text-white"
            : "bg-chat-bubble-assistant text-gray-900"
        )}
      >
        {message.text}
      </div>
    </div>
  );
};