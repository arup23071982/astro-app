import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Video, Phone, MessageSquare, MapPin, Home, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
// AutoTranslate import removed for fast loading

export default function Booking() {
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
    dateOfBirth: string;
    timeOfBirth: string;
    ampm: string;
    placeOfBirth: string;
    consultationType: string;
    consultationMode: string;
    topic: string;
    selectedTopics: string[];
    plan: string;
    duration: number;
    price: number;
    scheduledDate: string;
    scheduledTime: string;
    notes: string;
    language: string;
    paymentMethod: string;
    agreedToTerms: boolean;
  }>({
    fullName: "",
    email: "",
    countryCode: "+91",
    phoneNumber: "",
    dateOfBirth: "",
    timeOfBirth: "",
    ampm: "AM",
    placeOfBirth: "",
    consultationType: "",
    consultationMode: "online", // online, offline
    topic: "",
    selectedTopics: [], // For multi-topic consultations
    plan: "",
    duration: 30,
    price: 0,
    scheduledDate: "",
    scheduledTime: "",
    notes: "",
    language: "en",
    paymentMethod: "",
    agreedToTerms: false,
  });
  const { toast } = useToast();

  const consultationTopics = [
    { value: "birth_chart", label: "Birth Chart Analysis", description: "Complete birth chart reading with planetary positions and their effects", icon: "🌟" },
    { value: "career", label: "Career & Job", description: "Career guidance, job changes, and professional growth", icon: "💼" },
    { value: "business", label: "Business & Income", description: "Business prospects, income opportunities, and financial growth", icon: "💰" },
    { value: "partnerships", label: "Partnership", description: "Business partnerships and collaborations", icon: "🤝" },
    { value: "education", label: "Education", description: "Academic guidance and educational decisions", icon: "📚" },
    { value: "marriage", label: "Marriage", description: "Marriage timing and marital life analysis", icon: "💒" },
    { value: "marital_discord", label: "Marital Discord", description: "Relationship problems and marriage issues", icon: "💔" },
    { value: "breakup", label: "Break Up", description: "Relationship breakups and moving forward", icon: "💔" },
    { value: "dreams", label: "Dreams", description: "Dream interpretation and subconscious guidance", icon: "💭" },
    { value: "success", label: "Success", description: "Path to success and achievement guidance", icon: "🏆" },
    { value: "divorce", label: "Divorce", description: "Divorce proceedings and life after separation", icon: "⚖️" },
    { value: "love_affairs", label: "Love Affairs", description: "Romantic relationships and love life guidance", icon: "💕" },
    { value: "litigation", label: "Litigation", description: "Legal matters and court cases", icon: "⚖️" },
    { value: "offspring", label: "Offspring", description: "Children, pregnancy, and family planning", icon: "👶" },
    { value: "siblings", label: "Brother/Sister", description: "Sibling relationships and family dynamics", icon: "👫" },
    { value: "property", label: "House/Land", description: "Property matters, real estate, and land dealings", icon: "🏠" },
    { value: "vehicle", label: "Vehicle", description: "Vehicle purchase and transportation matters", icon: "🚗" },
    { value: "parents", label: "Father/Mother", description: "Parental relationships and family guidance", icon: "👥" },
    { value: "relatives", label: "Relatives", description: "Extended family and relative relationships", icon: "👨‍👩‍👧‍👦" },
    { value: "bank_balance", label: "Bank Balance", description: "Financial status and wealth accumulation", icon: "🏦" },
    { value: "friends", label: "Friends", description: "Friendship and social relationships", icon: "👫" },
    { value: "enemies", label: "Enemies", description: "Dealing with adversaries and conflicts", icon: "⚡" },
    { value: "health", label: "Diseases/Health", description: "Health predictions and wellness guidance", icon: "🌿" },
    { value: "fortune", label: "Fortune", description: "Overall luck and destiny analysis", icon: "🍀" },
    { value: "accident", label: "Accident", description: "Accident prevention and safety guidance", icon: "⚠️" },
    { value: "small_tour", label: "Small Tour", description: "Local travel and short trips", icon: "🚗" },
    { value: "foreign_travel", label: "Foreign Travel", description: "International travel and settlement abroad", icon: "✈️" },
    { value: "share_market", label: "Share Market", description: "Stock market investments and trading", icon: "📈" },
    { value: "sudden_gain", label: "Sudden Gain", description: "Unexpected profits and windfalls", icon: "💎" },
    { value: "lottery", label: "Lottery", description: "Gambling luck and lottery predictions", icon: "🎰" },
  ];

  const consultationTypes = [
    {
      type: "video",
      icon: Video,
      title: "Video Call",
      description: "Face-to-face consultation via secure video call",
      plans: [
        { name: "Quick Guidance", duration: 15, price: 299 },
        { name: "Focused Analysis", duration: 30, price: 499 },
        { name: "In-Depth Analysis", duration: 45, price: 749 },
        { name: "Comprehensive Analysis", duration: 60, price: 999 },
      ],
    },
    {
      type: "audio",
      icon: Phone,
      title: "Audio Call",
      description: "Voice-only consultation for focused guidance",
      plans: [
        { name: "Quick Guidance", duration: 15, price: 299 },
        { name: "Focused Analysis", duration: 30, price: 499 },
        { name: "In-Depth Analysis", duration: 45, price: 749 },
        { name: "Comprehensive Analysis", duration: 60, price: 999 },
      ],
    },
    {
      type: "chat",
      icon: MessageSquare,
      title: "Chat Session",
      description: "Text-based consultation through secure messaging",
      plans: [
        { name: "Quick Guidance", duration: 15, price: 299 },
        { name: "Focused Analysis", duration: 30, price: 499 },
        { name: "In-Depth Analysis", duration: 45, price: 749 },
        { name: "Comprehensive Analysis", duration: 60, price: 999 },
      ],
    },
    {
      type: "in-person",
      icon: MapPin,
      title: "In-Person",
      description: "Traditional face-to-face consultation in Kolkata",
      plans: [
        { name: "Focused Analysis", duration: 30, price: 499 },
        { name: "In-Depth Analysis", duration: 45, price: 749 },
        { name: "Comprehensive Analysis", duration: 60, price: 999 },
      ],
      note: "Available only on Wednesdays (3pm-6pm) in Kolkata",
    },
    {
      type: "home-service",
      icon: Home,
      title: "Home Service",
      description: "Premium consultation at your home with personalized rituals",
      plans: [
        { name: "Sacred Home Consultation", duration: 90, price: 2499 },
        { name: "Complete Home Analysis", duration: 120, price: 3999 },
        { name: "Home Blessing Ceremony", duration: 180, price: 6999 },
      ],
      note: "Available within 25km of Kolkata. Includes travel, consultation, and sacred items. 48hrs advance booking required.",
    },
    {
      type: "topic-based",
      icon: Clock,
      title: "Topic-Based Consultation",
      description: "Select specific topics for focused guidance (6 minutes per topic)",
      plans: [
        { name: "Per Topic", duration: 6, price: 100, isPerTopic: true as const },
      ],
      note: "Available online only. Select multiple topics as needed.",
    },
  ];

  const countryCodes = [
    { value: "+91", label: "🇮🇳 +91 (India)" },
    { value: "+1", label: "🇺🇸 +1 (USA)" },
    { value: "+44", label: "🇬🇧 +44 (UK)" },
    { value: "+61", label: "🇦🇺 +61 (Australia)" },
    { value: "+971", label: "🇦🇪 +971 (UAE)" },
  ];

  // Available time slots based on astrologer's schedule
  // Monday to Sunday: 10am-11:15am, 12pm-1:30pm, 3pm-5pm, 7pm-9pm
  // Wednesday: No appointments between 3pm-5pm (reserved for offline consultations)
  const getAvailableTimeSlots = (selectedDate: Date | undefined) => {
    if (!selectedDate) return [];
    
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 3 = Wednesday
    const baseSlots = [
      "10:00", "10:15", "10:30", "10:45", "11:00", "11:15",
      "12:00", "12:15", "12:30", "12:45", "13:00", "13:15",
      "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45"
    ];
    
    // Add afternoon slots for non-Wednesday or offline consultations on Wednesday
    const afternoonSlots = ["15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45"];
    
    if (dayOfWeek === 3) { // Wednesday
      // For offline consultations, only 3pm-6pm slots available
      if (formData.consultationType === "in-person") {
        return ["15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];
      }
      // For online consultations, exclude 3pm-5pm slots
      return baseSlots;
    } else {
      // All other days include afternoon slots
      return [...baseSlots, ...afternoonSlots].sort();
    }
  };
  
  const timeSlots = getAvailableTimeSlots(selectedDate);

  const createConsultationMutation = useMutation({
    mutationFn: async (consultationData: any) => {
      return apiRequest("POST", "/api/consultations", consultationData);
    },
    onSuccess: async (response) => {
      const data = await response.json();
      toast({
        title: "Booking Confirmed!",
        description: "Your consultation has been scheduled successfully.",
      });
      
      // Create payment intent for the consultation
      if (formData.paymentMethod) {
        createPaymentIntent.mutate({
          amount: formData.price,
          currency: "inr",
          metadata: {
            consultationId: data.id,
            type: "consultation",
          },
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book consultation",
        variant: "destructive",
      });
    },
  });

  const createPaymentIntent = useMutation({
    mutationFn: async (paymentData: any) => {
      return apiRequest("POST", "/api/create-payment-intent", paymentData);
    },
    onSuccess: async (response) => {
      const data = await response.json();
      toast({
        title: "Payment Required",
        description: "Please complete payment to confirm your booking.",
      });
      // Here you would redirect to payment gateway
      console.log("Payment client secret:", data.clientSecret);
    },
  });

  const handleConsultationTypeChange = (type: string) => {
    const selectedType = consultationTypes.find(t => t.type === type);
    setFormData({
      ...formData,
      consultationType: type,
      consultationMode: type === "in-person" ? "offline" : "online",
      plan: "",
      duration: 0,
      price: 0,
      selectedTopics: [], // Reset topics when changing consultation type
      topic: "", // Reset single topic
    });
  };

  const handlePlanChange = (planName: string) => {
    const selectedType = consultationTypes.find(t => t.type === formData.consultationType);
    const selectedPlan = selectedType?.plans.find(p => p.name === planName);
    
    if (selectedPlan) {
      if ('isPerTopic' in selectedPlan && selectedPlan.isPerTopic && formData.selectedTopics.length > 0) {
        // Calculate total for topic-based consultation
        const totalDuration = formData.selectedTopics.length * selectedPlan.duration;
        const totalPrice = formData.selectedTopics.length * selectedPlan.price;
        setFormData({
          ...formData,
          plan: planName,
          duration: totalDuration,
          price: totalPrice,
        });
      } else {
        setFormData({
          ...formData,
          plan: planName,
          duration: selectedPlan.duration,
          price: selectedPlan.price,
        });
      }
    }
  };
  
  const handleTopicToggle = (topicValue: string) => {
    if (formData.consultationType === "topic-based") {
      const isSelected = formData.selectedTopics.includes(topicValue);
      const newSelectedTopics = isSelected 
        ? formData.selectedTopics.filter(t => t !== topicValue)
        : [...formData.selectedTopics, topicValue];
      
      // Recalculate pricing for topic-based consultations
      const selectedPlan = consultationTypes.find(t => t.type === "topic-based")?.plans[0];
      const totalDuration = newSelectedTopics.length * (selectedPlan?.duration || 6);
      const totalPrice = newSelectedTopics.length * (selectedPlan?.price || 100);
      
      setFormData({
        ...formData,
        selectedTopics: newSelectedTopics,
        duration: totalDuration,
        price: totalPrice,
        plan: newSelectedTopics.length > 0 ? "Per Topic" : "",
      });
    } else {
      // Single topic selection for regular consultations
      setFormData({
        ...formData,
        topic: topicValue,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!localStorage.getItem("token")) {
      toast({
        title: "Login Required",
        description: "Please login to book a consultation",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    if (!formData.agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    // Validation for different consultation types
    if (!formData.consultationType || !formData.plan) {
      toast({
        title: "Selection Required",
        description: "Please select consultation type and plan",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.consultationType === "topic-based") {
      if (formData.selectedTopics.length === 0) {
        toast({
          title: "Topic Selection Required",
          description: "Please select at least one topic for consultation",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!formData.topic) {
        toast({
          title: "Topic Required",
          description: "Please select a consultation topic",
          variant: "destructive",
        });
        return;
      }
    }

    const scheduledAt = new Date(`${formData.scheduledDate}T${formData.scheduledTime}:00`);
    
    createConsultationMutation.mutate({
      type: formData.consultationType,
      consultationMode: formData.consultationMode,
      topics: formData.consultationType === "topic-based" 
        ? formData.selectedTopics 
        : [formData.topic], // Single topic as array for consistency
      plan: formData.plan,
      duration: formData.duration,
      price: formData.price.toString(),
      scheduledAt,
      notes: formData.notes,
      language: formData.language,
      location: formData.consultationType === "in-person" ? "Kolkata Chamber" : null,
    });
  };

  return (
    <div className="min-h-screen pt-16 pb-16" data-testid="booking-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GlassCard className="p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6 neon-text text-primary" data-testid="booking-title">
              "Book Your Consultation"
            </h1>
            <p className="text-xl text-muted-foreground">
              "Choose your preferred consultation type and schedule your session with Astrologer Arup Shastri"
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">"Personal Information"</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    "Full Name" *
                  </label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="form-input"
                    required
                    data-testid="full-name-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    "Email Address"
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="form-input"
                    data-testid="email-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    "Country Code" *
                  </label>
                  <Select
                    value={formData.countryCode}
                    onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
                  >
                    <SelectTrigger className="form-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      {countryCodes.map((code) => (
                        <SelectItem key={code.value} value={code.value}>
                          {code.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    "Phone Number" *
                  </label>
                  <Input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="Enter your phone number"
                    className="form-input"
                    required
                    data-testid="phone-input"
                  />
                </div>
              </div>

              {/* Birth Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="form-input pr-10"
                      data-testid="birth-date-input"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Time of Birth
                  </label>
                  <div className="relative">
                    <Input
                      type="time"
                      value={formData.timeOfBirth}
                      onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
                      className="form-input pr-10"
                      data-testid="birth-time-input"
                    />
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    AM/PM
                  </label>
                  <Select
                    value={formData.ampm}
                    onValueChange={(value) => setFormData({ ...formData, ampm: value })}
                  >
                    <SelectTrigger className="form-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Place of Birth
                </label>
                <Input
                  value={formData.placeOfBirth}
                  onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                  placeholder="City, State/Province, Country"
                  className="form-input"
                  data-testid="birth-place-input"
                />
              </div>
            </div>

            {/* Consultation Type Selection */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Consultation Type</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {consultationTypes.map((consultation) => (
                  <div
                    key={consultation.type}
                    className={`glass-card p-6 cursor-pointer transition-all ${
                      formData.consultationType === consultation.type
                        ? "neon-border bg-primary/10"
                        : "hover:bg-primary/5"
                    }`}
                    onClick={() => handleConsultationTypeChange(consultation.type)}
                    data-testid={`consultation-${consultation.type}`}
                  >
                    <consultation.icon className={`w-8 h-8 mx-auto mb-4 ${
                      formData.consultationType === consultation.type ? "text-primary neon-text" : "text-primary"
                    }`} />
                    <h4 className="font-semibold text-center mb-2 text-primary">{consultation.title}</h4>
                    <p className="text-xs text-muted-foreground text-center">{consultation.description}</p>
                    {consultation.note && (
                      <p className="text-xs text-yellow-500 text-center mt-2">{consultation.note}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Topic Selection */}
              {formData.consultationType && formData.consultationType !== "topic-based" && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-foreground">"Choose Consultation Topic"</h4>
                  <p className="text-sm text-muted-foreground">"Select the main subject you'd like to discuss during your consultation"</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {consultationTopics.map((topic) => (
                      <div
                        key={topic.value}
                        className={`glass-card p-4 cursor-pointer transition-all ${
                          formData.topic === topic.value
                            ? "neon-border bg-primary/10"
                            : "hover:bg-primary/5"
                        }`}
                        onClick={() => handleTopicToggle(topic.value)}
                        data-testid={`topic-${topic.value}`}
                      >
                        <div className="text-2xl text-center mb-2">{topic.icon}</div>
                        <h5 className="font-semibold text-center mb-2 text-sm">{topic.label}</h5>
                        <p className="text-xs text-muted-foreground text-center">{topic.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Multi-Topic Selection for Topic-Based Consultations */}
              {formData.consultationType === "topic-based" && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-foreground">"Select Topics for Consultation"</h4>
                  <p className="text-sm text-muted-foreground">
                    "Choose multiple topics for your consultation (6 minutes per topic, ₹100 each)"
                  </p>
                  <div className="glass-card p-4 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>"Selected Topics": {formData.selectedTopics.length}</span>
                      <span>"Total Duration": {formData.selectedTopics.length * 6} "minutes"</span>
                      <span className="font-bold text-primary">"Total Price": ₹{formData.selectedTopics.length * 100}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {consultationTopics.map((topic) => {
                      const isSelected = formData.selectedTopics.includes(topic.value);
                      return (
                        <div
                          key={topic.value}
                          className={`glass-card p-4 cursor-pointer transition-all relative ${
                            isSelected
                              ? "neon-border bg-primary/10"
                              : "hover:bg-primary/5"
                          }`}
                          onClick={() => handleTopicToggle(topic.value)}
                          data-testid={`multi-topic-${topic.value}`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-primary-foreground text-xs">✓</span>
                            </div>
                          )}
                          <div className="text-2xl text-center mb-2">{topic.icon}</div>
                          <h5 className="font-semibold text-center mb-2 text-sm">{topic.label}</h5>
                          <p className="text-xs text-muted-foreground text-center">{topic.description}</p>
                          <div className="text-xs text-center mt-2 text-primary">6 min - ₹100</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Plan Selection */}
              {formData.consultationType && (
                (formData.consultationType === "topic-based" && formData.selectedTopics.length > 0) ||
                (formData.consultationType !== "topic-based" && formData.topic)
              ) && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-foreground">"Select Plan"</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {consultationTypes
                      .find(t => t.type === formData.consultationType)
                      ?.plans.map((plan) => (
                        <div
                          key={plan.name}
                          className={`glass-card p-4 cursor-pointer transition-all ${
                            formData.plan === plan.name
                              ? "neon-border bg-primary/10"
                              : "hover:bg-primary/5"
                          }`}
                          onClick={() => handlePlanChange(plan.name)}
                          data-testid={`plan-${plan.name.replace(/\s+/g, "-").toLowerCase()}`}
                        >
                          <h5 className="font-semibold text-center mb-2">{plan.name}</h5>
                          <div className="text-center">
                            <div className="text-xl font-bold neon-text text-primary">₹{plan.price}</div>
                            <div className="text-sm text-muted-foreground">{plan.duration} minutes</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Date & Time Selection */}
            {formData.plan && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground">"Schedule"</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      "Preferred Date" *
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="form-input justify-start text-left font-normal"
                          data-testid="date-picker"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? selectedDate.toDateString() : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="glass-card w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setFormData({ ...formData, scheduledDate: date?.toISOString().split('T')[0] || "" });
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      "Preferred Time" *
                    </label>
                    <Select
                      value={formData.scheduledTime}
                      onValueChange={(value) => setFormData({ ...formData, scheduledTime: value })}
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      "Consultation Language"
                    </label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => setFormData({ ...formData, language: value })}
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        <SelectItem value="en">"English"</SelectItem>
                        <SelectItem value="hi">"Hindi"</SelectItem>
                        <SelectItem value="bn">"Bengali"</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      "Payment Method" *
                    </label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue placeholder={"Select payment method"} />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        <SelectItem value="razorpay">"Razorpay (India)"</SelectItem>
                        <SelectItem value="cashfree">"Cashfree (India)"</SelectItem>
                        <SelectItem value="stripe">"Stripe (International)"</SelectItem>
                        <SelectItem value="paypal">"PayPal (International)"</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    "Special Requirements or Questions"
                  </label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={"Any specific areas you'd like to focus on during the consultation..."}
                    className="form-input min-h-[100px]"
                    data-testid="notes-input"
                  />
                </div>
              </div>
            )}

            {/* Terms & Conditions */}
            {formData.plan && (
              <div className="space-y-6">
                <div className="glass p-6 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={formData.agreedToTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: !!checked })}
                      data-testid="terms-checkbox"
                    />
                    <div className="text-sm text-muted-foreground">
                      "I agree to the"{" "}
                      <a href="#" className="text-primary hover:underline">"Terms of Service"</a>,{" "}
                      <a href="#" className="text-primary hover:underline">"Privacy Policy"</a>, "and understand that consultations are non-refundable. Rescheduling is allowed with 24-hour notice."
                    </div>
                  </div>
                </div>

                {/* Booking Summary */}
                {formData.price > 0 && (
                  <GlassCard className="p-6" variant="primary">
                    <h4 className="text-lg font-semibold text-foreground mb-4">"Booking Summary"</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>"Consultation Type":</span>
                        <span className="font-semibold">{formData.consultationType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>"Plan":</span>
                        <span className="font-semibold">{formData.plan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>"Duration":</span>
                        <span className="font-semibold">{formData.duration} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>"Date & Time":</span>
                        <span className="font-semibold">
                          {formData.scheduledDate && formData.scheduledTime 
                            ? `${new Date(formData.scheduledDate).toDateString()} at ${formData.scheduledTime}`
                            : "Not selected"}
                        </span>
                      </div>
                      <hr className="border-primary/20" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount:</span>
                        <span className="text-primary">₹{formData.price}</span>
                      </div>
                    </div>
                  </GlassCard>
                )}

                <div className="text-center pt-6 space-y-4">
                  <NeonButton
                    type="submit"
                    size="lg"
                    className="px-12 py-4"
                    disabled={createConsultationMutation.isPending}
                    data-testid="submit-booking-button"
                  >
                    {createConsultationMutation.isPending ? "Processing..." : "Proceed to Payment"}
                  </NeonButton>
                  
                  <div className="text-sm text-muted-foreground">
                    "or"{" "}
                    <button
                      type="button"
                      onClick={() => setLocation('/consultation-session?session=demo123')}
                      className="text-primary hover:underline"
                      data-testid="demo-session-link"
                    >
                      "View Demo Consultation Session"
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
