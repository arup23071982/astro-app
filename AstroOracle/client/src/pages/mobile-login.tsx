import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smartphone, 
  MessageSquare, 
  Shield, 
  ArrowLeft,
  CheckCircle,
  Loader2,
  Timer,
  User,
  Calendar,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";


export default function MobileLogin() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'phone' | 'otp' | 'details'>('phone');
  const [selectedTab, setSelectedTab] = useState('login');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    placeOfBirth: "",
    timeOfBirth: "",
    username: ""
  });
  const { toast } = useToast();

  const sendOtpMutation = useMutation({
    mutationFn: async ({ phone, code, purpose }: { phone: string; code: string; purpose: string }) => {
      return apiRequest("POST", "/api/auth/send-otp", {
        phoneNumber: phone,
        countryCode: code,
        purpose
      });
    },
    onSuccess: (data) => {
      setStep('otp');
      setOtpTimer(600); // 10 minutes
      startTimer();
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${countryCode} ${phoneNumber}`,
      });
      // Show OTP in development
      if (data.otp) {
        toast({
          title: "Development Mode",
          description: `Your OTP is: ${data.otp}`,
          duration: 10000,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/auth/verify-otp", data);
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast({
        title: "Success!",
        description: "You have been successfully logged in",
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    },
  });

  const startTimer = () => {
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return;
    }

    sendOtpMutation.mutate({
      phone: phoneNumber,
      code: countryCode,
      purpose: selectedTab
    });
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    if (selectedTab === 'registration') {
      setStep('details');
    } else {
      verifyOtpMutation.mutate({
        phoneNumber,
        countryCode,
        otp,
        purpose: selectedTab
      });
    }
  };

  const handleCompleteRegistration = () => {
    if (!userDetails.fullName || !userDetails.email || !userDetails.username) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    verifyOtpMutation.mutate({
      phoneNumber,
      countryCode,
      otp,
      purpose: 'registration',
      userData: userDetails
    });
  };

  const countries = [
    { code: "+91", name: "India", flag: "🇮🇳" },
    { code: "+1", name: "USA", flag: "🇺🇸" },
    { code: "+44", name: "UK", flag: "🇬🇧" },
    { code: "+971", name: "UAE", flag: "🇦🇪" },
    { code: "+65", name: "Singapore", flag: "🇸🇬" },
    { code: "+61", name: "Australia", flag: "🇦🇺" },
    { code: "+49", name: "Germany", flag: "🇩🇪" },
  ];

  return (
    <div className="min-h-screen pt-16 pb-16" data-testid="mobile-login">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => step === 'phone' ? setLocation("/") : setStep('phone')}
            className="absolute left-4 top-20 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold neon-text text-primary mb-2">
            "Mobile Verification"
          </h1>
          <p className="text-muted-foreground">
            "Secure login with OTP verification"
          </p>
        </div>

        <GlassCard className="p-6">
          {step === 'phone' && (
            <>
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-2 glass-card">
                  <TabsTrigger value="login">"Login"</TabsTrigger>
                  <TabsTrigger value="registration">"Sign Up"</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    "Country"
                  </label>
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="form-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <div className="flex items-center space-x-2">
                            <span>{country.flag}</span>
                            <span>{country.name}</span>
                            <span className="text-muted-foreground">{country.code}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mobile Number
                  </label>
                  <div className="flex">
                    <div className="px-3 py-2 bg-background/50 border border-primary/20 rounded-l-lg text-muted-foreground">
                      {countryCode}
                    </div>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="rounded-l-none form-input"
                      maxLength={10}
                      data-testid="phone-input"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSendOtp}
                  disabled={sendOtpMutation.isPending}
                  className="w-full neon-button"
                  data-testid="send-otp-button"
                >
                  {sendOtpMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send OTP
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Enter Verification Code
                </h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit code to<br />
                  <strong>{countryCode} {phoneNumber}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  6-Digit OTP
                </label>
                <Input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="form-input text-center text-2xl tracking-widest"
                  maxLength={6}
                  data-testid="otp-input"
                />
              </div>

              {otpTimer > 0 && (
                <div className="flex items-center justify-center text-muted-foreground">
                  <Timer className="w-4 h-4 mr-2" />
                  <span className="text-sm">Resend OTP in {formatTimer(otpTimer)}</span>
                </div>
              )}

              <Button
                onClick={handleVerifyOtp}
                disabled={verifyOtpMutation.isPending}
                className="w-full neon-button"
                data-testid="verify-otp-button"
              >
                {verifyOtpMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify OTP
                  </>
                )}
              </Button>

              {otpTimer === 0 && (
                <Button
                  variant="outline"
                  onClick={handleSendOtp}
                  disabled={sendOtpMutation.isPending}
                  className="w-full glass"
                >
                  Resend OTP
                </Button>
              )}
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Complete Your Profile
                </h3>
                <p className="text-sm text-muted-foreground">
                  Help us serve you better with accurate astrological guidance
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <Input
                  placeholder={"Your full name"}
                  value={userDetails.fullName}
                  onChange={(e) => setUserDetails({...userDetails, fullName: e.target.value})}
                  className="form-input"
                  data-testid="fullname-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Username *
                </label>
                <Input
                  placeholder={"Choose a unique username"}
                  value={userDetails.username}
                  onChange={(e) => setUserDetails({...userDetails, username: e.target.value})}
                  className="form-input"
                  data-testid="username-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={userDetails.email}
                  onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                  className="form-input"
                  data-testid="email-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date of Birth
                </label>
                <Input
                  type="date"
                  value={userDetails.dateOfBirth}
                  onChange={(e) => setUserDetails({...userDetails, dateOfBirth: e.target.value})}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Time of Birth
                </label>
                <Input
                  type="time"
                  value={userDetails.timeOfBirth}
                  onChange={(e) => setUserDetails({...userDetails, timeOfBirth: e.target.value})}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Place of Birth
                </label>
                <Input
                  placeholder="City, State, Country"
                  value={userDetails.placeOfBirth}
                  onChange={(e) => setUserDetails({...userDetails, placeOfBirth: e.target.value})}
                  className="form-input"
                />
              </div>

              <Button
                onClick={handleCompleteRegistration}
                disabled={verifyOtpMutation.isPending}
                className="w-full neon-button"
                data-testid="complete-registration-button"
              >
                {verifyOtpMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Registration
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary">Secure & Private</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your mobile number is encrypted and never shared with third parties.
                  OTP verification ensures the highest security for your account.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}