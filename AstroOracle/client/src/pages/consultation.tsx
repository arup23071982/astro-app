import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, MessageSquare, Phone, Clock, User, Calendar, FileText, Settings } from "lucide-react";
import VideoCall from "@/components/consultation/video-call";
import Chat from "@/components/consultation/chat";
import { useToast } from "@/hooks/use-toast";


export default function Consultation() {
  const [match, params] = useRoute("/consultation/:id");
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("details");
  const [consultationStarted, setConsultationStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { toast } = useToast();

  const consultationId = params?.id;

  const { data: consultation, isLoading, error } = useQuery({
    queryKey: ["/api/consultations", consultationId],
    enabled: !!consultationId,
  });

  const { data: messages } = useQuery({
    queryKey: ["/api/consultations", consultationId, "messages"],
    enabled: !!consultationId && consultationStarted,
    refetchInterval: consultationStarted ? 1000 : false,
  });

  const { data: user } = useQuery({
    queryKey: ["/api/profile"],
    enabled: !!localStorage.getItem("token"),
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      toast({
        title: "Authentication Required",
        description: "Please login to access this consultation",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }
  }, [setLocation, toast]);

  useEffect(() => {
    if (consultation && consultationStarted) {
      const startTime = new Date().getTime();
      const duration = consultation.duration * 60 * 1000; // Convert to milliseconds
      
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const elapsed = now - startTime;
        const remaining = Math.max(0, duration - elapsed);
        
        setTimeRemaining(remaining);
        
        if (remaining <= 5 * 60 * 1000 && remaining > 4 * 60 * 1000) {
          // Alert 5 minutes before end
          toast({
            title: "5 Minutes Remaining",
            description: "Your consultation will end in 5 minutes",
          });
        }
        
        if (remaining <= 0) {
          clearInterval(timer);
          handleConsultationEnd();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [consultation, consultationStarted, toast]);

  const handleConsultationEnd = () => {
    setConsultationStarted(false);
    toast({
      title: "Consultation Ended",
      description: "Thank you for your consultation. You will receive a summary soon.",
    });
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { variant: "default" as const, label: "Scheduled" },
      ongoing: { variant: "secondary" as const, label: "In Progress" },
      completed: { variant: "outline" as const, label: "Completed" },
      cancelled: { variant: "destructive" as const, label: "Cancelled" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-5 h-5" />;
      case "audio":
        return <Phone className="w-5 h-5" />;
      case "chat":
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !consultation) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <GlassCard className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-4">Consultation Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The consultation you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => setLocation("/")} className="neon-button">
            Go Home
          </Button>
        </GlassCard>
      </div>
    );
  }

  const canStartConsultation = () => {
    const scheduledTime = new Date(consultation.scheduledAt);
    const now = new Date();
    const timeDiff = scheduledTime.getTime() - now.getTime();
    
    // Allow starting 10 minutes early
    return timeDiff <= 10 * 60 * 1000 && consultation.status === "scheduled";
  };

  return (
    <div className="min-h-screen pt-16 pb-16" data-testid="consultation-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <GlassCard className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getTypeIcon(consultation.type)}
                <h1 className="text-2xl font-bold text-foreground capitalize" data-testid="consultation-title">
                  {consultation.type} Consultation
                </h1>
              </div>
              {getStatusBadge(consultation.status)}
            </div>
            
            {consultationStarted && timeRemaining > 0 && (
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-lg font-bold text-primary">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {new Date(consultation.scheduledAt).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Duration: {consultation.duration} minutes
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-primary">
                ₹{consultation.price}
              </span>
              <Badge variant="outline" className="text-xs">
                {consultation.plan}
              </Badge>
            </div>
          </div>
        </GlassCard>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="glass-card mb-6">
                <TabsTrigger value="details" className="text-sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Details
                </TabsTrigger>
                {(consultationStarted || consultation.type === "chat") && (
                  <TabsTrigger value="chat" className="text-sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </TabsTrigger>
                )}
                {consultationStarted && consultation.type === "video" && (
                  <TabsTrigger value="video" className="text-sm">
                    <Video className="w-4 h-4 mr-2" />
                    Video
                  </TabsTrigger>
                )}
                <TabsTrigger value="settings" className="text-sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <GlassCard className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">"Consultation Details"</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">"Type & Plan"</h4>
                      <p className="text-muted-foreground capitalize">
                        {consultation.type} consultation - {consultation.plan}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">"Scheduled Time"</h4>
                      <p className="text-muted-foreground">
                        {new Date(consultation.scheduledAt).toLocaleString()}
                      </p>
                    </div>

                    {consultation.notes && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">"Your Notes"</h4>
                        <p className="text-muted-foreground">{consultation.notes}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">"Language"</h4>
                      <p className="text-muted-foreground capitalize">
                        {consultation.language === "en" ? "English" : 
                         consultation.language === "hi" ? "Hindi" : 
                         consultation.language === "bn" ? "Bengali" : consultation.language}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">"Payment Status"</h4>
                      <Badge variant={consultation.paymentStatus === "paid" ? "default" : "secondary"}>
                        {consultation.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  {canStartConsultation() && !consultationStarted && (
                    <div className="mt-6 p-4 glass rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">"Ready to Start"</h4>
                      <p className="text-muted-foreground mb-4">
                        "Your consultation time is approaching. You can start your session now."
                      </p>
                      <Button
                        onClick={() => setConsultationStarted(true)}
                        className="neon-button"
                        data-testid="start-consultation-button"
                      >
                        "Start Consultation"
                      </Button>
                    </div>
                  )}
                </GlassCard>
              </TabsContent>

              <TabsContent value="chat">
                <Chat 
                  consultationId={consultationId!}
                  messages={messages || []}
                  isActive={consultationStarted || consultation.type === "chat"}
                />
              </TabsContent>

              <TabsContent value="video">
                {consultation.type === "video" && consultationStarted && (
                  <VideoCall
                    consultationId={consultationId!}
                    isAstrologer={user?.isAdmin || false}
                    onEndCall={handleConsultationEnd}
                  />
                )}
              </TabsContent>

              <TabsContent value="settings">
                <GlassCard className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Audio Settings</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="glass w-full justify-start">
                          Test Microphone
                        </Button>
                        <Button variant="outline" className="glass w-full justify-start">
                          Test Speakers
                        </Button>
                      </div>
                    </div>

                    {consultation.type === "video" && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Video Settings</h4>
                        <div className="space-y-2">
                          <Button variant="outline" className="glass w-full justify-start">
                            Test Camera
                          </Button>
                          <Button variant="outline" className="glass w-full justify-start">
                            Video Quality: Auto
                          </Button>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Notifications</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-sm text-muted-foreground">Sound notifications</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-sm text-muted-foreground">Chat message alerts</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Astrologer Info */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Your Astrologer</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Arup Shastri</h4>
                  <p className="text-sm text-muted-foreground">Expert Vedic Astrologer</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                18+ years of experience in Vedic astrology, palmistry, and cosmic guidance.
              </p>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-yellow-500">⭐</span>
                ))}
                <span className="text-sm text-muted-foreground ml-2">(4.9/5)</span>
              </div>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="glass w-full justify-start text-sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" className="glass w-full justify-start text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Reschedule
                </Button>
                <Button variant="outline" className="glass w-full justify-start text-sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </GlassCard>

            {/* Consultation Guidelines */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Guidelines</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Ensure stable internet connection</li>
                <li>• Be in a quiet environment</li>
                <li>• Have your questions ready</li>
                <li>• Recording is not permitted</li>
                <li>• Consultation is strictly confidential</li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
