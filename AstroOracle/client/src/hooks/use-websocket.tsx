import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface UseWebSocketProps {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export function useWebSocket({
  onMessage,
  onConnect,
  onDisconnect,
  reconnectAttempts = 5,
  reconnectInterval = 3000,
}: UseWebSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const attemptCountRef = useRef(0);
  const { toast } = useToast();
  const { t } = useLanguage();

  const connect = () => {
    // Temporarily disable WebSocket connections to fix admin navigation
    console.log('WebSocket connection disabled for admin functionality');
    setConnectionState('disconnected');
    setIsConnected(false);
    return;
    
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionState('connecting');

    try {
      // Determine the WebSocket protocol and URL
      // Fix for localhost:undefined error
      const host = window.location.host || 'localhost:5000';
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${host}/ws`;
      
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        setConnectionState('connected');
        attemptCountRef.current = 0;
        onConnect?.();
        
        toast({
          title: t("connected") || "Connected",
          description: t("connectionEstablished") || "Real-time connection established",
        });
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      socket.onclose = (event) => {
        setIsConnected(false);
        setConnectionState('disconnected');
        onDisconnect?.();

        // Only attempt reconnection if it wasn't a manual close
        if (event.code !== 1000 && attemptCountRef.current < reconnectAttempts) {
          scheduleReconnect();
        } else if (attemptCountRef.current >= reconnectAttempts) {
          toast({
            title: "Connection Failed",
            description: "Unable to establish real-time connection. Please refresh the page.",
            variant: "destructive",
          });
        }
      };

      socket.onerror = () => {
        setConnectionState('error');
        console.error("WebSocket connection error");
      };

    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setConnectionState('error');
      scheduleReconnect();
    }
  };

  const scheduleReconnect = () => {
    if (attemptCountRef.current < reconnectAttempts) {
      attemptCountRef.current += 1;
      
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log(`Reconnection attempt ${attemptCountRef.current}/${reconnectAttempts}`);
        connect();
      }, reconnectInterval * attemptCountRef.current); // Exponential backoff
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.close(1000, "Manual disconnect");
      socketRef.current = null;
    }

    setIsConnected(false);
    setConnectionState('disconnected');
  };

  const sendMessage = (message: WebSocketMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      try {
        socketRef.current.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error("Failed to send WebSocket message:", error);
        toast({
          title: "Send Failed",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } else {
      toast({
        title: "Not Connected",
        description: "Real-time connection is not available. Trying to reconnect...",
        variant: "destructive",
      });
      
      // Attempt to reconnect
      if (connectionState !== 'connecting') {
        connect();
      }
      
      return false;
    }
  };

  // Auto-connect on mount
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isConnected) {
        // Reconnect when page becomes visible and not connected
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isConnected]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      if (!isConnected) {
        connect();
      }
    };

    const handleOffline = () => {
      toast({
        title: "Connection Lost",
        description: "You are offline. Connection will resume when online.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isConnected, toast]);

  return {
    isConnected,
    connectionState,
    connect,
    disconnect,
    sendMessage,
  };
}
