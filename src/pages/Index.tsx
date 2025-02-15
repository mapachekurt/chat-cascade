
import { useState } from "react";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { Message } from "@/types/chat";
import { sendMessage } from "@/services/chat";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight, Star, Plus, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CHAT_ITEMS = [
  { id: 1, title: "Just chat", starred: true },
  { id: 2, title: "Markdown 101 (Example)", starred: true },
  { id: 3, title: "Software Developer (Example)", starred: true },
  { id: 4, title: "CORS-Webhook", starred: false },
  { id: 5, title: "OnboardFlow", starred: false },
  { id: 6, title: "Untitled", starred: false },
  { id: 7, title: "Github Copilot Chat", starred: false },
  { id: 8, title: "Fullstack Software Developer", starred: false },
  { id: 9, title: "Translator (Example)", starred: false },
  { id: 10, title: "Social Media Influencer (Example)", starred: false },
  { id: 11, title: "Travel Guide (Example)", starred: false },
];

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
      const description = errorMessage.includes('corsdemo') 
        ? "Click here to enable CORS proxy access"
        : errorMessage;
      
      toast({
        title: "Error",
        description,
        action: errorMessage.includes('corsdemo') ? {
          altText: "Enable CORS Access",
          onClick: () => window.open('https://cors-anywhere.herokuapp.com/corsdemo', '_blank')
        } : undefined,
        variant: "destructive"
      });
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "h-full border-r bg-sidebar-background transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Chatbox</h2>
          </div>
          <div className="flex-1 overflow-auto p-3">
            {CHAT_ITEMS.map((item) => (
              <div
                key={item.id}
                className="mb-1 flex items-center rounded-lg px-3 py-2 hover:bg-sidebar-accent cursor-pointer"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span className="flex-1 truncate">{item.title}</span>
                {item.starred && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
              </div>
            ))}
          </div>
          <div className="border-t p-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => toast({ description: "New chat created" })}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 rounded-none border bg-background p-0.5"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

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
