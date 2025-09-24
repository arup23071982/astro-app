import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  XCircle, 
  RefreshCw, 
  Home, 
  MessageCircle,
  AlertTriangle,
  CreditCard,
  HelpCircle
} from "lucide-react";


export default function PaymentFailed() {
  const [, setLocation] = useLocation();
  const [errorDetails, setErrorDetails] = useState<any>(null);

  useEffect(() => {
    // Get error details from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const message = urlParams.get('message');
    
    if (error || message) {
      setErrorDetails({
        error: error || 'PAYMENT_FAILED',
        message: message || 'Payment could not be processed'
      });
    }
  }, []);

  const commonReasons = [
    {
      title: "Insufficient Balance",
      description: "Your account doesn't have enough balance",
      icon: CreditCard,
      solution: "Add money to your UPI account or use a different payment method"
    },
    {
      title: "Network Issues",
      description: "Poor internet connection during payment",
      icon: RefreshCw,
      solution: "Check your internet connection and try again"
    },
    {
      title: "Bank Server Issues",
      description: "Your bank's server was temporarily unavailable",
      icon: AlertTriangle,
      solution: "Wait a few minutes and retry the payment"
    },
    {
      title: "Incorrect UPI PIN",
      description: "Wrong UPI PIN entered multiple times",
      icon: XCircle,
      solution: "Double-check your UPI PIN and try again"
    }
  ];

  const handleRetryPayment = () => {
    // Redirect back to checkout
    setLocation("/checkout");
  };

  return (
    <div className="min-h-screen pt-16 pb-16" data-testid="payment-failed">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Failed Animation */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <XCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-red-400 mb-2">
            "Payment Failed"
          </h1>
          <p className="text-muted-foreground">
            "Your payment could not be processed. Don't worry, no money was deducted."
          </p>
        </div>

        {/* Error Details */}
        {errorDetails && (
          <GlassCard className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">"Error Details"</h3>
              <Badge variant="destructive">
                <XCircle className="w-3 h-3 mr-1" />
                "Failed"
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Error Code</span>
                <span className="font-mono text-sm text-foreground">{errorDetails.error}</span>
              </div>
              
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Reason</span>
                <span className="text-foreground text-right max-w-xs">{errorDetails.message}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Time</span>
                <span className="text-foreground">
                  {new Date().toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Common Reasons */}
        <GlassCard className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Common Reasons & Solutions</h3>
          <div className="space-y-4">
            {commonReasons.map((reason, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 glass rounded-lg">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <reason.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">{reason.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{reason.description}</p>
                  <p className="text-xs text-primary">{reason.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={handleRetryPayment}
              className="neon-button"
              data-testid="retry-payment-button"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Payment
            </Button>
            
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              className="glass"
              data-testid="back-to-home-button"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </GlassCard>

        {/* Payment Tips */}
        <GlassCard className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Payment Tips</h3>
          <div className="space-y-3">
            <div className="flex items-center text-muted-foreground">
              <HelpCircle className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
              <span className="text-sm">Ensure stable internet connection during payment</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <HelpCircle className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
              <span className="text-sm">Check your UPI app balance before making payment</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <HelpCircle className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
              <span className="text-sm">Try using a different UPI app if payment keeps failing</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <HelpCircle className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
              <span className="text-sm">Contact your bank if the issue persists</span>
            </div>
          </div>
        </GlassCard>

        {/* Alternative Payment Methods */}
        <GlassCard className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Try Alternative Methods</h3>
          <p className="text-muted-foreground text-sm mb-4">
            If UPI payment is not working, you can try these alternatives:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="text-center p-3 glass rounded-lg">
              <CreditCard className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-foreground font-medium">Debit/Credit Card</p>
            </div>
            <div className="text-center p-3 glass rounded-lg">
              <CreditCard className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-foreground font-medium">Net Banking</p>
            </div>
            <div className="text-center p-3 glass rounded-lg">
              <CreditCard className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-foreground font-medium">UPI QR Code</p>
            </div>
          </div>
        </GlassCard>

        {/* Support Contact */}
        <div className="text-center">
          <div className="p-6 bg-primary/10 rounded-lg">
            <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our support team is available 24/7 to assist you
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="sm" variant="outline" className="glass">
                <MessageCircle className="w-4 h-4 mr-2" />
                Live Chat
              </Button>
              <Button size="sm" variant="outline" className="glass">
                Email: support@jaiguruastroremedy.com
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}