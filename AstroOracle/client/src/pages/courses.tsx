import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Plus, Users, Calendar, Edit, Trash2, Eye, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";


export default function AdminCourses() {
  const [, setLocation] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: "",
    maxStudents: "100",
    level: "beginner",
    teachingLanguage: "en",
    modules: [],
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for testing (bypass authentication)
  const user = { isAdmin: true };
  const courses = [
    { id: "1", title: "Vedic Astrology Basics", description: "Learn fundamental concepts of Vedic astrology", price: 4999, level: "beginner", enrolledStudents: 45, maxStudents: 100 },
    { id: "2", title: "Advanced Birth Chart Analysis", description: "Master advanced chart reading techniques", price: 7999, level: "advanced", enrolledStudents: 23, maxStudents: 50 }
  ];
  const isLoading = false;

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: any) => {
      return apiRequest("POST", "/api/courses", courseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      setIsCreateDialogOpen(false);
      setNewCourse({
        title: "",
        description: "",
        price: "",
        maxStudents: "100",
        level: "beginner",
        teachingLanguage: "en",
        modules: [],
      });
      toast({
        title: "Course Created",
        description: "New course has been created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create course",
        variant: "destructive",
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

  const handleCreateCourse = () => {
    if (!newCourse.title || !newCourse.description || !newCourse.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createCourseMutation.mutate({
      ...newCourse,
      price: parseFloat(newCourse.price),
      maxStudents: parseInt(newCourse.maxStudents),
    });
  };

  const levelColors = {
    beginner: "bg-green-500/20 text-green-500",
    intermediate: "bg-yellow-500/20 text-yellow-500",
    expert: "bg-red-500/20 text-red-500",
  };

  return (
    <div className="min-h-screen pt-16 pb-16" data-testid="admin-courses">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/admin")}
              className="glass flex items-center space-x-2"
              data-testid="back-to-admin"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div>
              <h1 className="text-4xl font-bold neon-text text-primary mb-2">
                Course Management
              </h1>
              <p className="text-muted-foreground">
                Create and manage your astrology courses
              </p>
            </div>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="neon-button mt-4 sm:mt-0" data-testid="create-course-button">
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-primary">Create New Course</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Course Title *
                  </label>
                  <Input
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    placeholder="e.g., Astrology Fundamentals"
                    className="form-input"
                    data-testid="course-title-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description *
                  </label>
                  <Textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    placeholder={"Describe what students will learn..."}
                    className="form-input min-h-[100px]"
                    data-testid="course-description-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Price (₹) *
                    </label>
                    <Input
                      type="number"
                      value={newCourse.price}
                      onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                      placeholder="15999"
                      className="form-input"
                      data-testid="course-price-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Max Students
                    </label>
                    <Input
                      type="number"
                      value={newCourse.maxStudents}
                      onChange={(e) => setNewCourse({ ...newCourse, maxStudents: e.target.value })}
                      placeholder="100"
                      className="form-input"
                      data-testid="course-max-students-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Level
                    </label>
                    <Select
                      value={newCourse.level}
                      onValueChange={(value) => setNewCourse({ ...newCourse, level: value })}
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Teaching Language
                    </label>
                    <Select
                      value={newCourse.teachingLanguage}
                      onValueChange={(value) => setNewCourse({ ...newCourse, teachingLanguage: value })}
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="bn">Bengali</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="glass"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCourse}
                    disabled={createCourseMutation.isPending}
                    className="neon-button"
                    data-testid="submit-course-button"
                  >
                    {createCourseMutation.isPending ? "Creating..." : "Create Course"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Course Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">
              {courses?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Total Courses</div>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-2xl font-bold text-secondary mb-2">
              {courses?.filter((c: any) => c.isActive).length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Active Courses</div>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-2xl font-bold text-accent mb-2">
              {courses?.reduce((total: number, course: any) => total + (course.currentStudents || 0), 0) || 0}
            </div>
            <div className="text-sm text-muted-foreground">Total Students</div>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-2">
              ₹{courses?.reduce((total: number, course: any) => total + (parseFloat(course.price) * (course.currentStudents || 0)), 0).toLocaleString() || 0}
            </div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </GlassCard>
        </div>

        {/* Courses Table */}
        <GlassCard className="p-6">
          {!courses || courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Courses Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first astrology course to start teaching students
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="neon-button">
                <Plus className="w-4 h-4 mr-2" />
                Create First Course
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/20">
                    <TableHead className="text-foreground">Course</TableHead>
                    <TableHead className="text-foreground">Level</TableHead>
                    <TableHead className="text-foreground">Students</TableHead>
                    <TableHead className="text-foreground">Price</TableHead>
                    <TableHead className="text-foreground">Language</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course: any, index: number) => (
                    <TableRow key={course.id} className="border-primary/10" data-testid={`course-row-${index}`}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-foreground" data-testid={`course-title-${index}`}>
                            {course.title}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {course.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={levelColors[course.level as keyof typeof levelColors]}>
                          {course.level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {course.currentStudents}/{course.maxStudents}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-primary">
                          ₹{parseFloat(course.price).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground uppercase">
                          {course.teachingLanguage}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={course.isActive ? "default" : "secondary"}>
                          {course.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="glass">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="glass">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="glass text-red-400">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
