// File: AstroOracle/client/src/App.tsx
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Auth from "@/pages/auth/auth";
import Booking from "@/pages/booking";
import Courses from "@/pages/courses";
import Products from "@/pages/products";
import Consultation from "@/pages/consultation";
import HomeTuition from "@/pages/home-tuition";
import OneToOneApplication from "@/pages/home-tuition/apply/one-to-one/[courseId]";
import GroupApplication from "@/pages/home-tuition/apply/group/[courseId]";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminClients from "@/pages/admin/clients";
import AdminCourses from "@/pages/admin/courses";
import AdminProducts from "@/pages/admin/products";
import AdminFAQs from "@/pages/admin/faqs";
import AdminConsultations from "@/pages/admin/consultations";
import AdminHomeTuition from "@/pages/admin/home-tuition-management";
import AdminSupportChat from "@/pages/admin/support-chat";
import AdminAnalytics from "@/pages/admin/analytics";
import AdminNotifications from "@/pages/admin/notifications";
import Checkout from "@/pages/checkout";
import PaymentSuccess from "@/pages/payment/success";
import PaymentFailed from "@/pages/payment/failed";
import ConsultationSession from "@/pages/consultation-session";
import ConsultationFeedback from "@/pages/consultation-feedback";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import CosmicBackground from "@/components/layout/cosmic-background";
import AIChatbot from "@/components/support/ai-chatbot";
import { SpeedInsights } from '@vercel/speed-insights/react'; // <-- ADDED THIS LINE

function LoginRedirect() {
  const [, setLocation] = useLocation();
  setLocation('/auth');
  return null;
}

function RegisterRedirect() {
  const [, setLocation] = useLocation();
  setLocation('/auth/register');
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/login" component={LoginRedirect} />
      <Route path="/register" component={RegisterRedirect} />
      <Route path="/auth/login" component={Auth} />
      <Route path="/auth/register" component={Auth} />
      <Route path="/booking" component={Booking} />
      <Route path="/courses" component={Courses} />
      <Route path="/home-tuition" component={HomeTuition} />
      <Route path="/home-tuition/apply/one-to-one/:courseId" component={OneToOneApplication} />
      <Route path="/home-tuition/apply/group/:courseId" component={GroupApplication} />
      <Route path="/products" component={Products} />
      <Route path="/consultation/:id" component={Consultation} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/clients" component={AdminClients} />
      <Route path="/admin/courses" component={AdminCourses} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/faqs" component={AdminFAQs} />
      <Route path="/admin/consultations" component={AdminConsultations} />
      <Route path="/admin/home-tuition" component={AdminHomeTuition} />
      <Route path="/admin/support-chat" component={AdminSupportChat} />
      <Route path="/admin/analytics" component={AdminAnalytics} />
      <Route path="/admin/notifications" component={AdminNotifications} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/payment/success" component={PaymentSuccess} />
      <Route path="/payment/failed" component={PaymentFailed} />
      <Route path="/mobile-login">
        {() => {
          window.location.href = '/login';
          return null;
        }}
      </Route>
      <Route path="/consultation-session" component={ConsultationSession} />
      <Route path="/consultation-feedback" component={ConsultationFeedback} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-background text-foreground">
            <CosmicBackground />
            <Navigation />
            <main className="relative z-10">
              <Router />
            </main>
            {!isAdminRoute && <Footer />}
            <AIChatbot />
            <Toaster />
            <SpeedInsights /> {/* <-- ADDED THIS LINE */}
          </div>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
