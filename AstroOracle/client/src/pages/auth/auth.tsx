import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, User, Lock, Mail, Phone, Smartphone, Shield, AlertCircle, Calendar, MapPin, FileText, AlertTriangle } from "lucide-react";
import { AnimatedLogo } from "@/components/ui/animated-logo";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { globalPhoneCodes } from '@/data/global-phone-codes';

export default function Auth() {
  const [location, setLocation] = useLocation();
  
  // Initialize authMode based on current URL path
  const getInitialAuthMode = () => {
    if (location.includes('/register') || location === '/auth/register') {
      return 'register';
    }
    return 'login';
  };
  
  const [authMode, setAuthMode] = useState(getInitialAuthMode());
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState("mobile_otp");
  const [otpSent, setOtpSent] = useState(false);
  const [step, setStep] = useState(1);
  const [otpVerified, setOtpVerified] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [userUuid, setUserUuid] = useState("");
  
  // Login form data
  const [loginData, setLoginData] = useState({
    countryCode: "+91",
    phoneNumber: "",
    otp: "",
    userId: "",
    password: "",
  });

  // Registration form data
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    countryCode: "+91",
    phoneNumber: "",
    whatsappNumber: "",
    otp: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    preferredLanguage: "en",
    agreedToTerms: false,
    agreedToPrivacy: false,
    agreedToDisclaimer: false,
    agreedToReturnPolicy: false,
    dataProcessingConsent: false,
    marketingConsent: false,
  });

  const { toast } = useToast();

  // Send OTP Mutation for Login
  const sendLoginOtpMutation = useMutation({
    mutationFn: async (phoneData: { countryCode: string; phoneNumber: string }) => {
      const response = await apiRequest("POST", "/api/auth/send-otp", { 
        ...phoneData, 
        purpose: "login" 
      });
      return response.json();
    },
    onSuccess: () => {
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the login verification code",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Unable to send verification code. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: async (loginFormData: any) => {
      let endpoint = "";
      let payload = {};

      switch (loginMethod) {
        case "mobile_otp":
          endpoint = "/api/auth/login-mobile-otp";
          payload = {
            countryCode: loginFormData.countryCode,
            phoneNumber: loginFormData.phoneNumber,
            otp: loginFormData.otp,
          };
          break;
        case "userid_password":
          endpoint = "/api/auth/login-userid-password";
          payload = {
            userId: loginFormData.userId,
            password: loginFormData.password,
          };
          break;
        case "mobile_password":
          endpoint = "/api/auth/login-mobile-password";
          payload = {
            countryCode: loginFormData.countryCode,
            phoneNumber: loginFormData.phoneNumber,
            password: loginFormData.password,
          };
          break;
      }

      const response = await apiRequest("POST", endpoint, payload);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.fullName || data.user.username}!`,
      });
      
      if (data.user.isAdmin) {
        setLocation("/admin/dashboard");
      } else {
        setLocation("/");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Send OTP Mutation for Registration
  const sendRegisterOtpMutation = useMutation({
    mutationFn: async (phoneData: { countryCode: string; phoneNumber: string }) => {
      const response = await apiRequest("POST", "/api/auth/send-otp", {
        ...phoneData,
        purpose: "registration"
      });
      return response.json();
    },
    onSuccess: () => {
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Unable to send verification code. Please try again.",
        variant: "destructive",
      });
    },
  });

  // OTP Verification Mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async (otpData: { countryCode: string; phoneNumber: string; otp: string }) => {
      const response = await apiRequest("POST", "/api/auth/verify-otp", otpData);
      return response.json();
    },
    onSuccess: () => {
      setOtpVerified(true);
      toast({
        title: "Phone Verified",
        description: "Your phone number has been successfully verified",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Invalid OTP",
        description: error.message || "The verification code is incorrect. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Registration Mutation
  const registerMutation = useMutation({
    mutationFn: async (registerFormData: any) => {
      const response = await apiRequest("POST", "/api/auth/register", registerFormData);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      setUserUuid(data.user.id || data.user.uuid);
      setRegistrationComplete(true);
      toast({
        title: "Registration Successful!",
        description: `Welcome to Jai Guru Astro Remedy, ${data.user.fullName}!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const languages = [
    { value: "en", label: "English" },
    { value: "hi", label: "हिंदी (Hindi)" },
    { value: "bn", label: "বাংলা (Bengali)" },
    { value: "es", label: "Español (Spanish)" },
    { value: "fr", label: "Français (French)" },
    { value: "de", label: "Deutsch (German)" },
    { value: "zh", label: "中文 (Chinese)" },
    { value: "ja", label: "日本語 (Japanese)" },
    { value: "ko", label: "한국어 (Korean)" },
    { value: "ar", label: "العربية (Arabic)" },
  ];

  // Reset form when switching modes
  const switchAuthMode = (mode: string) => {
    setAuthMode(mode);
    
    // Update URL to match the selected mode
    const newPath = mode === 'login' ? '/auth' : '/auth/register';
    setLocation(newPath);
    setStep(1);
    setOtpSent(false);
    setOtpVerified(false);
    setLoginData({
      countryCode: "+91",
      phoneNumber: "",
      otp: "",
      userId: "",
      password: "",
    });
    setRegisterData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      countryCode: "+91",
      phoneNumber: "",
      whatsappNumber: "",
      otp: "",
      dateOfBirth: "",
      timeOfBirth: "",
      placeOfBirth: "",
      preferredLanguage: "en",
      agreedToTerms: false,
      agreedToPrivacy: false,
      agreedToDisclaimer: false,
      agreedToReturnPolicy: false,
      dataProcessingConsent: false,
      marketingConsent: false,
    });
  };

  // Login handlers
  const sendLoginOtp = () => {
    if (!loginData.phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number first",
        variant: "destructive",
      });
      return;
    }
    sendLoginOtpMutation.mutate({
      countryCode: loginData.countryCode,
      phoneNumber: loginData.phoneNumber,
    });
  };

  const validateLogin = () => {
    switch (loginMethod) {
      case "mobile_otp":
        if (!loginData.phoneNumber || !loginData.otp) {
          toast({
            title: "Validation Error",
            description: "Please enter your phone number and OTP",
            variant: "destructive",
          });
          return false;
        }
        break;
      case "userid_password":
        if (!loginData.userId || !loginData.password) {
          toast({
            title: "Validation Error",
            description: "Please enter your User ID and password",
            variant: "destructive",
          });
          return false;
        }
        break;
      case "mobile_password":
        if (!loginData.phoneNumber || !loginData.password) {
          toast({
            title: "Validation Error",
            description: "Please enter your phone number and password",
            variant: "destructive",
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    loginMutation.mutate(loginData);
  };

  // Registration handlers
  const validateStep1 = () => {
    if (!registerData.username || !registerData.password || !registerData.confirmPassword || !registerData.fullName || !registerData.phoneNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (email is optional for recovery)",
        variant: "destructive",
      });
      return false;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }

    if (registerData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!registerData.phoneNumber) {
      toast({
        title: "Validation Error",
        description: "Phone number is required",
        variant: "destructive",
      });
      return false;
    }
    if (!otpVerified) {
      toast({
        title: "Phone Verification Required",
        description: "Please verify your phone number with OTP",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const requiredAgreements = [
      registerData.agreedToTerms,
      registerData.agreedToPrivacy,
      registerData.agreedToDisclaimer,
      registerData.agreedToReturnPolicy,
      registerData.dataProcessingConsent
    ];

    if (!requiredAgreements.every(Boolean)) {
      toast({
        title: "Legal Agreements Required",
        description: "All legal agreements must be accepted to proceed. This is required for your legal protection and ours.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const sendRegisterOtp = () => {
    if (!registerData.phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number first",
        variant: "destructive",
      });
      return;
    }
    sendRegisterOtpMutation.mutate({
      countryCode: registerData.countryCode,
      phoneNumber: registerData.phoneNumber,
    });
  };

  const verifyOtp = () => {
    if (!registerData.otp) {
      toast({
        title: "OTP Required",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }
    verifyOtpMutation.mutate({
      countryCode: registerData.countryCode,
      phoneNumber: registerData.phoneNumber,
      otp: registerData.otp,
    });
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep3()) return;

    const registerFormData = {
      step: 4,
      agreements: {
        terms: registerData.agreedToTerms,
        privacy: registerData.agreedToPrivacy,
        disclaimer: registerData.agreedToDisclaimer,
        returnPolicy: registerData.agreedToReturnPolicy,
        dataProcessing: registerData.dataProcessingConsent,
        marketing: registerData.marketingConsent,
      },
      username: registerData.username,
      email: registerData.email || "",
      password: registerData.password,
      fullName: registerData.fullName,
      phoneNumber: registerData.phoneNumber,
      countryCode: registerData.countryCode,
      whatsappNumber: registerData.whatsappNumber || registerData.phoneNumber,
      dateOfBirth: registerData.dateOfBirth,
      timeOfBirth: registerData.timeOfBirth,
      placeOfBirth: registerData.placeOfBirth,
      preferredLanguage: registerData.preferredLanguage,
    };

    registerMutation.mutate(registerFormData);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "UUID copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  // Show success screen with UUID display
  if (registrationComplete) {
    return (
      <div className="min-h-screen pt-16 pb-16 flex items-center justify-center" data-testid="registration-success">
        <div className="max-w-md w-full mx-4">
          <GlassCard className="p-8 text-center space-y-6">
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center neon-border mx-auto">
              <Shield className="w-10 h-10 text-green-400" />
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl font-bold neon-text text-primary">
                Registration Complete!
              </h1>
              <p className="text-muted-foreground">
                Your account has been successfully created. Save your UUID for future logins.
              </p>
            </div>

            {/* UUID Display Section */}
            <div className="bg-gray-800/40 backdrop-blur-sm p-4 rounded-lg border border-cyan-400/30 space-y-3">
              <h3 className="font-semibold text-cyan-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Your Unique UUID
              </h3>
              <div className="bg-gray-900/60 p-3 rounded border break-all text-sm font-mono text-white">
                {userUuid}
              </div>
              <Button
                onClick={() => copyToClipboard(userUuid)}
                className="w-full glass"
                size="sm"
              >
                📋 Copy UUID to Clipboard
              </Button>
              <p className="text-xs text-yellow-400 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Save this UUID! You'll need it to login using the "UUID + Password" method.</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <NeonButton
                onClick={() => setLocation("/")}
                className="w-full"
              >
                Continue to Dashboard
              </NeonButton>
              <Button
                variant="outline"
                onClick={() => {
                  setRegistrationComplete(false);
                  switchAuthMode("login");
                }}
                className="w-full glass"
              >
                Go to Login
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-16 flex items-center justify-center" data-testid="auth-page">
      <div className="max-w-md w-full mx-4">
        <GlassCard className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <AnimatedLogo />
            <h1 className="text-3xl font-bold neon-text text-primary mb-2" data-testid="auth-title">
              {authMode === "login" ? "Sign In to Your Account" : "Create Account"}
            </h1>
            <p className="text-muted-foreground">
              {authMode === "login" 
                ? "Choose your preferred login method to access your cosmic journey"
                : "Join thousands discovering their cosmic destiny with expert guidance"
              }
            </p>
          </div>

          {/* Auth Mode Selection */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={authMode === "login" ? "default" : "outline"}
                onClick={() => switchAuthMode("login")}
                className={`w-full ${
                  authMode === "login" ? "bg-primary shadow-md" : "glass"
                }`}
                data-testid="login-tab"
              >
                🔐 Login
              </Button>
              
              <Button
                type="button"
                variant={authMode === "register" ? "default" : "outline"}
                onClick={() => switchAuthMode("register")}
                className={`w-full ${
                  authMode === "register" ? "bg-primary shadow-md" : "glass"
                }`}
                data-testid="register-tab"
              >
                ✨ Sign Up
              </Button>
            </div>
          </div>

          {/* LOGIN FORM */}
          {authMode === "login" && (
            <>
              {/* Login Method Selection */}
              <div className="mb-6">
                <Label className="text-foreground mb-3 block">Choose Login Method</Label>
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    type="button"
                    variant={loginMethod === "mobile_otp" ? "default" : "outline"}
                    onClick={() => {
                      setLoginMethod("mobile_otp");
                      setOtpSent(false);
                      setLoginData({ ...loginData, otp: "" });
                    }}
                    className={`w-full text-left justify-start space-x-2 ${
                      loginMethod === "mobile_otp" ? "bg-primary shadow-md" : "glass"
                    }`}
                    data-testid="mobile-otp-method"
                  >
                    <Smartphone className="w-4 h-4" />
                    <div>
                      <div className="font-medium">Mobile + OTP</div>
                      <div className="text-xs opacity-70">Most secure option</div>
                    </div>
                  </Button>
                  
                  <Button
                    type="button"
                    variant={loginMethod === "userid_password" ? "default" : "outline"}
                    onClick={() => setLoginMethod("userid_password")}
                    className={`w-full text-left justify-start space-x-2 ${
                      loginMethod === "userid_password" ? "bg-primary shadow-md" : "glass"
                    }`}
                    data-testid="uuid-password-method"
                  >
                    <User className="w-4 h-4" />
                    <div>
                      <div className="font-medium">User ID + Password</div>
                      <div className="text-xs opacity-70">Primary identifier authentication</div>
                    </div>
                  </Button>
                  
                  <Button
                    type="button"
                    variant={loginMethod === "mobile_password" ? "default" : "outline"}
                    onClick={() => setLoginMethod("mobile_password")}
                    className={`w-full text-left justify-start space-x-2 ${
                      loginMethod === "mobile_password" ? "bg-primary shadow-md" : "glass"
                    }`}
                    data-testid="mobile-password-method"
                  >
                    <Phone className="w-4 h-4" />
                    <div>
                      <div className="font-medium">Mobile + Password</div>
                      <div className="text-xs opacity-70">Alternative login</div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Mobile + OTP Form */}
                {loginMethod === "mobile_otp" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label className="text-foreground">Country Code *</Label>
                        <Select
                          value={loginData.countryCode}
                          onValueChange={(value) => setLoginData({ ...loginData, countryCode: value })}
                        >
                          <SelectTrigger className="form-input text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-card max-h-60 overflow-y-auto">
                            {globalPhoneCodes.map((code) => (
                              <SelectItem key={code.value} value={code.value} className="text-xs">
                                {code.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="phoneNumber" className="text-foreground">
                          Phone Number *
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="phoneNumber"
                            value={loginData.phoneNumber}
                            onChange={(e) => setLoginData({ ...loginData, phoneNumber: e.target.value })}
                            placeholder="Your phone number"
                            className="form-input pl-10"
                            required
                            data-testid="phone-input"
                          />
                        </div>
                      </div>
                    </div>

                    {/* OTP Section */}
                    <div className="glass p-4 rounded-lg space-y-4">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Secure Login Verification</span>
                      </div>
                      
                      {!otpSent ? (
                        <Button
                          type="button"
                          onClick={sendLoginOtp}
                          disabled={!loginData.phoneNumber || sendLoginOtpMutation.isPending}
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                          data-testid="send-login-otp-button"
                        >
                          {sendLoginOtpMutation.isPending ? "Sending..." : "Send Login Code"}
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="otp" className="text-foreground">
                              Enter Login Code *
                            </Label>
                            <Input
                              id="otp"
                              value={loginData.otp}
                              onChange={(e) => setLoginData({ ...loginData, otp: e.target.value })}
                              placeholder="6-digit code"
                              className="form-input"
                              maxLength={6}
                              data-testid="login-otp-input"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOtpSent(false)}
                            className="w-full glass text-xs"
                            data-testid="resend-login-otp-button"
                          >
                            Resend Code
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* User ID + Password Form */}
                {loginMethod === "userid_password" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="userId" className="text-foreground">
                        User ID *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="userId"
                          type="text"
                          value={loginData.userId}
                          onChange={(e) => setLoginData({ ...loginData, userId: e.target.value })}
                          placeholder="Enter your User ID"
                          className="form-input pl-10"
                          required
                          data-testid="uuid-input"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Your unique User ID provided during registration
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground">
                        Password *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          placeholder="Enter your password"
                          className="form-input pl-10 pr-10"
                          required
                          data-testid="password-input"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="toggle-password"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile + Password Form */}
                {loginMethod === "mobile_password" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label className="text-foreground">Country Code *</Label>
                        <Select
                          value={loginData.countryCode}
                          onValueChange={(value) => setLoginData({ ...loginData, countryCode: value })}
                        >
                          <SelectTrigger className="form-input text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-card max-h-60 overflow-y-auto">
                            {globalPhoneCodes.map((code) => (
                              <SelectItem key={code.value} value={code.value} className="text-xs">
                                {code.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="phoneNumber" className="text-foreground">
                          Phone Number *
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="phoneNumber"
                            value={loginData.phoneNumber}
                            onChange={(e) => setLoginData({ ...loginData, phoneNumber: e.target.value })}
                            placeholder="Your phone number"
                            className="form-input pl-10"
                            required
                            data-testid="phone-input"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground">
                        Password *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          placeholder="Enter your password"
                          className="form-input pl-10 pr-10"
                          required
                          data-testid="password-input"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="toggle-password"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Remember Me & Recovery Options */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(!!checked)}
                      data-testid="remember-checkbox"
                    />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <div className="flex flex-col space-y-1">
                    {loginMethod !== "mobile_otp" && (
                      <Link href="/forgot-password">
                        <Button variant="link" className="text-primary p-0 h-auto text-xs">
                          Forgot password?
                        </Button>
                      </Link>
                    )}
                    <Link href="/account-recovery">
                      <Button variant="link" className="text-secondary p-0 h-auto text-xs">
                        Lost mobile access?
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Security Notice based on login method */}
                <div className="glass p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                    <div className="text-xs text-muted-foreground">
                      {loginMethod === "mobile_otp" && (
                        <span>Most secure login method. OTP expires in 10 minutes.</span>
                      )}
                      {loginMethod === "userid_password" && (
                        <span>Use your unique User ID provided during registration.</span>
                      )}
                      {loginMethod === "mobile_password" && (
                        <span>Alternative login using your registered mobile number.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <NeonButton
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                  data-testid="login-submit-button"
                >
                  {loginMutation.isPending ? "Signing In..." : "Sign In"}
                </NeonButton>
              </form>
            </>
          )}

          {/* REGISTRATION FORM */}
          {authMode === "register" && (
            <>
              {/* Progress Indicator for Registration */}
              <div className="flex items-center justify-center mb-8">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= stepNumber 
                        ? "bg-primary text-primary-foreground neon-border" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {stepNumber}
                    </div>
                    {stepNumber < 4 && (
                      <div className={`w-12 h-0.5 mx-2 ${
                        step > stepNumber ? "bg-primary" : "bg-muted"
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Labels */}
              <div className="flex items-center justify-center mb-6">
                <div className="text-xs text-muted-foreground text-center">
                  {step === 1 && "Basic Information"}
                  {step === 2 && "Phone Verification"}
                  {step === 3 && "Birth Details & Preferences"}
                  {step === 4 && "Legal Agreements"}
                </div>
              </div>

              <form onSubmit={step === 4 ? handleRegister : undefined} className="space-y-6">
                {/* Step 1: Basic Information */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Basic Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-foreground">
                        Full Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="fullName"
                          value={registerData.fullName}
                          onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                          placeholder="Enter your full name"
                          className="form-input pl-10"
                          required
                          data-testid="full-name-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-foreground">
                        Username *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="username"
                          value={registerData.username}
                          onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                          placeholder="Choose a unique username"
                          className="form-input pl-10"
                          required
                          data-testid="username-input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label className="text-foreground">Country Code *</Label>
                        <Select
                          value={registerData.countryCode}
                          onValueChange={(value) => setRegisterData({ ...registerData, countryCode: value })}
                        >
                          <SelectTrigger className="form-input text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-card max-h-60 overflow-y-auto">
                            {globalPhoneCodes.map((code) => (
                              <SelectItem key={code.value} value={code.value} className="text-xs">
                                {code.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="phoneNumber" className="text-foreground">
                          Mobile Number *
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="phoneNumber"
                            value={registerData.phoneNumber}
                            onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })}
                            placeholder="Your mobile number"
                            className="form-input pl-10"
                            required
                            data-testid="phone-input"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">
                        Email Address (optional for recovery)
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="email"
                          type="email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          placeholder="Enter your email address"
                          className="form-input pl-10"
                          data-testid="email-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground">
                        Password *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          placeholder="Create a strong password"
                          className="form-input pl-10 pr-10"
                          required
                          data-testid="password-input"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-foreground">
                        Confirm Password *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          placeholder="Confirm your password"
                          className="form-input pl-10 pr-10"
                          required
                          data-testid="confirm-password-input"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Phone Verification */}
                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Phone Verification</h3>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label className="text-foreground">Country Code *</Label>
                        <Select
                          value={registerData.countryCode}
                          onValueChange={(value) => setRegisterData({ ...registerData, countryCode: value })}
                        >
                          <SelectTrigger className="form-input text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-card max-h-40">
                            {globalPhoneCodes.map((code) => (
                              <SelectItem key={code.value} value={code.value} className="text-xs">
                                {code.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="phoneNumber" className="text-foreground">
                          Phone Number *
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="phoneNumber"
                            value={registerData.phoneNumber}
                            onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })}
                            placeholder="Your phone number"
                            className="form-input pl-10"
                            required
                            data-testid="phone-input"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="glass p-4 rounded-lg space-y-4">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Mobile Verification</span>
                      </div>
                      
                      {!otpSent ? (
                        <Button
                          type="button"
                          onClick={sendRegisterOtp}
                          disabled={!registerData.phoneNumber || sendRegisterOtpMutation.isPending}
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                          data-testid="send-otp-button"
                        >
                          {sendRegisterOtpMutation.isPending ? "Sending..." : "Send OTP"}
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="otp" className="text-foreground">
                              Enter 6-Digit Code *
                            </Label>
                            <Input
                              id="otp"
                              value={registerData.otp}
                              onChange={(e) => setRegisterData({ ...registerData, otp: e.target.value })}
                              placeholder="######"
                              className="form-input text-center text-lg tracking-widest"
                              maxLength={6}
                              data-testid="otp-input"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              type="button"
                              onClick={verifyOtp}
                              disabled={!registerData.otp || verifyOtpMutation.isPending}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              data-testid="verify-otp-button"
                            >
                              {verifyOtpMutation.isPending ? "Verifying..." : "Verify"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setOtpSent(false)}
                              className="glass"
                              data-testid="resend-otp-button"
                            >
                              Resend
                            </Button>
                          </div>
                          
                          {otpVerified && (
                            <div className="flex items-center space-x-2 text-green-400 bg-green-900/20 p-3 rounded-lg">
                              <Shield className="w-4 h-4" />
                              <span className="text-sm font-medium">Phone number verified successfully!</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Birth Details & Preferences */}
                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Birth Details & Preferences</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="text-foreground">
                        Date of Birth (optional)
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={registerData.dateOfBirth}
                          onChange={(e) => setRegisterData({ ...registerData, dateOfBirth: e.target.value })}
                          className="form-input pl-10"
                          data-testid="dob-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeOfBirth" className="text-foreground">
                        Time of Birth (optional)
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="timeOfBirth"
                          type="time"
                          value={registerData.timeOfBirth}
                          onChange={(e) => setRegisterData({ ...registerData, timeOfBirth: e.target.value })}
                          className="form-input pl-10"
                          data-testid="tob-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="placeOfBirth" className="text-foreground">
                        Place of Birth (optional)
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="placeOfBirth"
                          value={registerData.placeOfBirth}
                          onChange={(e) => setRegisterData({ ...registerData, placeOfBirth: e.target.value })}
                          placeholder="City, State, Country"
                          className="form-input pl-10"
                          data-testid="pob-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Preferred Language</Label>
                      <Select
                        value={registerData.preferredLanguage}
                        onValueChange={(value) => setRegisterData({ ...registerData, preferredLanguage: value })}
                      >
                        <SelectTrigger className="form-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                          {languages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsappNumber" className="text-foreground">
                        WhatsApp Number (optional)
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="whatsappNumber"
                          value={registerData.whatsappNumber}
                          onChange={(e) => setRegisterData({ ...registerData, whatsappNumber: e.target.value })}
                          placeholder="Leave blank to use same as mobile"
                          className="form-input pl-10"
                          data-testid="whatsapp-input"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        If different from your mobile number
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 4: Legal Agreements */}
                {step === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Legal Agreements</h3>
                    <div className="text-sm text-yellow-400 bg-yellow-900/20 p-3 rounded-lg mb-4">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>All legal agreements are required for your protection and ours. Please read carefully.</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 max-h-80 overflow-y-auto glass p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreedToTerms"
                          checked={registerData.agreedToTerms}
                          onCheckedChange={(checked) => setRegisterData({ ...registerData, agreedToTerms: !!checked })}
                          className="mt-1"
                          data-testid="terms-checkbox"
                        />
                        <div>
                          <Label htmlFor="agreedToTerms" className="text-sm font-medium cursor-pointer">
                            Terms of Service *
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            I agree to the platform's terms of service and conditions of use.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreedToPrivacy"
                          checked={registerData.agreedToPrivacy}
                          onCheckedChange={(checked) => setRegisterData({ ...registerData, agreedToPrivacy: !!checked })}
                          className="mt-1"
                          data-testid="privacy-checkbox"
                        />
                        <div>
                          <Label htmlFor="agreedToPrivacy" className="text-sm font-medium cursor-pointer">
                            Privacy Policy *
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            I understand how my personal data will be collected, used, and protected.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreedToDisclaimer"
                          checked={registerData.agreedToDisclaimer}
                          onCheckedChange={(checked) => setRegisterData({ ...registerData, agreedToDisclaimer: !!checked })}
                          className="mt-1"
                          data-testid="disclaimer-checkbox"
                        />
                        <div>
                          <Label htmlFor="agreedToDisclaimer" className="text-sm font-medium cursor-pointer">
                            Astrology Disclaimer *
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            I understand astrology is for guidance and entertainment purposes.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreedToReturnPolicy"
                          checked={registerData.agreedToReturnPolicy}
                          onCheckedChange={(checked) => setRegisterData({ ...registerData, agreedToReturnPolicy: !!checked })}
                          className="mt-1"
                          data-testid="return-policy-checkbox"
                        />
                        <div>
                          <Label htmlFor="agreedToReturnPolicy" className="text-sm font-medium cursor-pointer">
                            Return & Refund Policy *
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            I agree to the terms for returns, refunds, and cancellations.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="dataProcessingConsent"
                          checked={registerData.dataProcessingConsent}
                          onCheckedChange={(checked) => setRegisterData({ ...registerData, dataProcessingConsent: !!checked })}
                          className="mt-1"
                          data-testid="data-consent-checkbox"
                        />
                        <div>
                          <Label htmlFor="dataProcessingConsent" className="text-sm font-medium cursor-pointer">
                            Data Processing Consent *
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            I consent to processing of my personal data for services and consultations.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="marketingConsent"
                          checked={registerData.marketingConsent}
                          onCheckedChange={(checked) => setRegisterData({ ...registerData, marketingConsent: !!checked })}
                          className="mt-1"
                          data-testid="marketing-checkbox"
                        />
                        <div>
                          <Label htmlFor="marketingConsent" className="text-sm font-medium cursor-pointer">
                            Marketing Communications (optional)
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            I agree to receive updates, newsletters, and promotional content.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  {step > 1 && authMode === "register" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      className="glass"
                      data-testid="back-button"
                    >
                      Back
                    </Button>
                  )}
                  
                  {step < 4 && authMode === "register" ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90"
                      data-testid="next-button"
                    >
                      Next
                    </Button>
                  ) : step === 4 && authMode === "register" ? (
                    <NeonButton
                      type="submit"
                      className="ml-auto"
                      disabled={registerMutation.isPending}
                      data-testid="register-submit-button"
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                    </NeonButton>
                  ) : null}
                </div>
              </form>
            </>
          )}
        </GlassCard>
      </div>
    </div>
  );
}