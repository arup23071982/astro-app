import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Download, 
  Calendar, 
  ArrowRight, 
  Home,
  Receipt,
  Share2,
  Clock
} from "lucide-react";


export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [transactionId, setTransactionId] = useState<string>("");
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Get transaction ID from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const txnId = urlParams.get('transactionId') || urlParams.get('merchantTransactionId');
    if (txnId) {
      setTransactionId(txnId);
    }
    
    // Clear cart after successful payment
    localStorage.removeItem('cart');
  }, []);

  const { data: paymentDetails, isLoading } = useQuery({
    queryKey: ["/api/payments/details", transactionId],
    enabled: !!transactionId,
  });

  useEffect(() => {
    if (paymentDetails) {
      setOrderDetails(paymentDetails);
    }
  }, [paymentDetails]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-16" data-testid="payment-success">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold neon-text text-primary mb-2">
            "Payment Successful!"
          </h1>
          <p className="text-muted-foreground">
            "Thank you for your payment. Your order has been confirmed."
          </p>
        </div>

        {/* Payment Details */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">"Payment Details"</h3>
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="w-3 h-3 mr-1" />
              "Completed"
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono text-sm text-foreground">{transactionId}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="text-foreground">PhonePe UPI</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="text-lg font-semibold text-primary">
                ₹{orderDetails?.totalAmount?.toLocaleString() || '0'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payment Date</span>
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

        {/* Order Summary */}
        {orderDetails?.items && (
          <GlassCard className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Order Summary</h3>
            <div className="space-y-3">
              {orderDetails.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                    {item.duration && (
                      <div className="flex items-center text-sm text-primary mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {item.duration} minutes
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                    </p>
                    {item.quantity && item.quantity > 1 && (
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Next Steps */}
        <GlassCard className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">What's Next?</h3>
          <div className="space-y-3">
            <div className="flex items-center text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
              <span>Payment confirmation sent to your email</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
              <span>Order details updated in your account</span>
            </div>
            {orderDetails?.items?.some((item: any) => item.type === 'consultation') && (
              <div className="flex items-center text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary mr-3" />
                <span>Consultation will be scheduled shortly</span>
              </div>
            )}
            {orderDetails?.items?.some((item: any) => item.type === 'course') && (
              <div className="flex items-center text-muted-foreground">
                <Download className="w-4 h-4 text-primary mr-3" />
                <span>Course access will be activated within 24 hours</span>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={() => setLocation("/dashboard")}
            className="neon-button"
            data-testid="view-orders-button"
          >
            <Receipt className="w-4 h-4 mr-2" />
            View My Orders
          </Button>
          
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="glass"
            data-testid="continue-shopping-button"
          >
            <Home className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>

        {/* Share Success */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-4">
            Share your experience with Jai Guru Astro Remedy
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="sm" variant="ghost" className="text-primary">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8 p-4 bg-primary/10 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Need help? Contact our support team at{" "}
            <span className="text-primary">support@jaiguruastroremedy.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}