import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Home,
  Filter,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  PlayCircle,
  DollarSign,
  Users,
  TrendingUp,
  Star,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";


export default function AdminConsultations() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for testing (bypass authentication)
  const user = { isAdmin: true };
  const consultations = [
    { id: "1", clientName: "Ravi Kumar", type: "video", status: "completed", scheduledAt: "2024-01-15T14:00:00Z", duration: 60, amount: 2500, rating: 5 },
    { id: "2", clientName: "Priya Sharma", type: "audio", status: "scheduled", scheduledAt: "2024-01-22T16:00:00Z", duration: 30, amount: 1800, rating: null }
  ];
  const isLoading = false;

  const updateConsultationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PUT", `/api/consultations/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/consultations"] });
      toast({
        title: "Updated",
        description: "Consultation status updated successfully",
      });
    },
  });

  // Bypass authentication for testing
  // if (!user?.isAdmin) {
  //   setLocation("/");
  //   return null;
  // }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "audio": return Phone;
      case "chat": return MessageSquare;
      case "in-person": return MapPin;
      case "home-service": return Home;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-500/20 text-blue-500";
      case "ongoing": return "bg-green-500/20 text-green-500";
      case "completed": return "bg-purple-500/20 text-purple-500";
      case "cancelled": return "bg-red-500/20 text-red-500";
      case "no-show": return "bg-orange-500/20 text-orange-500";
      default: return "bg-gray-500/20 text-gray-500";
    }
  };

  const filteredConsultations = consultations?.filter((consultation: any) => {
    const matchesSearch = consultation.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.topics?.some((topic: string) => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || consultation.status === statusFilter;
    const matchesType = typeFilter === "all" || consultation.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  const stats = {
    total: consultations?.length || 0,
    today: consultations?.filter((c: any) => 
      new Date(c.scheduledAt).toDateString() === new Date().toDateString()
    ).length || 0,
    pending: consultations?.filter((c: any) => c.status === "scheduled").length || 0,
    completed: consultations?.filter((c: any) => c.status === "completed").length || 0,
    revenue: consultations?.filter((c: any) => c.status === "completed")
      .reduce((sum: number, c: any) => sum + parseFloat(c.price), 0) || 0
  };

  return (
    <div className="min-h-screen pt-16 pb-16" data-testid="admin-consultations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/admin")}
              className="glass flex items-center space-x-2"
              data-testid="back-to-admin"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
          </div>
          <h1 className="text-4xl font-bold neon-text text-primary mb-2">
            Consultation Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage all consultation bookings and sessions
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-primary mb-1">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Bookings</div>
          </GlassCard>
          
          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">{stats.today}</div>
            <div className="text-sm text-muted-foreground">Today's Sessions</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400 mb-1">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-pink-400" />
            </div>
            <div className="text-2xl font-bold text-pink-400 mb-1">₹{stats.revenue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Revenue</div>
          </GlassCard>
        </div>

        {/* Filters */}
        <GlassCard className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={"Search consultations by client name or topics..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 form-input"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 form-input">
                <SelectValue placeholder={"Filter by status"} />
              </SelectTrigger>
              <SelectContent className="glass-card">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 form-input">
                <SelectValue placeholder={"Filter by type"} />
              </SelectTrigger>
              <SelectContent className="glass-card">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Video Call</SelectItem>
                <SelectItem value="audio">Audio Call</SelectItem>
                <SelectItem value="chat">Chat Session</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="home-service">Home Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </GlassCard>

        {/* Consultations Table */}
        <GlassCard className="p-6">
          {filteredConsultations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Consultations Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search criteria" : "No consultations scheduled yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/20">
                    <TableHead className="text-foreground">Client & Session</TableHead>
                    <TableHead className="text-foreground">Type & Topics</TableHead>
                    <TableHead className="text-foreground">Schedule</TableHead>
                    <TableHead className="text-foreground">Duration & Price</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsultations.map((consultation: any, index: number) => {
                    const IconComponent = getTypeIcon(consultation.type);
                    return (
                      <TableRow key={consultation.id} className="border-primary/10">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-primary font-semibold">
                                {consultation.clientName?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                {consultation.clientName || 'Unknown Client'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {consultation.plan}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <IconComponent className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium text-foreground capitalize">
                                {consultation.type.replace('-', ' ')}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {consultation.topics?.slice(0, 2).map((topic: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                              {consultation.topics?.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{consultation.topics.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm text-foreground">
                                {new Date(consultation.scheduledAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {new Date(consultation.scheduledAt).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm text-foreground">
                              {consultation.duration} minutes
                            </div>
                            <div className="text-sm font-semibold text-primary">
                              ₹{consultation.price}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge className={getStatusColor(consultation.status)}>
                            {consultation.status}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="glass"
                                  onClick={() => setSelectedConsultation(consultation)}
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="glass-card max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-primary">Consultation Details</DialogTitle>
                                </DialogHeader>
                                {selectedConsultation && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Client</label>
                                        <p className="text-foreground">{selectedConsultation.clientName}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Type</label>
                                        <p className="text-foreground capitalize">{selectedConsultation.type}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Date & Time</label>
                                        <p className="text-foreground">
                                          {new Date(selectedConsultation.scheduledAt).toLocaleString()}
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                                        <Badge className={getStatusColor(selectedConsultation.status)}>
                                          {selectedConsultation.status}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Topics</label>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {selectedConsultation.topics?.map((topic: string, i: number) => (
                                          <Badge key={i} variant="outline">{topic}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                    {selectedConsultation.notes && (
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Notes</label>
                                        <p className="text-foreground mt-1">{selectedConsultation.notes}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            {consultation.status === "scheduled" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="glass text-green-500"
                                  onClick={() => updateConsultationMutation.mutate({
                                    id: consultation.id,
                                    status: "ongoing"
                                  })}
                                >
                                  <PlayCircle className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="glass text-red-500"
                                  onClick={() => updateConsultationMutation.mutate({
                                    id: consultation.id,
                                    status: "cancelled"
                                  })}
                                >
                                  <XCircle className="w-3 h-3" />
                                </Button>
                              </>
                            )}

                            {consultation.status === "ongoing" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="glass text-purple-500"
                                onClick={() => updateConsultationMutation.mutate({
                                  id: consultation.id,
                                  status: "completed"
                                })}
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}