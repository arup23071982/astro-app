import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Smartphone, 
  QrCode, 
  Building, 
  ShieldCheck,
  ArrowLeft,
  Lock,
  CheckCircle,
  Info,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";


interface CheckoutItem {
  id: string;
  type: 'consultation' | 'course' | 'product';
  name: string;
  description?: string;
  price: number;
  duration?: number;
  quantity?: number;
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("upi_intent");
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Get cart items from localStorage or URL params
  const [cartItems, setCartItems] = useState<CheckoutItem[]>([]);
  
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    } else {
      // If no cart, redirect to home
      setLocation("/");
    }
  }, [setLocation]);

  const { data: user } = useQuery({
    queryKey: ["/api/profile"],
    enabled: !!localStorage.getItem("token"),
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      return apiRequest("POST", "/api/payments/phonepe/create", paymentData);
    },
    onSuccess: (data) => {
      if (data.success && data.paymentUrl) {
        // Redirect to PhonePe payment page
        window.location.href = data.paymentUrl;
      } else {
        toast({
          title: "Payment Error",
          description: data.message || "Failed to initiate payment",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to create payment",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const gst = Math.round(totalAmount * 0.18);
  const finalAmount = totalAmount + gst;

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to continue with payment",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    if (paymentMethod === "upi_collect" && !upiId) {
      toast({
        title: "UPI ID Required",
        description: "Please enter your UPI ID for UPI Collect payment",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const paymentData = {
      amount: finalAmount * 100, // Convert to paisa
      merchantOrderId: `ORDER_${Date.now()}_${user.id}`,
      merchantUserId: user.id,
      items: cartItems,
      paymentMethod,
      upiId: paymentMethod === "upi_collect" ? upiId : undefined,
      redirectUrl: `${window.location.origin}/payment/success`,
      callbackUrl: `${window.location.origin}/api/payments/phonepe/callback`,
    };

    createPaymentMutation.mutate(paymentData);
  };

  const paymentMethods = [
    {
      id: "upi_intent",
      name: "UPI Apps",
      description: "Pay using PhonePe, Google Pay, Paytm, etc.",
      icon: Smartphone,
      popular: true
    },
    {
      id: "upi_collect",
      name: "UPI ID",
      description: "Enter your UPI ID to receive payment request",
      icon: QrCode,
      popular: false
    },
    {
      id: "upi_qr", 
      name: "UPI QR Code",
      description: "Scan QR code with any UPI app",
      icon: QrCode,
      popular: false
    },
    {
      id: "card",
      name: "Debit/Credit Card",
      description: "Visa, Mastercard, RuPay cards accepted",
      icon: CreditCard,
      popular: false
    },
    {
      id: "netbanking",
      name: "Net Banking",
      description: "Pay directly from your bank account",
      icon: Building,
      popular: false
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <GlassCard className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-6">Please login to proceed with checkout</p>
          <Button onClick={() => setLocation("/login")} className="neon-button">
            Login to Continue
          </Button>
        </GlassCard>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <GlassCard className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-4">Empty Cart</h2>
          <p className="text-muted-foreground mb-6">Add items to cart before checkout</p>
          <Button onClick={() => setLocation("/")} className="neon-button">
            Continue Shopping
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-16" data-testid="checkout-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation(-1)}
            className="mr-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold neon-text text-primary mb-2">
              Secure Checkout
            </h1>
            <div className="flex items-center text-muted-foreground">
              <Lock className="w-4 h-4 mr-2" />
              <span>SSL Encrypted & Secure Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6 sticky top-24">
              <h3 className="text-xl font-bold text-foreground mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                      {item.duration && (
                        <p className="text-sm text-primary">{item.duration} minutes</p>
                      )}
                      {item.quantity && item.quantity > 1 && (
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-primary/20 pt-4 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (18%)</span>
                  <span>₹{gst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-primary/20">
                  <span>Total</span>
                  <span>₹{finalAmount.toLocaleString()}</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">Choose Payment Method</h3>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="relative">
                    <div className={`glass p-4 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === method.id ? 'ring-2 ring-primary' : 'hover:bg-primary/5'
                    }`}>
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                            <method.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Label htmlFor={method.id} className="font-medium text-foreground cursor-pointer">
                                {method.name}
                              </Label>
                              {method.popular && (
                                <Badge variant="secondary" className="text-xs">Most Popular</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* UPI Collect Input */}
                    {paymentMethod === "upi_collect" && method.id === "upi_collect" && (
                      <div className="mt-4 p-4 bg-background/50 rounded-lg">
                        <Label htmlFor="upiId" className="text-sm font-medium text-foreground">
                          Enter UPI ID
                        </Label>
                        <Input
                          id="upiId"
                          type="text"
                          placeholder="yourname@paytm"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="mt-2 form-input"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </RadioGroup>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-400">100% Secure Payment</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your payment is protected by 256-bit SSL encryption and processed through PhonePe's secure gateway.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full mt-6 neon-button text-lg py-6"
                data-testid="pay-button"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Pay ₹{finalAmount.toLocaleString()}
                  </>
                )}
              </Button>

              {/* Terms */}
              <p className="text-xs text-muted-foreground text-center mt-4">
                By proceeding with payment, you agree to our{" "}
                <span className="text-primary cursor-pointer">Terms & Conditions</span> and{" "}
                <span className="text-primary cursor-pointer">Privacy Policy</span>
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}