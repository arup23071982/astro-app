// Jitsi Meet API integration for video consultations
export interface JitsiConfig {
  parentNode: HTMLElement;
  roomName: string;
  displayName: string;
  configOverwrite?: any;
  interfaceConfigOverwrite?: any;
  onApiReady?: (api: JitsiMeetInstance) => void;
}

export interface JitsiMeetInstance {
  executeCommand: (command: string, ...args: any[]) => void;
  addEventListener: (event: string, listener: (...args: any[]) => void) => void;
  removeEventListener: (event: string, listener: (...args: any[]) => void) => void;
  dispose: () => void;
  getNumberOfParticipants: () => number;
  isDeviceListAvailable: () => boolean;
  isDeviceChangeAvailable: (deviceType: string) => boolean;
  isMultipleAudioInputSupported: () => boolean;
  invite: (invitees: any[]) => void;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI?: any;
  }
}

// Load Jitsi Meet External API script
const loadJitsiScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.JitsiMeetExternalAPI) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    
    script.onload = () => {
      if (window.JitsiMeetExternalAPI) {
        resolve();
      } else {
        reject(new Error('Jitsi Meet API not loaded'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Jitsi Meet script'));
    };

    document.head.appendChild(script);
  });
};

export const initializeJitsi = async ({
  parentNode,
  roomName,
  displayName,
  configOverwrite = {},
  interfaceConfigOverwrite = {},
  onApiReady,
}: JitsiConfig): Promise<JitsiMeetInstance> => {
  await loadJitsiScript();

  const domain = 'meet.jit.si';
  
  const defaultConfig = {
    // Basic configuration
    startWithAudioMuted: false,
    startWithVideoMuted: false,
    enableWelcomePage: false,
    enableClosePage: false,
    prejoinPageEnabled: false,
    
    // Quality and performance
    resolution: 720,
    constraints: {
      video: {
        height: { ideal: 720, max: 1080 }
      }
    },
    
    // UI and branding
    defaultLanguage: 'en',
    disableModeratorIndicator: false,
    
    // Features
    enableNoiseCancellation: true,
    enableTalkWhileMuted: false,
    disableAP: false,
    disableAEC: false,
    disableNS: false,
    disableAGC: false,
    disableHPF: false,
    
    // Security
    enableInsecureRoomNameWarning: false,
    enableLobbyChat: false,
    
    // Recording and streaming
    fileRecordingsEnabled: false,
    liveStreamingEnabled: false,
    
    // Chat and interaction
    disablePrivateChat: false,
    startSilent: false,
    
    // Performance optimizations
    channelLastN: 2, // Only show last N participants
    enableLayerSuspension: true,
    
    ...configOverwrite
  };

  const defaultInterfaceConfig = {
    // Branding
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    SHOW_BRAND_WATERMARK: false,
    BRAND_WATERMARK_LINK: "",
    SHOW_POWERED_BY: false,
    APP_NAME: "Jai Guru Astro Remedy",
    NATIVE_APP_NAME: "Jai Guru Astro Remedy",
    PROVIDER_NAME: "Astrologer Arup Shastri",
    
    // Welcome page
    DISPLAY_WELCOME_PAGE_CONTENT: false,
    DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
    
    // Notifications
    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
    DISABLE_PRESENCE_STATUS: false,
    
    // Toolbar and UI
    TOOLBAR_BUTTONS: [
      'microphone', 'camera', 'closedcaptions', 'desktop', 
      'fullscreen', 'fodeviceselection', 'hangup', 'profile',
      'chat', 'recording', 'livestreaming', 'etherpad', 
      'sharedvideo', 'settings', 'raisehand', 'videoquality',
      'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
      'tileview', 'videobackgroundblur', 'download', 'help'
    ],
    
    TOOLBAR_TIMEOUT: 4000,
    
    // Settings
    SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
    
    // Mobile and browser optimization
    MOBILE_APP_PROMO: false,
    OPTIMAL_BROWSERS: ['chrome', 'chromium', 'firefox', 'nwjs', 'electron', 'safari'],
    UNSUPPORTED_BROWSERS: [],
    
    // Video layout
    VIDEO_LAYOUT_FIT: 'both',
    LOCAL_THUMBNAIL_RATIO: 16 / 9,
    REMOTE_THUMBNAIL_RATIO: 1,
    MAXIMUM_ZOOMING_COEFFICIENT: 1.3,
    
    // Features
    HIDE_INVITE_MORE_HEADER: true,
    RECENT_LIST_ENABLED: false,
    LANG_DETECTION: false,
    SHOW_CHROME_EXTENSION_BANNER: false,
    
    ...interfaceConfigOverwrite
  };

  const api = new window.JitsiMeetExternalAPI(domain, {
    roomName: roomName,
    width: '100%',
    height: '100%',
    parentNode: parentNode,
    configOverwrite: defaultConfig,
    interfaceConfigOverwrite: defaultInterfaceConfig,
    userInfo: {
      displayName: displayName,
    },
  });

  // Enhanced API wrapper with additional methods
  const enhancedApi: JitsiMeetInstance = {
    executeCommand: (command: string, ...args: any[]) => {
      try {
        api.executeCommand(command, ...args);
      } catch (error) {
        console.error(`Failed to execute command ${command}:`, error);
      }
    },

    addEventListener: (event: string, listener: (...args: any[]) => void) => {
      api.addEventListener(event, listener);
    },

    removeEventListener: (event: string, listener: (...args: any[]) => void) => {
      api.removeEventListener(event, listener);
    },

    dispose: () => {
      try {
        api.dispose();
      } catch (error) {
        console.error('Error disposing Jitsi API:', error);
      }
    },

    getNumberOfParticipants: () => {
      return api.getNumberOfParticipants();
    },

    isDeviceListAvailable: () => {
      return api.isDeviceListAvailable();
    },

    isDeviceChangeAvailable: (deviceType: string) => {
      return api.isDeviceChangeAvailable(deviceType);
    },

    isMultipleAudioInputSupported: () => {
      return api.isMultipleAudioInputSupported();
    },

    invite: (invitees: any[]) => {
      api.invite(invitees);
    },
  };

  // Wait for API to be ready
  return new Promise((resolve) => {
    api.addEventListener('videoConferenceJoined', () => {
      onApiReady?.(enhancedApi);
      resolve(enhancedApi);
    });
  });
};

