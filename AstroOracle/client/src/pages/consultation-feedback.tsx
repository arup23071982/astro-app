import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star, ThumbsUp, MessageCircle, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ConsultationFeedback() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState({
    rating: 5,
    experience: "excellent",
    helpfulness: "very-helpful",
    clarity: "very-clear",
    recommendation: "yes",
    comments: "",
    suggestions: "",
    followUp: false
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: async (feedbackData: typeof feedback) => {
      return apiRequest("POST", "/api/consultation-feedback", feedbackData);
    },
    onSuccess: () => {
      toast({
        title: "Thank You!",
        description: "Your feedback has been submitted successfully.",
      });
      setTimeout(() => {
        setLocation('/');
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedbackMutation.mutate(feedback);
  };

  const StarRating = ({ rating, onChange }: { rating: number; onChange: (rating: number) => void }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          
          <GlassCard className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold neon-text mb-2">Consultation Complete!</h1>
              <p className="text-muted-foreground">
                Thank you for your session with Astrologer Arup Shastri. Your feedback helps us improve our services.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Overall Rating */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  Overall Rating *
                </label>
                <div className="flex items-center space-x-4">
                  <StarRating 
                    rating={feedback.rating} 
                    onChange={(rating) => setFeedback({ ...feedback, rating })}
                  />
                  <span className="text-sm text-muted-foreground">
                    ({feedback.rating} / 5 stars)
                  </span>
                </div>
              </div>

              {/* Experience Rating */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  How was your overall experience? *
                </label>
                <RadioGroup 
                  value={feedback.experience} 
                  onValueChange={(value) => setFeedback({ ...feedback, experience: value })}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excellent" id="excellent" />
                      <Label htmlFor="excellent">Excellent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="good" />
                      <Label htmlFor="good">Good</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="average" id="average" />
                      <Label htmlFor="average">Average</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="poor" id="poor" />
                      <Label htmlFor="poor">Poor</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Helpfulness */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  How helpful was the consultation? *
                </label>
                <RadioGroup 
                  value={feedback.helpfulness} 
                  onValueChange={(value) => setFeedback({ ...feedback, helpfulness: value })}
                >
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very-helpful" id="very-helpful" />
                      <Label htmlFor="very-helpful">Very helpful - got clear guidance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="somewhat-helpful" id="somewhat-helpful" />
                      <Label htmlFor="somewhat-helpful">Somewhat helpful - some questions answered</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-helpful" id="not-helpful" />
                      <Label htmlFor="not-helpful">Not very helpful - unclear guidance</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Clarity */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  How clear were the explanations? *
                </label>
                <RadioGroup 
                  value={feedback.clarity} 
                  onValueChange={(value) => setFeedback({ ...feedback, clarity: value })}
                >
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very-clear" id="very-clear" />
                      <Label htmlFor="very-clear">Very clear - easy to understand</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mostly-clear" id="mostly-clear" />
                      <Label htmlFor="mostly-clear">Mostly clear - minor confusion</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unclear" id="unclear" />
                      <Label htmlFor="unclear">Unclear - hard to follow</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Recommendation */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  Would you recommend our services to others? *
                </label>
                <RadioGroup 
                  value={feedback.recommendation} 
                  onValueChange={(value) => setFeedback({ ...feedback, recommendation: value })}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="recommend-yes" />
                      <Label htmlFor="recommend-yes">Yes, definitely</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maybe" id="recommend-maybe" />
                      <Label htmlFor="recommend-maybe">Maybe</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="recommend-no" />
                      <Label htmlFor="recommend-no">No</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Comments */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  Additional Comments
                </label>
                <Textarea
                  value={feedback.comments}
                  onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                  placeholder="Share your thoughts about the consultation, what you liked, and any specific insights you received..."
                  className="form-input min-h-[100px]"
                  data-testid="comments-input"
                />
              </div>

              {/* Suggestions */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  Suggestions for Improvement
                </label>
                <Textarea
                  value={feedback.suggestions}
                  onChange={(e) => setFeedback({ ...feedback, suggestions: e.target.value })}
                  placeholder="How can we improve our consultation services? Any features or topics you'd like to see covered..."
                  className="form-input min-h-[100px]"
                  data-testid="suggestions-input"
                />
              </div>

              {/* Follow-up Interest */}
              <div className="glass p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="followUp"
                    checked={feedback.followUp}
                    onChange={(e) => setFeedback({ ...feedback, followUp: e.target.checked })}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="followUp" className="font-medium">
                      I'm interested in follow-up consultations
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      We'll contact you about future consultation options and special offers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center space-x-4 pt-6">
                <NeonButton
                  type="submit"
                  className="flex-1"
                  disabled={submitFeedbackMutation.isPending}
                  data-testid="submit-feedback"
                >
                  {submitFeedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
                </NeonButton>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation('/')}
                  data-testid="skip-feedback"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Skip & Go Home
                </Button>
              </div>
            </form>

            {/* Thank You Message */}
            <div className="text-center mt-8 pt-6 border-t border-primary/20">
              <MessageCircle className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Thank you for choosing Jai Guru Astro Remedy for your astrological guidance!
              </p>
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
}