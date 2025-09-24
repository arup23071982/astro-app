import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Image, 
  Mic, 
  Video as VideoIcon, 
  Paperclip, 
  Smile,
  MoreVertical,
  Download,
  Clock
} from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";


interface Message {
  id: string;
  senderId: string;
  message: string;
  messageType: "text" | "image" | "video" | "voice";
  fileUrl?: string;
  timestamp: string;
}

interface ChatProps {
  consultationId: string;
  messages: Message[];
  isActive: boolean;
}

export default function Chat({ consultationId, messages, isActive }: ChatProps) {
  const [messageText, setMessageText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { isConnected, sendMessage } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'chat_message' && message.consultationId === consultationId) {
        queryClient.invalidateQueries({ 
          queryKey: ["/api/consultations", consultationId, "messages"] 
        });
      }
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { message: string; messageType: string; fileUrl?: string }) => {
      const response = await apiRequest("POST", `/api/consultations/${consultationId}/messages`, messageData);
      return response.json();
    },
    onSuccess: (data) => {
      // Send via WebSocket for real-time delivery
      sendMessage({
        type: 'chat_message',
        consultationId,
        senderId: data.senderId,
        message: data.message,
        messageType: data.messageType,
        timestamp: data.timestamp,
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ["/api/consultations", consultationId, "messages"] 
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !isActive) return;

    sendMessageMutation.mutate({
      message: messageText,
      messageType: "text",
    });

    setMessageText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file || !isActive) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      // This would upload file to your storage service
      // For now, we'll simulate the upload
      const fileUrl = URL.createObjectURL(file);
      const messageType = file.type.startsWith('image/') ? 'image' : 
                         file.type.startsWith('video/') ? 'video' : 'text';

      sendMessageMutation.mutate({
        message: file.name,
        messageType,
        fileUrl,
      });

      toast({
        title: "File uploaded",
        description: "Your file has been shared successfully",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(blob);
        
        sendMessageMutation.mutate({
          message: `Voice message (${recordingTime}s)`,
          messageType: "voice",
          fileUrl: audioUrl,
        });
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col" data-testid="chat-component">
      <GlassCard className="flex-1 flex flex-col min-h-[500px]">
        {/* Chat Header */}
        <div className="p-4 border-b border-primary/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="font-semibold text-foreground">"Consultation Chat"</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-muted-foreground">
                {isConnected ? "Connected" : "Connecting..."}
              </span>
            </div>
          </div>
          
          {!isActive && (
            <Badge variant="secondary" className="text-xs">
              "Chat Disabled"
            </Badge>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-96">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smile className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground">
                {isActive ? "Start your conversation here" : "Chat will be available when consultation begins"}
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex flex-col space-y-1" data-testid={`message-${message.id}`}>
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${
                      message.senderId === 'current-user' // This should be replaced with actual user ID check
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted text-foreground'
                    }`}>
                      {message.messageType === "text" && (
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                      )}
                      
                      {message.messageType === "image" && message.fileUrl && (
                        <div>
                          <img 
                            src={message.fileUrl} 
                            alt={"Shared image"} 
                            className="rounded max-w-full h-auto mb-2"
                          />
                          <p className="text-xs opacity-80">{message.message}</p>
                        </div>
                      )}
                      
                      {message.messageType === "voice" && message.fileUrl && (
                        <div className="flex items-center space-x-2">
                          <audio controls className="max-w-full">
                            <source src={message.fileUrl} type="audio/wav" />
                          </audio>
                        </div>
                      )}
                      
                      {message.messageType === "video" && message.fileUrl && (
                        <div>
                          <video 
                            controls 
                            className="rounded max-w-full h-auto mb-2"
                            style={{ maxHeight: '200px' }}
                          >
                            <source src={message.fileUrl} type="video/mp4" />
                          </video>
                          <p className="text-xs opacity-80">{message.message}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {isActive && (
          <div className="p-4 border-t border-primary/20">
            {isRecording ? (
              <div className="flex items-center space-x-4 p-3 glass rounded-lg">
                <div className="flex items-center space-x-2 flex-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm text-foreground">Recording...</span>
                  <span className="text-sm font-mono text-primary">
                    {formatRecordingTime(recordingTime)}
                  </span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={stopRecording}
                  data-testid="stop-recording-button"
                >
                  Stop
                </Button>
              </div>
            ) : (
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={"Type your message... (Press Enter to send, Shift+Enter for new line)"}
                    className="form-input min-h-[60px] max-h-32 resize-none"
                    disabled={sendMessageMutation.isPending}
                    data-testid="message-input"
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  {/* File Upload Options */}
                  <div className="flex space-x-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      accept="image/*,video/*"
                      className="hidden"
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="glass p-2"
                      title="Upload Image/Video"
                      data-testid="file-upload-button"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={startRecording}
                      className="glass p-2"
                      title={"Record Voice Message"}
                      data-testid="record-voice-button"
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Send Button */}
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendMessageMutation.isPending}
                    className="neon-button p-2"
                    title={"Send Message"}
                    data-testid="send-message-button"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