// Utility functions for Jitsi integration
export const getOptimalVideoQuality = (): number => {
  // Determine optimal video quality based on device capabilities
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (connection) {
    switch (connection.effectiveType) {
      case 'slow-2g':
      case '2g':
        return 240;
      case '3g':
        return 360;
      case '4g':
      default:
        return 720;
    }
  }
  
  // Default to 720p if connection info is not available
  return 720;
};

export const checkBrowserCompatibility = (): { isSupported: boolean; issues: string[] } => {
  const issues: string[] = [];
  let isSupported = true;

  // Check for required APIs
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    issues.push('Camera and microphone access not supported');
    isSupported = false;
  }

  if (!window.RTCPeerConnection) {
    issues.push('WebRTC not supported');
    isSupported = false;
  }

  if (!window.WebSocket) {
    issues.push('WebSocket not supported');
    isSupported = false;
  }

  // Check browser version
  const userAgent = navigator.userAgent;
  const isChrome = /Chrome/.test(userAgent);
  const isFirefox = /Firefox/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  const isEdge = /Edge/.test(userAgent);

  if (!isChrome && !isFirefox && !isSafari && !isEdge) {
    issues.push('Browser may not be fully supported');
  }

  return { isSupported, issues };
};

export const getDevicePermissions = async (): Promise<{ video: boolean; audio: boolean; errors: string[] }> => {
  const errors: string[] = [];
  let video = false;
  let audio = false;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    
    const videoTracks = stream.getVideoTracks();
    const audioTracks = stream.getAudioTracks();
    
    video = videoTracks.length > 0;
    audio = audioTracks.length > 0;
    
    // Clean up the stream
    stream.getTracks().forEach(track => track.stop());
    
  } catch (error: any) {
    if (error.name === 'NotAllowedError') {
      errors.push('Camera and microphone access denied by user');
    } else if (error.name === 'NotFoundError') {
      errors.push('Camera or microphone not found');
    } else if (error.name === 'NotReadableError') {
      errors.push('Camera or microphone is being used by another application');
    } else {
      errors.push(`Media access error: ${error.message}`);
    }
  }

  return { video, audio, errors };
};
