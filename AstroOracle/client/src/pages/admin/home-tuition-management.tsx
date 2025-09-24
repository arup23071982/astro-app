import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap,
  Users,
  UserCheck,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Clock,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  BookOpen,
  Home,
  TrendingUp,
  DollarSign,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";


export default function AdminHomeTuitionManagement() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState("applications");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user is admin
  const { data: user } = useQuery({
    queryKey: ["/api/profile"],
    enabled: !!localStorage.getItem("token"),
  });

  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/admin/home-tuition-applications"],
    enabled: !!localStorage.getItem("token") && user?.isAdmin,
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/admin/home-tuition-courses"],
    enabled: !!localStorage.getItem("token") && user?.isAdmin,
  });

  const { data: students } = useQuery({
    queryKey: ["/api/admin/home-tuition-students"],
    enabled: !!localStorage.getItem("token") && user?.isAdmin,
  });

  const { data: conversations } = useQuery({
    queryKey: ["/api/admin/student-conversations"],
    enabled: !!localStorage.getItem("token") && user?.isAdmin,
  });

  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PUT", `/api/home-tuition/applications/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/home-tuition-applications"] });
      toast({
        title: "Updated",
        description: "Application status updated successfully",
      });
    },
  });

  if (!user?.isAdmin) {
    setLocation("/");
    return null;
  }

  if (applicationsLoading || coursesLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-500";
      case "approved": return "bg-green-500/20 text-green-500";
      case "rejected": return "bg-red-500/20 text-red-500";
      case "interview_scheduled": return "bg-blue-500/20 text-blue-500";
      case "payment_pending": return "bg-orange-500/20 text-orange-500";
      case "enrolled": return "bg-purple-500/20 text-purple-500";
      default: return "bg-gray-500/20 text-gray-500";
    }
  };

  const filteredApplications = applications?.filter((app: any) => {
    const matchesSearch = app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.courseName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesType = typeFilter === "all" || app.tuitionType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  const stats = {
    totalApplications: applications?.length || 0,
    pendingApplications: applications?.filter((a: any) => a.status === "pending").length || 0,
    approvedApplications: applications?.filter((a: any) => a.status === "approved").length || 0,
    totalStudents: students?.length || 0,
    activeCourses: courses?.filter((c: any) => c.isActive).length || 0,
    totalRevenue: applications?.filter((a: any) => a.status === "enrolled")
      .reduce((sum: number, a: any) => sum + parseFloat(a.coursePrice || 0), 0) || 0
  };

  return (
    <div className="min-h-screen pt-16 pb-16" data-testid="admin-home-tuition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold neon-text text-primary mb-2">
            Home Tuition Management
          </h1>
          <p className="text-muted-foreground">
            Manage home tuition courses, applications, and student communications
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-primary mb-1">{stats.totalApplications}</div>
            <div className="text-sm text-muted-foreground">Applications</div>
          </GlassCard>
          
          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.pendingApplications}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">{stats.approvedApplications}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400 mb-1">{stats.totalStudents}</div>
            <div className="text-sm text-muted-foreground">Students</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-orange-400 mb-1">{stats.activeCourses}</div>
            <div className="text-sm text-muted-foreground">Active Courses</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-pink-400" />
            </div>
            <div className="text-2xl font-bold text-pink-400 mb-1">₹{stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Revenue</div>
          </GlassCard>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="glass-card">
            <TabsTrigger value="applications" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Applications</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Courses</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Students</span>
            </TabsTrigger>
            <TabsTrigger value="communications" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Communications</span>
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            {/* Filters */}
            <GlassCard className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder={"Search applications by student name or course..."}
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                    <SelectItem value="enrolled">Enrolled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-48 form-input">
                    <SelectValue placeholder={"Filter by type"} />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="one-to-one">One-to-One</SelectItem>
                    <SelectItem value="group">Group Learning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </GlassCard>

            {/* Applications Table */}
            <GlassCard className="p-6">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Applications Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Try adjusting your search criteria" : "No applications submitted yet"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-primary/20">
                        <TableHead className="text-foreground">Student Info</TableHead>
                        <TableHead className="text-foreground">Course & Type</TableHead>
                        <TableHead className="text-foreground">Contact & Address</TableHead>
                        <TableHead className="text-foreground">Birth Details</TableHead>
                        <TableHead className="text-foreground">Status</TableHead>
                        <TableHead className="text-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((application: any, index: number) => (
                        <TableRow key={application.id} className="border-primary/10">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-primary font-semibold">
                                  {application.studentName?.charAt(0) || 'S'}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">
                                  {application.studentName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Applied: {new Date(application.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium text-foreground">{application.courseName}</p>
                              <Badge variant="outline" className="text-xs">
                                {application.tuitionType === "one-to-one" ? "One-to-One" : "Group Learning"}
                              </Badge>
                              <p className="text-sm text-muted-foreground">
                                ₹{application.coursePrice}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1 text-sm">
                                <Phone className="w-3 h-3 text-muted-foreground" />
                                <span className="text-muted-foreground">{application.phoneNumber}</span>
                              </div>
                              {application.email && (
                                <div className="flex items-center space-x-1 text-sm">
                                  <Mail className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-muted-foreground">{application.email}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1 text-sm">
                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                <span className="text-muted-foreground line-clamp-1">
                                  {application.tuitionAddress}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div className="text-muted-foreground">
                                DOB: {application.dateOfBirth ? new Date(application.dateOfBirth).toLocaleDateString() : 'N/A'}
                              </div>
                              <div className="text-muted-foreground">
                                Time: {application.timeOfBirth || 'N/A'}
                              </div>
                              <div className="text-muted-foreground">
                                Place: {application.placeOfBirth || 'N/A'}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge className={getStatusColor(application.status)}>
                              {application.status.replace('_', ' ')}
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
                                    onClick={() => setSelectedApplication(application)}
                                  >
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="glass-card max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="text-primary">Application Details</DialogTitle>
                                  </DialogHeader>
                                  {selectedApplication && (
                                    <div className="space-y-6">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-sm font-medium text-muted-foreground">Student Name</label>
                                          <p className="text-foreground">{selectedApplication.studentName}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-muted-foreground">Course</label>
                                          <p className="text-foreground">{selectedApplication.courseName}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-muted-foreground">Type</label>
                                          <p className="text-foreground">{selectedApplication.tuitionType}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-muted-foreground">Price</label>
                                          <p className="text-foreground">₹{selectedApplication.coursePrice}</p>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Address</label>
                                        <p className="text-foreground">{selectedApplication.tuitionAddress}</p>
                                      </div>

                                      {selectedApplication.notes && (
                                        <div>
                                          <label className="text-sm font-medium text-muted-foreground">Notes</label>
                                          <p className="text-foreground">{selectedApplication.notes}</p>
                                        </div>
                                      )}

                                      <div className="flex space-x-4 pt-4">
                                        {selectedApplication.status === "pending" && (
                                          <>
                                            <Button
                                              className="neon-button"
                                              onClick={() => updateApplicationMutation.mutate({
                                                id: selectedApplication.id,
                                                status: "approved"
                                              })}
                                            >
                                              <CheckCircle className="w-4 h-4 mr-2" />
                                              Approve
                                            </Button>
                                            <Button
                                              variant="outline"
                                              className="glass text-red-500"
                                              onClick={() => updateApplicationMutation.mutate({
                                                id: selectedApplication.id,
                                                status: "rejected"
                                              })}
                                            >
                                              <XCircle className="w-4 h-4 mr-2" />
                                              Reject
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>

                              {application.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="glass text-green-500"
                                    onClick={() => updateApplicationMutation.mutate({
                                      id: application.id,
                                      status: "approved"
                                    })}
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="glass text-red-500"
                                    onClick={() => updateApplicationMutation.mutate({
                                      id: application.id,
                                      status: "rejected"
                                    })}
                                  >
                                    <XCircle className="w-3 h-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </GlassCard>
          </TabsContent>

          {/* Other tabs content would go here */}
          <TabsContent value="courses">
            <GlassCard className="p-6">
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Course Management</h3>
                <p className="text-muted-foreground">Manage home tuition courses and pricing</p>
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="students">
            <GlassCard className="p-6">
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Student Management</h3>
                <p className="text-muted-foreground">View and manage enrolled students</p>
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="communications">
            <GlassCard className="p-6">
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Student Communications</h3>
                <p className="text-muted-foreground">Monitor and manage student private messaging</p>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}