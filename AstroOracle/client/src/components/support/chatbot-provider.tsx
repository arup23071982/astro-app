import { useState, createContext, useContext } from "react";
import AIChatbot from "./ai-chatbot";

interface ChatbotContextType {
  isOpen: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
}

interface ChatbotProviderProps {
  children: React.ReactNode;
}

export function ChatbotProvider({ children }: ChatbotProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openChatbot = () => setIsOpen(true);
  const closeChatbot = () => setIsOpen(false);
  const toggleChatbot = () => setIsOpen(!isOpen);

  return (
    <ChatbotContext.Provider value={{ isOpen, openChatbot, closeChatbot, toggleChatbot }}>
      {children}
      <AIChatbot isOpen={isOpen} onToggle={toggleChatbot} />
    </ChatbotContext.Provider>
  );
}