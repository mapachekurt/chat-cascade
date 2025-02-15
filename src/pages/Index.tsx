
import { useState } from "react";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { Message } from "@/types/chat";
import { sendMessage } from "@/services/chat";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { toast } = useToast();

  const handleSendMessage = async (text: string) => {
    try {
      setIsLoading(true);
      const userMessage: Message = { text, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);

      const response = await sendMessage(text);
      
      const assistantMessage: Message = {
        text: response.output || "Sorry, I couldn't process that.",
        sender: "assistant",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to send message. Please try again.";
      toast({
        title: "Error",
        description: errorMessage.includes('corsdemo') 
          ? "Click here to enable CORS proxy access"
          : errorMessage,
        action: errorMessage.includes('corsdemo') ? {
          label: "Enable CORS Access",
          onClick: () => window.open('https://cors-anywhere.herokuapp.com/corsdemo', '_blank')
        } : undefined,
        variant: "destructive"
      });
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    toast({ description: "New chat created" });
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "relative h-full border-r bg-sidebar-background transition-all duration-300 flex flex-col",
          isSidebarOpen ? "w-64" : "w-12"
        )}
      >
        {/* Header with collapse button */}
        <div className="border-b p-4 flex items-center">
          <h2 className={cn("text-lg font-semibold transition-opacity duration-300",
            isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
          )}>
            Chatbox
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-auto"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex-1"></div>

        {/* Footer with New Chat button */}
        <div className="border-t p-3">
          <Button
            variant="outline"
            className={cn(
              "transition-all duration-300",
              isSidebarOpen
                ? "w-full justify-start"
                : "w-8 h-8 p-0"
            )}
            onClick={handleNewChat}
          >
            <Plus className="h-4 w-4" />
            <span className={cn(
              "ml-2 transition-opacity duration-300",
              isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            )}>
              New Chat
            </span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <div className="container mx-auto flex h-full max-w-2xl flex-col rounded-lg shadow-sm">
          <div className="border-b p-4">
            <h1 className="text-lg font-semibold">Chat Interface</h1>
          </div>
          <ChatContainer messages={messages} />
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Index;
