import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  ThumbsUp, 
  ThumbsDown,
  Minimize2,
  Maximize2,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SupportChatMessage } from "@shared/schema";
// AutoTranslate import removed - using t() function instead
import { useLanguage } from "@/contexts/LanguageContext";

interface ChatSession {
  sessionId: string;
  messages: SupportChatMessage[];
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  // Generate session ID on mount
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
    }
  }, [sessionId]);

  // Get chat messages for current session
  const { data: chatSession } = useQuery<{ messages: SupportChatMessage[] }>({
    queryKey: ["/api/support-chat", sessionId],
    enabled: !!sessionId && isOpen,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { message: string; sessionId: string }) => {
      setIsTyping(true);
      const response = await apiRequest("POST", "/api/support-chat/message", messageData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support-chat", sessionId] });
      setMessage("");
      setIsTyping(false);
    },
    onError: () => {
      setIsTyping(false);
      toast({
        title: t("error") || "Error",
        description: t("failedToSendMessage") || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Rate message mutation
  const rateMessageMutation = useMutation({
    mutationFn: async ({ messageId, isHelpful }: { messageId: string; isHelpful: boolean }) => {
      const response = await apiRequest("POST", `/api/support-chat/rate/${messageId}`, { isHelpful });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support-chat", sessionId] });
    }
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatSession?.messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !sessionId) return;
    
    sendMessageMutation.mutate({
      message: message.trim(),
      sessionId
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRateMessage = (messageId: string, isHelpful: boolean) => {
    rateMessageMutation.mutate({ messageId, isHelpful });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-24 w-14 h-14 rounded-full shadow-2xl neon-button z-50 group"
        style={{ 
          background: 'linear-gradient(135deg, hsl(279, 100%, 50%) 0%, hsl(195, 100%, 50%) 100%)',
          boxShadow: '0 0 30px rgba(186, 85, 211, 0.6), 0 8px 25px rgba(0, 0, 0, 0.3)'
        }}
        data-testid="chatbot-open-button"
      >
        <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-pulse">
          <Sparkles className="w-3 h-3 text-primary-foreground" />
        </div>
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-24 z-50" data-testid="chatbot-widget">
      <GlassCard 
        className={`w-96 transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-[600px]'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(14, 8, 30, 0.95) 0%, rgba(26, 11, 46, 0.95) 100%)',
          backdropFilter: 'blur(20px) saturate(1.8)',
          border: '1px solid rgba(186, 85, 211, 0.3)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(186, 85, 211, 0.2)'
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-primary/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-primary neon-text">AI Assistant</h3>
              <p className="text-xs text-muted-foreground">
                {isTyping ? "Typing..." : "Online • Here to help"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-muted-foreground hover:text-primary"
              data-testid="chatbot-minimize-button"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-primary"
              data-testid="chatbot-close-button"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[440px]" data-testid="chatbot-messages">
              {!chatSession?.messages || chatSession.messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-primary mb-2">Welcome to AI Support!</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    I'm here to help with questions about consultations, courses, products, and more.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="outline" className="mr-2">Consultation Booking</Badge>
                    <Badge variant="outline" className="mr-2">Course Information</Badge>
                    <Badge variant="outline" className="mr-2">Product Details</Badge>
                    <Badge variant="outline">Technical Support</Badge>
                  </div>
                </div>
              ) : (
                chatSession.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.sender === 'user' ? 'bg-primary ml-2' : 'bg-gradient-to-br from-purple-500 to-pink-500 mr-2'
                      }`}>
                        {msg.sender === 'user' ? (
                          <User className="w-4 h-4 text-primary-foreground" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`glass p-3 rounded-lg ${
                        msg.sender === 'user' 
                          ? 'bg-primary/20 border-primary/30' 
                          : 'bg-secondary/20 border-secondary/30'
                      }`}>
                        <p className="text-sm text-foreground">{msg.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}
                        </p>
                        {msg.sender === 'bot' && (
                          <div className="flex items-center space-x-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRateMessage(msg.id, true)}
                              className="text-xs text-muted-foreground hover:text-green-500"
                              disabled={msg.isHelpful !== undefined}
                            >
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              {msg.isHelpful === true ? t("helpful") : ""}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRateMessage(msg.id, false)}
                              className="text-xs text-muted-foreground hover:text-red-500"
                              disabled={msg.isHelpful !== undefined}
                            >
                              <ThumbsDown className="w-3 h-3 mr-1" />
                              {msg.isHelpful === false ? t("notHelpful") : ""}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="glass p-3 rounded-lg bg-secondary/20 border-secondary/30">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-primary/20">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("askAnything") || "Ask me anything about our services..."}
                  className="flex-1 bg-background/50 border-primary/30 focus:border-primary"
                  disabled={sendMessageMutation.isPending}
                  data-testid="chatbot-input"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  className="neon-button"
                  data-testid="chatbot-send-button"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                AI responses are generated automatically. For complex issues, request human support.
              </p>
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
}