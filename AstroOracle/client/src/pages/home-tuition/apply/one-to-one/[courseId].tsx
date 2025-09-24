import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploader } from "@/components/FileUploader";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  IndianRupee, 
  Clock, 
  MapPin, 
  FileText,
  Phone,
  Mail,
  Calendar,
  Home,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const applicationSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters"),
  studentPhone: z.string().min(10, "Valid phone number required"),
  studentEmail: z.string().email("Valid email required").optional().or(z.literal("")),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  timeOfBirth: z.string().min(1, "Time of birth is required"),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  address: z.string().min(10, "Complete address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Valid pincode required"),
  preferredTimings: z.string().min(1, "Preferred timings are required"),
  additionalNotes: z.string().optional(),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export default function OneToOneApplication() {
  const [, params] = useRoute("/home-tuition/apply/one-to-one/:courseId");
  const courseId = params?.courseId;
  const [aadharCardUrl, setAadharCardUrl] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      studentName: "",
      studentPhone: "",
      studentEmail: "",
      dateOfBirth: "",
      timeOfBirth: "",
      placeOfBirth: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      preferredTimings: "",
      additionalNotes: "",
    },
  });

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: [`/api/home-tuition/courses/${courseId}`],
    enabled: !!courseId,
  });

  const applicationMutation = useMutation({
    mutationFn: async (data: ApplicationForm) => {
      if (!aadharCardUrl) {
        throw new Error("Aadhar card upload is required");
      }

      const applicationData = {
        applicantId: "current-user-id", // This should come from auth context
        applicationType: "one_to_one",
        courseId: courseId!,
        studentDetails: [
          {
            name: data.studentName,
            phone: data.studentPhone,
            email: data.studentEmail || null,
            dateOfBirth: data.dateOfBirth,
            timeOfBirth: data.timeOfBirth,
            placeOfBirth: data.placeOfBirth,
          }
        ],
        aadharCardUrls: [aadharCardUrl],
        birthDetails: [
          {
            dateOfBirth: data.dateOfBirth,
            timeOfBirth: data.timeOfBirth,
            placeOfBirth: data.placeOfBirth,
          }
        ],
        tuitionAddress: {
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
        },
        preferredTimings: data.preferredTimings,
        additionalNotes: data.additionalNotes,
      };

      return apiRequest("POST", "/api/home-tuition/applications", applicationData);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted Successfully",
        description: "We will review your application and contact you within 2-3 business days.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/home-tuition/applications"] });
      // Redirect to a success page or applications list
      window.location.href = "/home-tuition/applications";
    },
    onError: (error: Error) => {
      toast({
        title: "Application Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ApplicationForm) => {
    applicationMutation.mutate(data);
  };

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        <div className="relative z-10 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-300 rounded w-64"></div>
              <div className="h-96 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        <div className="relative z-10 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Course Not Found</h1>
          <Link href="/home-tuition">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />

      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link href="/home-tuition">
              <Button variant="outline" className="mb-4 border-white/20 text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">
                One-to-One Application
              </span>
            </h1>
            <p className="text-gray-300 mb-6">
              Apply for personalized astrology learning at your home
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20 sticky top-6">
                <CardHeader>
                  <CardTitle className="text-white">{course.title}</CardTitle>
                  <Badge className="w-fit bg-blue-100 text-blue-800">
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-gray-300">One-to-One Session</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-300">₹{Number(course.oneToOnePrice).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-300">{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-gray-300">{course.coverageArea}</span>
                    </div>
                  </div>

                  <div className="bg-yellow-500/20 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-yellow-300 mb-1">Prerequisites</h4>
                    <p className="text-xs text-gray-300">{course.prerequisites}</p>
                  </div>

                  {course.specialInstructions && (
                    <div className="bg-blue-500/20 p-3 rounded-lg">
                      <h4 className="text-sm font-semibold text-blue-300 mb-1">Special Instructions</h4>
                      <p className="text-xs text-gray-300">{course.specialInstructions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Application Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Application Form
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Personal Information
                        </h3>
                        
                        <FormField
                          control={form.control}
                          name="studentName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Full Name</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="bg-white/10 border-white/20 text-white"
                                  placeholder="Enter your full name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="studentPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">
                                  <Phone className="w-4 h-4 inline mr-1" />
                                  Phone Number
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    className="bg-white/10 border-white/20 text-white"
                                    placeholder="10-digit phone number"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="studentEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">
                                  <Mail className="w-4 h-4 inline mr-1" />
                                  Email (Optional)
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="email"
                                    className="bg-white/10 border-white/20 text-white"
                                    placeholder="your.email@example.com"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Birth Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Birth Details (For Astrological Analysis)
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Date of Birth</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="date"
                                    className="bg-white/10 border-white/20 text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="timeOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Time of Birth</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="time"
                                    className="bg-white/10 border-white/20 text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="placeOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Place of Birth</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="bg-white/10 border-white/20 text-white"
                                  placeholder="City, State, Country"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Address */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <Home className="w-4 h-4 mr-2" />
                          Tuition Address
                        </h3>
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Complete Address</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  className="bg-white/10 border-white/20 text-white"
                                  placeholder="House/Flat number, Street, Locality"
                                  rows={3}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">City</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    className="bg-white/10 border-white/20 text-white"
                                    placeholder="Kolkata"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">State</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    className="bg-white/10 border-white/20 text-white"
                                    placeholder="West Bengal"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="pincode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Pincode</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    className="bg-white/10 border-white/20 text-white"
                                    placeholder="700001"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Aadhar Card Upload */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">
                          Aadhar Card Verification
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Please upload a clear image/PDF of your Aadhar card for identity verification
                        </p>
                        <FileUploader
                          onFileUpload={setAadharCardUrl}
                          accept="image/*,.pdf"
                          maxFileSize={5 * 1024 * 1024}
                          fileType="aadhar"
                          placeholder="Upload Aadhar Card"
                          className="w-full"
                        />
                      </div>

                      {/* Preferences */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Preferences</h3>
                        
                        <FormField
                          control={form.control}
                          name="preferredTimings"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Preferred Timings</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  className="bg-white/10 border-white/20 text-white"
                                  placeholder="e.g., Weekends 10 AM - 12 PM, Weekdays 6 PM - 8 PM"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="additionalNotes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Additional Notes (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  className="bg-white/10 border-white/20 text-white"
                                  placeholder="Any specific requirements or questions..."
                                  rows={3}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="pt-6">
                        <Button
                          type="submit"
                          disabled={applicationMutation.isPending || !aadharCardUrl}
                          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3"
                        >
                          {applicationMutation.isPending ? "Submitting Application..." : "Submit Application"}
                        </Button>
                        
                        {!aadharCardUrl && (
                          <p className="text-sm text-red-400 mt-2 text-center">
                            Please upload your Aadhar card to continue
                          </p>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}