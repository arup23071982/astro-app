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
import { Eye, EyeOff, User, Lock, Mail, Phone, Smartphone, Shield, AlertCircle } from "lucide-react";
import { AnimatedLogo } from "@/components/ui/animated-logo";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
// AutoTranslate import removed for fast loading
// Import comprehensive global phone codes for all countries worldwide
import { globalPhoneCodes } from '@/data/global-phone-codes';

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState("mobile_otp"); // mobile_otp, userid_password, mobile_password
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    // Mobile + OTP
    countryCode: "+91",
    phoneNumber: "",
    otp: "",
    
    // User ID + Password
    userId: "",
    
    // Mobile + Password  
    password: "",
  });
  const { toast } = useToast();

  // Send OTP Mutation for Mobile + OTP login
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

  // Main Login Mutation for all three methods
  const loginMutation = useMutation({
    mutationFn: async (loginData: any) => {
      let endpoint = "";
      let payload = {};

      switch (loginMethod) {
        case "mobile_otp":
          endpoint = "/api/auth/login-mobile-otp";
          payload = {
            countryCode: loginData.countryCode,
            phoneNumber: loginData.phoneNumber,
            otp: loginData.otp,
          };
          break;
        case "userid_password":
          endpoint = "/api/auth/login-userid-password";
          payload = {
            userId: loginData.userId,
            password: loginData.password,
          };
          break;
        case "mobile_password":
          endpoint = "/api/auth/login-mobile-password";
          payload = {
            countryCode: loginData.countryCode,
            phoneNumber: loginData.phoneNumber,
            password: loginData.password,
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
      
      // Redirect based on user role
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

  const sendOtp = () => {
    if (!formData.phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number first",
        variant: "destructive",
      });
      return;
    }
    sendLoginOtpMutation.mutate({
      countryCode: formData.countryCode,
      phoneNumber: formData.phoneNumber,
    });
  };

  const validateForm = () => {
    switch (loginMethod) {
      case "mobile_otp":
        if (!formData.phoneNumber || !formData.otp) {
          toast({
            title: "Validation Error",
            description: "Please enter your phone number and OTP",
            variant: "destructive",
          });
          return false;
        }
        break;
      case "userid_password":
        if (!formData.userId || !formData.password) {
          toast({
            title: "Validation Error",
            description: "Please enter your User ID and password",
            variant: "destructive",
          });
          return false;
        }
        break;
      case "mobile_password":
        if (!formData.phoneNumber || !formData.password) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen pt-16 pb-16 flex items-center justify-center" data-testid="login-page">
      <div className="max-w-md w-full mx-4">
        <GlassCard className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <AnimatedLogo />
            <h1 className="text-3xl font-bold neon-text text-primary mb-2" data-testid="login-title">
              Sign In to Your Account
            </h1>
            <p className="text-muted-foreground">
              Choose your preferred login method to access your cosmic journey
            </p>
          </div>

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
                  setFormData({ ...formData, otp: "" });
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mobile + OTP Form */}
            {loginMethod === "mobile_otp" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label className="text-foreground">Country Code *</Label>
                    <Select
                      value={formData.countryCode}
                      onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
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
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
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
                      onClick={sendOtp}
                      disabled={!formData.phoneNumber || sendLoginOtpMutation.isPending}
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
                          value={formData.otp}
                          onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
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
                      value={formData.userId}
                      onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
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
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                      value={formData.countryCode}
                      onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
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
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
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
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

          {/* Method Switch Shortcuts */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-4 text-muted-foreground">Quick Switch</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLoginMethod("mobile_otp")}
              className={`glass ${loginMethod === "mobile_otp" ? "ring-1 ring-primary" : ""}`}
              data-testid="switch-mobile-otp"
            >
              📱 OTP
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLoginMethod("userid_password")}
              className={`glass ${loginMethod === "userid_password" ? "ring-1 ring-primary" : ""}`}
              data-testid="switch-userid"
            >
              👤 User ID
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLoginMethod("mobile_password")}
              className={`glass ${loginMethod === "mobile_password" ? "ring-1 ring-primary" : ""}`}
              data-testid="switch-mobile-pass"
            >
              📞 Mobile
            </Button>
          </div>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link href="/register">
                <Button variant="link" className="text-primary p-0 h-auto text-sm" data-testid="register-link">
                  Create account
                </Button>
              </Link>
            </p>
          </div>

        </GlassCard>

      </div>
    </div>
  );
}
