import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/ui/glass-card";
import { 
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Package,
  BookOpen,
  MessageCircle,
  Star,
  Activity,
  Eye,
  Clock,
  Target,
  Globe,
  Zap
} from "lucide-react";


export default function AdminAnalytics() {
  const [, setLocation] = useLocation();

  // Check if user is admin
  const { data: user } = useQuery({
    queryKey: ["/api/profile"],
    enabled: !!localStorage.getItem("token"),
  });

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/admin/analytics"],
    enabled: !!localStorage.getItem("token") && user?.isAdmin,
  });

  if (!user?.isAdmin) {
    setLocation("/");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Mock analytics data - would come from backend in real implementation
  const revenueData = [
    { month: 'Jan', revenue: 45000, consultations: 120, courses: 45 },
    { month: 'Feb', revenue: 52000, consultations: 135, courses: 52 },
    { month: 'Mar', revenue: 48000, consultations: 128, courses: 48 },
    { month: 'Apr', revenue: 61000, consultations: 156, courses: 61 },
    { month: 'May', revenue: 55000, consultations: 142, courses: 55 },
    { month: 'Jun', revenue: 67000, consultations: 168, courses: 62 },
  ];

  const performanceMetrics = [
    {
      title: "Conversion Rate",
      value: "24.8%",
      change: "+3.2%",
      trend: "up",
      icon: Target,
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Avg Session Time",
      value: "8m 42s",
      change: "+1.5%",
      trend: "up",
      icon: Clock,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Customer Retention",
      value: "78.5%",
      change: "+5.1%",
      trend: "up",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "AI Accuracy",
      value: "94.2%",
      change: "+2.8%",
      trend: "up",
      icon: Zap,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10"
    }
  ];

  const topServices = [
    { name: "Birth Chart Reading", bookings: 156, revenue: 31200, growth: "+12%" },
    { name: "Relationship Consultation", bookings: 134, revenue: 26800, growth: "+8%" },
    { name: "Career Guidance", bookings: 98, revenue: 19600, growth: "+15%" },
    { name: "Health & Wellness", bookings: 87, revenue: 17400, growth: "+6%" },
    { name: "Muhurat Consultation", bookings: 76, revenue: 15200, growth: "+22%" },
  ];

  const trafficSources = [
    { source: "Organic Search", visitors: 2456, percentage: 42 },
    { source: "Social Media", visitors: 1834, percentage: 32 },
    { source: "Direct", visitors: 987, percentage: 17 },
    { source: "Referrals", visitors: 523, percentage: 9 },
  ];

  return (
    <div className="min-h-screen pt-16 pb-16" data-testid="admin-analytics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold neon-text text-primary mb-2">
            "Analytics & Reports"
          </h1>
          <p className="text-muted-foreground">
            "Comprehensive insights into your astrology business performance"
          </p>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => (
            <GlassCard key={index} className="p-6 hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl ${metric.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <metric.icon className={`w-7 h-7 ${metric.color}`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                  <span>{metric.change}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {metric.value}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Monthly Revenue Trend</h3>
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className="space-y-4">
              {revenueData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">{data.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-background rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" 
                        style={{ width: `${(data.revenue / 70000) * 100}%` }}
                      />
                    </div>
                    <span className="text-foreground font-semibold text-sm">
                      ₹{data.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Top Services</h3>
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="space-y-4">
              {topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary text-sm">₹{service.revenue.toLocaleString()}</p>
                    <p className="text-xs text-green-400">{service.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Traffic Sources & User Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Traffic Sources</h3>
              <Globe className="w-6 h-6 text-blue-400" />
            </div>
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground text-sm">{source.source}</span>
                    <span className="text-muted-foreground text-sm">{source.visitors} visitors</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full" 
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">User Engagement</h3>
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <div className="w-full h-full border-8 border-background rounded-full"></div>
                  <div className="absolute inset-0 w-full h-full border-8 border-primary rounded-full" 
                       style={{ clipPath: 'polygon(0 0, 75% 0, 75% 100%, 0 100%)' }}>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">75%</div>
                      <div className="text-xs text-muted-foreground">Engagement</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-400">8.2min</div>
                  <div className="text-xs text-muted-foreground">Avg. Session</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-400">92%</div>
                  <div className="text-xs text-muted-foreground">Satisfaction</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-primary mb-2">1,247</div>
            <div className="text-sm text-muted-foreground mb-1">Total Consultations</div>
            <div className="text-xs text-green-400">+18% this month</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-primary mb-2">89</div>
            <div className="text-sm text-muted-foreground mb-1">Course Enrollments</div>
            <div className="text-xs text-green-400">+12% this month</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-primary mb-2">2,847</div>
            <div className="text-sm text-muted-foreground mb-1">AI Chat Sessions</div>
            <div className="text-xs text-green-400">+25% this month</div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}