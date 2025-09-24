import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  MessageSquare,
  Clock,
  AlertTriangle,
  Settings,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ConsultationTimer {
  totalDuration: number; // in seconds
  remainingTime: number; // in seconds
  isActive: boolean;
  isPaused: boolean;
  warnings: {
    fifteenMin: boolean;
    fiveMin: boolean;
    oneMin: boolean;
  };
}

export default function ConsultationSession() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string>("");
  const [timer, setTimer] = useState<ConsultationTimer>({
    totalDuration: 3600, // Default 60 minutes
    remainingTime: 3600,
    isActive: false,
    isPaused: false,
    warnings: {
      fifteenMin: false,
      fiveMin: false,
      oneMin: false
    }
  });
  const [mediaControls, setMediaControls] = useState({
    videoEnabled: true,
    audioEnabled: true,
    screenShare: false
  });
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const audioWarningRef = useRef<HTMLAudioElement | null>(null);

  // Get consultation session data
  const { data: sessionData } = useQuery({
    queryKey: ['/api/consultation-session', sessionId],
    enabled: !!sessionId
  });

  // Initialize session from URL params or consultation data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('session');
    if (id) {
      setSessionId(id);
    }
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (timer.isActive && !timer.isPaused && timer.remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          const newRemainingTime = prev.remainingTime - 1;
          const newTimer = { ...prev, remainingTime: newRemainingTime };
          
          // Check for warning thresholds
          const fifteenMinutes = 15 * 60;
          const fiveMinutes = 5 * 60;
          const oneMinute = 60;
          
          // 15-minute warning
          if (newRemainingTime === fifteenMinutes && !prev.warnings.fifteenMin) {
            newTimer.warnings.fifteenMin = true;
            showTimeWarning("15 minutes remaining in your consultation");
          }
          
          // 5-minute warning
          if (newRemainingTime === fiveMinutes && !prev.warnings.fiveMin) {
            newTimer.warnings.fiveMin = true;
            showTimeWarning("5 minutes remaining - please wrap up your consultation");
          }
          
          // 1-minute warning
          if (newRemainingTime === oneMinute && !prev.warnings.oneMin) {
            newTimer.warnings.oneMin = true;
            showTimeWarning("1 minute remaining - consultation ending soon", "destructive");
          }
          
          // Session auto-end
          if (newRemainingTime <= 0) {
            endSession();
            return { ...prev, remainingTime: 0, isActive: false };
          }
          
          return newTimer;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isActive, timer.isPaused, timer.remainingTime]);

  // Initialize timer with consultation duration
  useEffect(() => {
    if (sessionData && typeof sessionData === 'object' && sessionData !== null && 'session' in sessionData) {
      const session = (sessionData as any).session;
      if (session && session.duration) {
        const durationInSeconds = session.duration * 60; // Convert minutes to seconds
        setTimer(prev => ({
          ...prev,
          totalDuration: durationInSeconds,
          remainingTime: durationInSeconds
        }));
      }
    }
  }, [sessionData]);

  const showTimeWarning = (message: string, variant: "default" | "destructive" = "default") => {
    toast({
      title: "Time Alert",
      description: message,
      variant,
    });
    
    // Play warning sound
    if (audioWarningRef.current) {
      audioWarningRef.current.play();
    }
  };

  const startTimer = () => {
    setTimer(prev => ({ ...prev, isActive: true, isPaused: false }));
    toast({
      title: "Consultation Started",
      description: "Timer is now active",
    });
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isPaused: !prev.isPaused }));
    toast({
      title: timer.isPaused ? "Timer Resumed" : "Timer Paused",
      description: timer.isPaused ? "Consultation timer resumed" : "Consultation timer paused",
    });
  };

  const extendTimer = (additionalMinutes: number) => {
    const additionalSeconds = additionalMinutes * 60;
    setTimer(prev => ({
      ...prev,
      totalDuration: prev.totalDuration + additionalSeconds,
      remainingTime: prev.remainingTime + additionalSeconds
    }));
    toast({
      title: "Time Extended",
      description: `Added ${additionalMinutes} minutes to consultation`,
    });
  };

  const endSession = () => {
    setTimer(prev => ({ ...prev, isActive: false, isPaused: false }));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    toast({
      title: "Consultation Ended",
      description: "Thank you for your session with Astrologer Arup Shastri",
    });
    
    // Redirect to feedback page after 3 seconds
    setTimeout(() => {
      setLocation('/consultation-feedback');
    }, 3000);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (): string => {
    if (timer.remainingTime <= 60) return "text-red-400"; // Last minute
    if (timer.remainingTime <= 300) return "text-yellow-400"; // Last 5 minutes
    if (timer.remainingTime <= 900) return "text-orange-400"; // Last 15 minutes
    return "text-primary"; // Normal
  };

  const getProgressPercentage = (): number => {
    return ((timer.totalDuration - timer.remainingTime) / timer.totalDuration) * 100;
  };

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Session Header */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold neon-text mb-2">Live Consultation</h1>
                <p className="text-muted-foreground">
                  Session with Astrologer Arup Shastri • {(sessionData as any)?.session?.type || 'General Consultation'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-green-400 border-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                  LIVE
                </Badge>
                <Users className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">2 participants</span>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Video/Audio Section */}
            <div className="lg:col-span-3">
              <GlassCard className="p-6 h-96">
                <div className="relative w-full h-full bg-black/20 rounded-lg flex items-center justify-center">
                  {/* Video placeholder - integrate with your video service */}
                  <div className="text-center">
                    <Video className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">Video consultation area</p>
                    <p className="text-sm text-muted-foreground">Integrate with Jitsi Meet, Zoom, or your preferred video service</p>
                  </div>
                </div>
                
                {/* Media Controls */}
                <div className="flex items-center justify-center mt-4 space-x-4">
                  <Button
                    variant={mediaControls.audioEnabled ? "default" : "destructive"}
                    size="lg"
                    onClick={() => setMediaControls(prev => ({ ...prev, audioEnabled: !prev.audioEnabled }))}
                    className="rounded-full p-4"
                    data-testid="toggle-audio"
                  >
                    {mediaControls.audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    variant={mediaControls.videoEnabled ? "default" : "destructive"}
                    size="lg"
                    onClick={() => setMediaControls(prev => ({ ...prev, videoEnabled: !prev.videoEnabled }))}
                    className="rounded-full p-4"
                    data-testid="toggle-video"
                  >
                    {mediaControls.videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={endSession}
                    className="rounded-full p-4"
                    data-testid="end-call"
                  >
                    <Phone className="w-5 h-5 rotate-180" />
                  </Button>
                </div>
              </GlassCard>
            </div>

            {/* Timer & Controls Sidebar */}
            <div className="space-y-6">
              
              {/* Consultation Timer */}
              <GlassCard className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary mr-2" />
                  <h3 className="text-lg font-semibold">Session Timer</h3>
                </div>
                
                {/* Timer Display */}
                <div className={`text-4xl font-mono font-bold mb-4 ${getTimerColor()}`} data-testid="timer-display">
                  {formatTime(timer.remainingTime)}
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-black/20 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-primary to-pink-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
                
                <div className="text-sm text-muted-foreground mb-4">
                  {Math.floor(timer.remainingTime / 60)} minutes remaining
                </div>

                {/* Timer Controls */}
                <div className="space-y-2">
                  {!timer.isActive ? (
                    <NeonButton 
                      onClick={startTimer} 
                      className="w-full"
                      data-testid="start-timer"
                    >
                      Start Session
                    </NeonButton>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={pauseTimer}
                      className="w-full"
                      data-testid="pause-timer"
                    >
                      {timer.isPaused ? "Resume" : "Pause"}
                    </Button>
                  )}
                  
                  {/* Quick Extension Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      variant="outline" 
                      size="sm"
                      onClick={() => extendTimer(15)}
                      data-testid="extend-15min"
                    >
                      +15min
                    </Button>
                    <Button
                      variant="outline"
                      size="sm" 
                      onClick={() => extendTimer(30)}
                      data-testid="extend-30min"
                    >
                      +30min
                    </Button>
                  </div>
                </div>
              </GlassCard>

              {/* Session Info */}
              <GlassCard className="p-4">
                <h4 className="font-semibold mb-3">Session Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="capitalize">{(sessionData as any)?.session?.type || 'General'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{(sessionData as any)?.session?.duration || 60} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mode:</span>
                    <span className="capitalize">{(sessionData as any)?.session?.type || 'Video Call'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Language:</span>
                    <span>English</span>
                  </div>
                </div>
              </GlassCard>

              {/* Quick Chat */}
              <GlassCard className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Quick Chat</h4>
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Chat functionality can be integrated here for text communication during the session.
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Warning Messages */}
          {timer.remainingTime <= 300 && timer.isActive && (
            <GlassCard className="p-4 border-yellow-500/20 bg-yellow-500/5">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <div>
                  <h4 className="font-semibold text-yellow-400">Time Running Low</h4>
                  <p className="text-sm text-muted-foreground">
                    Please prepare to conclude your consultation.
                  </p>
                </div>
              </div>
            </GlassCard>
          )}

        </div>
      </div>

      {/* Audio element for warning sounds */}
      <audio ref={audioWarningRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+L2um4gCaWqd1dqhY1uTUlQp9jkrIJaT1Bc" />
      </audio>

    </div>
  );
}