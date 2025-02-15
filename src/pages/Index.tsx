
import { useState } from "react";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { Message } from "@/types/chat";
import { sendMessage } from "@/services/chat";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (text: string) => {
    try {
      setIsLoading(true);
      // Add user message
      const userMessage: Message = { text, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);

      // Get response from webhook
      const response = await sendMessage(text);
      
      // Add assistant message using the output field from the response
      const assistantMessage: Message = {
        text: response.output || "Sorry, I couldn't process that.",
        sender: "assistant",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to send message. Please try again.";
      const description = errorMessage.includes('corsdemo') 
        ? "Click here to enable CORS proxy access"
        : errorMessage;
      
      toast({
        title: "Error",
        description,
        variant: "destructive",
        action: errorMessage.includes('corsdemo') ? {
          label: "Enable Access",
          onClick: () => window.open('https://cors-anywhere.herokuapp.com/corsdemo', '_blank')
        } : undefined
      });
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="container mx-auto flex h-full max-w-2xl flex-col rounded-lg border shadow-sm">
        <div className="border-b p-4">
          <h1 className="text-lg font-semibold">Chat Interface</h1>
        </div>
        <ChatContainer messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Index;
