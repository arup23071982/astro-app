import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MessageSquare,
  Mail,
  CheckCircle,
  XCircle,
  Send,
  Settings,
  AlertCircle,
  Bell,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";


export default function AdminNotifications() {
  const [testPhoneNumber, setTestPhoneNumber] = useState("");
  const [testCountryCode, setTestCountryCode] = useState("+91");
  const [testEmail, setTestEmail] = useState("");
  const [testMessage, setTestMessage] = useState("");
  const { toast } = useToast();

  const { data: notificationStatus, isLoading } = useQuery({
    queryKey: ["/api/notifications/status"],
  });

  const sendTestSMSMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/auth/send-otp", {
        phoneNumber: data.phoneNumber,
        countryCode: data.countryCode,
        purpose: 'test'
      });
    },
    onSuccess: () => {
      toast({
        title: "SMS Test Sent",
        description: "Test OTP has been sent to the provided number",
      });
    },
    onError: (error: any) => {
      toast({
        title: "SMS Test Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const sendTestEmailMutation = useMutation({
    mutationFn: async (data: any) => {
      // This would be a test email endpoint
      return apiRequest("POST", "/api/test/send-email", data);
    },
    onSuccess: () => {
      toast({
        title: "Email Test Sent",
        description: "Test email has been sent successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Email Test Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTestSMS = () => {
    if (!testPhoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter a phone number for testing",
        variant: "destructive",
      });
      return;
    }

    sendTestSMSMutation.mutate({
      phoneNumber: testPhoneNumber,
      countryCode: testCountryCode
    });
  };

  const handleTestEmail = () => {
    if (!testEmail) {
      toast({
        title: "Email required",
        description: "Please enter an email address for testing",
        variant: "destructive",
      });
      return;
    }

    sendTestEmailMutation.mutate({
      email: testEmail,
      subject: "Test Email from Jai Guru Astro Remedy",
      message: testMessage || "This is a test email to verify email service functionality."
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="admin-notifications">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold neon-text text-primary">
            "Notification Services"
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage SMS and email communication services
          </p>
        </div>
        <Badge 
          variant={notificationStatus?.twilioConfigured && notificationStatus?.emailConfigured ? "default" : "destructive"}
          className="px-3 py-1"
        >
          {notificationStatus?.twilioConfigured && notificationStatus?.emailConfigured ? "All Services Active" : "Setup Required"}
        </Badge>
      </div>

      {/* Service Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SMS Service Status */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                notificationStatus?.twilioConfigured ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                <MessageSquare className={`w-6 h-6 ${
                  notificationStatus?.twilioConfigured ? 'text-green-400' : 'text-red-400'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">SMS Service</h3>
                <p className="text-sm text-muted-foreground">Twilio Integration</p>
              </div>
            </div>
            {notificationStatus?.twilioConfigured ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <span className={notificationStatus?.twilioConfigured ? 'text-green-400' : 'text-red-400'}>
                {notificationStatus?.twilioConfigured ? 'Connected' : 'Not Configured'}
              </span>
            </div>
            
            {notificationStatus?.services?.sms?.features && (
              <div>
                <span className="text-muted-foreground">Features:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {notificationStatus.services.sms.features.map((feature: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Email Service Status */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                notificationStatus?.emailConfigured ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                <Mail className={`w-6 h-6 ${
                  notificationStatus?.emailConfigured ? 'text-green-400' : 'text-red-400'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Email Service</h3>
                <p className="text-sm text-muted-foreground">Amazon SES Integration</p>
              </div>
            </div>
            {notificationStatus?.emailConfigured ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <span className={notificationStatus?.emailConfigured ? 'text-green-400' : 'text-red-400'}>
                {notificationStatus?.emailConfigured ? 'Connected' : 'Not Configured'}
              </span>
            </div>
            
            {notificationStatus?.services?.email?.features && (
              <div>
                <span className="text-muted-foreground">Features:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {notificationStatus.services.email.features.map((feature: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Service Testing */}
      <Tabs defaultValue="sms" className="w-full">
        <TabsList className="grid w-full grid-cols-2 glass-card">
          <TabsTrigger value="sms">SMS Testing</TabsTrigger>
          <TabsTrigger value="email">Email Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="sms" className="space-y-4">
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Smartphone className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Test SMS Service</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Country Code
                  </label>
                  <Select value={testCountryCode} onValueChange={setTestCountryCode}>
                    <SelectTrigger className="form-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="+91">🇮🇳 +91 India</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1 USA</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44 UK</SelectItem>
                      <SelectItem value="+971">🇦🇪 +971 UAE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="9876543210"
                    value={testPhoneNumber}
                    onChange={(e) => setTestPhoneNumber(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <Button
                onClick={handleTestSMS}
                disabled={sendTestSMSMutation.isPending || !notificationStatus?.twilioConfigured}
                className="neon-button"
              >
                <Send className="w-4 h-4 mr-2" />
                {sendTestSMSMutation.isPending ? 'Sending...' : 'Send Test OTP'}
              </Button>

              {!notificationStatus?.twilioConfigured && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <p className="text-sm text-yellow-400">
                      Twilio credentials not configured. SMS testing is disabled.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Mail className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Test Email Service</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Test Message (Optional)
                </label>
                <Input
                  type="text"
                  placeholder={"Custom test message..."}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="form-input"
                />
              </div>

              <Button
                onClick={handleTestEmail}
                disabled={sendTestEmailMutation.isPending || !notificationStatus?.emailConfigured}
                className="neon-button"
              >
                <Send className="w-4 h-4 mr-2" />
                {sendTestEmailMutation.isPending ? 'Sending...' : 'Send Test Email'}
              </Button>

              {!notificationStatus?.emailConfigured && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <p className="text-sm text-yellow-400">
                      Amazon SES credentials not configured. Email testing is disabled.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>

      {/* Configuration Guide */}
      <GlassCard className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Settings className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Configuration Guide</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">Twilio SMS Setup:</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• TWILIO_ACCOUNT_SID - Account identifier</li>
                <li>• TWILIO_AUTH_TOKEN - Authentication token</li>
                <li>• TWILIO_PHONE_NUMBER - Your Twilio number</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Amazon SES Setup:</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• AWS_ACCESS_KEY_ID - AWS access key</li>
                <li>• AWS_SECRET_ACCESS_KEY - AWS secret key</li>
                <li>• AWS_SES_FROM_EMAIL - Verified sender email</li>
                <li>• AWS_REGION - AWS region (default: us-east-1)</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-foreground">
              <strong>Note:</strong> All notification services work in development mode with console logging. 
              Once you configure the API credentials, real SMS and emails will be sent.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}