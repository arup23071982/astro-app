import { useEffect, useRef, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Settings, 
  Users,
  Monitor,
  Volume2,
  VolumeX,
  Camera,
  CameraOff
} from "lucide-react";
import { initializeJitsi, JitsiMeetInstance } from "@/lib/jitsi";
import { useToast } from "@/hooks/use-toast";


interface VideoCallProps {
  consultationId: string;
  isAstrologer: boolean;
  onEndCall: () => void;
}

export default function VideoCall({ consultationId, isAstrologer, onEndCall }: VideoCallProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const [jitsiInstance, setJitsiInstance] = useState<JitsiMeetInstance | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [participants, setParticipants] = useState(1);
  const [videoQuality, setVideoQuality] = useState("auto");
  const [selectedBackground, setSelectedBackground] = useState("none");
  const { toast } = useToast();

  const backgrounds = [
    { value: "none", label: "No Background" },
    { value: "space1", label: "Cosmic Galaxy" },
    { value: "space2", label: "Starry Night" },
    { value: "space3", label: "Nebula View" },
    { value: "planets", label: "Solar System" },
    { value: "astro1", label: "Zodiac Circle" },
    { value: "astro2", label: "Sacred Geometry" },
  ];

  const videoQualities = [
    { value: "auto", label: "Auto (Recommended)" },
    { value: "240", label: "240p" },
    { value: "360", label: "360p" },
    { value: "480", label: "480p" },
    { value: "720", label: "720p (HD)" },
    { value: "1080", label: "1080p (Full HD)" },
  ];

  useEffect(() => {
    if (jitsiContainerRef.current) {
      initializeJitsiMeet();
    }

    return () => {
      if (jitsiInstance) {
        jitsiInstance.dispose();
      }
    };
  }, []);

  const initializeJitsiMeet = async () => {
    if (!jitsiContainerRef.current) return;

    try {
      const roomName = `consultation-${consultationId}`;
      const displayName = isAstrologer ? "Astrologer Arup Shastri (Jai Guru)" : "Client";

      const instance = await initializeJitsi({
        parentNode: jitsiContainerRef.current,
        roomName,
        displayName,
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          enableClosePage: false,
          prejoinPageEnabled: false,
          disableModeratorIndicator: false,
          defaultLanguage: "en",
          resolution: videoQuality === "auto" ? undefined : parseInt(videoQuality),
          constraints: {
            video: {
              height: { 
                ideal: videoQuality === "auto" ? 720 : parseInt(videoQuality),
                max: isAstrologer ? 1080 : 720
              }
            }
          },
          // Custom branding for astrologer
          ...(isAstrologer && {
            brandingRoomAlias: "Jai Guru Astro Remedy",
            toolbarButtons: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 
              'fullscreen', 'fodeviceselection', 'hangup', 'profile',
              'chat', 'recording', 'livestreaming', 'etherpad', 
              'sharedvideo', 'settings', 'raisehand', 'videoquality',
              'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
              'tileview', 'videobackgroundblur', 'download', 'help'
            ]
          })
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          BRAND_WATERMARK_LINK: "",
          SHOW_POWERED_BY: false,
          DEFAULT_LOGO_URL: isAstrologer ? "/logo-jg.png" : "",
          APP_NAME: "Jai Guru Astro Remedy",
          NATIVE_APP_NAME: "Jai Guru Astro Remedy",
          PROVIDER_NAME: "Astrologer Arup Shastri",
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          DISABLE_PRESENCE_STATUS: false,
          DISPLAY_WELCOME_PAGE_CONTENT: false,
          DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
          HIDE_INVITE_MORE_HEADER: true,
          JITSI_WATERMARK_LINK: "",
          LANG_DETECTION: false,
          LOCAL_THUMBNAIL_RATIO: 16 / 9,
          MAXIMUM_ZOOMING_COEFFICIENT: 1.3,
          MOBILE_APP_PROMO: false,
          OPTIMAL_BROWSERS: ["chrome", "chromium", "firefox", "nwjs", "electron", "safari"],
          POLICY_LOGO: null,
          RECENT_LIST_ENABLED: false,
          REMOTE_THUMBNAIL_RATIO: 1,
          SETTINGS_SECTIONS: ["devices", "language", "moderator", "profile", "calendar"],
          SHOW_CHROME_EXTENSION_BANNER: false,
          TOOLBAR_TIMEOUT: 4000,
          UNSUPPORTED_BROWSERS: [],
          VIDEO_LAYOUT_FIT: "both"
        },
        onApiReady: (api) => {
          setJitsiInstance(api);
          setIsCallActive(true);

          // Add event listeners
          api.addEventListener('participantJoined', (participant: any) => {
            setParticipants(prev => prev + 1);
            toast({
              title: "Participant Joined",
              description: `${participant.displayName} has joined the consultation`,
            });
          });

          api.addEventListener('participantLeft', (participant: any) => {
            setParticipants(prev => Math.max(1, prev - 1));
            toast({
              title: "Participant Left",
              description: `${participant.displayName} has left the consultation`,
            });
          });

          api.addEventListener('videoConferenceJoined', () => {
            setIsCallActive(true);
            
            // Apply astrologer-specific settings
            if (isAstrologer) {
              // Set custom avatar or background
              if (selectedBackground !== "none") {
                api.executeCommand('toggleVirtualBackground', selectedBackground);
              }
            }
          });

          api.addEventListener('videoConferenceLeft', () => {
            setIsCallActive(false);
            onEndCall();
          });

          api.addEventListener('audioMuteStatusChanged', (muted: boolean) => {
            setIsAudioEnabled(!muted);
          });

          api.addEventListener('videoMuteStatusChanged', (muted: boolean) => {
            setIsVideoEnabled(!muted);
          });
        }
      });

    } catch (error) {
      console.error("Failed to initialize Jitsi Meet:", error);
      toast({
        title: "Video Call Error",
        description: "Failed to initialize video call. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  const toggleVideo = () => {
    if (jitsiInstance) {
      jitsiInstance.executeCommand('toggleVideo');
    }
  };

  const toggleAudio = () => {
    if (jitsiInstance) {
      jitsiInstance.executeCommand('toggleAudio');
    }
  };

  const hangUp = () => {
    if (jitsiInstance) {
      jitsiInstance.executeCommand('hangup');
    }
    onEndCall();
  };

  const changeVideoQuality = (quality: string) => {
    setVideoQuality(quality);
    if (jitsiInstance) {
      if (quality === "auto") {
        jitsiInstance.executeCommand('setVideoQuality', -1);
      } else {
        jitsiInstance.executeCommand('setVideoQuality', parseInt(quality));
      }
    }
  };

  const changeBackground = (background: string) => {
    setSelectedBackground(background);
    if (jitsiInstance && background !== "none") {
      jitsiInstance.executeCommand('toggleVirtualBackground', background);
    } else if (jitsiInstance) {
      jitsiInstance.executeCommand('toggleVirtualBackground', false);
    }
  };

  return (
    <div className="space-y-6" data-testid="video-call">
      {/* Video Call Container */}
      <GlassCard className="p-0 overflow-hidden min-h-[500px]">
        <div 
          ref={jitsiContainerRef} 
          className="w-full h-full min-h-[500px] rounded-xl overflow-hidden"
          data-testid="jitsi-container"
        />
      </GlassCard>

      {/* Controls */}
      <GlassCard className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Primary Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant={isAudioEnabled ? "default" : "destructive"}
              size="lg"
              onClick={toggleAudio}
              className="rounded-full w-12 h-12 p-0"
              data-testid="toggle-audio-button"
            >
              {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>

            <Button
              variant={isVideoEnabled ? "default" : "destructive"}
              size="lg"
              onClick={toggleVideo}
              className="rounded-full w-12 h-12 p-0"
              data-testid="toggle-video-button"
            >
              {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>

            <Button
              variant="destructive"
              size="lg"
              onClick={hangUp}
              className="rounded-full w-12 h-12 p-0"
              data-testid="hang-up-button"
            >
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>

          {/* Status Info */}
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span data-testid="participant-count">{participants} participant{participants !== 1 ? 's' : ''}</span>
            </div>
            {isCallActive && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Call Active</span>
              </div>
            )}
          </div>

          {/* Advanced Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-primary/20">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Video Quality
              </label>
              <Select value={videoQuality} onValueChange={changeVideoQuality}>
                <SelectTrigger className="form-input">
                  <Monitor className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  {videoQualities.map((quality) => (
                    <SelectItem key={quality.value} value={quality.value}>
                      {quality.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isAstrologer && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Background
                </label>
                <Select value={selectedBackground} onValueChange={changeBackground}>
                  <SelectTrigger className="form-input">
                    <Camera className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    {backgrounds.map((bg) => (
                      <SelectItem key={bg.value} value={bg.value}>
                        {bg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Tips for Better Experience */}
          <div className="glass p-4 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">Tips for Better Experience</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Ensure stable internet connection for HD quality</li>
              <li>• Use headphones to avoid echo</li>
              <li>• Position camera at eye level for better interaction</li>
              <li>• Keep good lighting on your face</li>
              {isAstrologer && <li>• Use virtual backgrounds to maintain professional appearance</li>}
            </ul>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
