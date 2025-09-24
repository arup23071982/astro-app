import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Users, 
  User, 
  Clock, 
  MapPin, 
  Star,
  Calendar,
  IndianRupee,
  ChevronRight,
  GraduationCap,
  Home
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";


interface HomeTuitionCourse {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  oneToOnePrice: string;
  groupLearningPrice: string;
  maxGroupSize: number;
  duration: string;
  level: string;
  curriculum: Array<{
    module: string;
    topics: string[];
    duration: string;
  }>;
  prerequisites: string;
  availableSeats: number;
  occupiedSeats: number;
  isActive: boolean;
  applicationDeadline: string | null;
  courseStartDate: string | null;
  courseEndDate: string | null;
  coverageArea: string;
  specialInstructions: string | null;
}

export default function HomeTuition() {
  const [selectedTab, setSelectedTab] = useState("courses");

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["/api/home-tuition/courses"],
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Cosmic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        
        <div className="relative z-10 pt-24 px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-96 bg-gray-300 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Cosmic Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      <div className="absolute inset-0">
        {/* Animated stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 pt-24 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">
                "Home Tuition"
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Personalized astrology learning at your home with{" "}
              <span className="text-yellow-400 font-semibold">Astrologer Arup Shastri</span>. 
              Choose between one-to-one sessions or group learning for a comprehensive understanding of Vedic astrology.
            </p>
          </motion.div>

          {/* Features Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            {[
              { icon: Home, title: "At Your Home", desc: "Comfortable learning environment" },
              { icon: User, title: "One-to-One", desc: "Personalized attention" },
              { icon: Users, title: "Group Learning", desc: "Learn with peers" },
              { icon: GraduationCap, title: "Expert Guidance", desc: "18+ years experience" },
            ].map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-300">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Course Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/10 backdrop-blur-md">
              <TabsTrigger value="courses" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                <BookOpen className="w-4 h-4 mr-2" />
                "Available Courses"
              </TabsTrigger>
              <TabsTrigger value="how-it-works" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                <Clock className="w-4 h-4 mr-2" />
                "How It Works"
              </TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {(courses as HomeTuitionCourse[]).map((course: HomeTuitionCourse, index: number) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 h-full">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-4">
                          <Badge className={getLevelColor(course.level)}>
                            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                          </Badge>
                          <div className="text-right">
                            <p className="text-sm text-gray-300">Available Seats</p>
                            <p className="font-bold text-yellow-400">
                              {course.availableSeats - course.occupiedSeats}
                            </p>
                          </div>
                        </div>
                        <CardTitle className="text-xl text-white mb-2">
                          {course.title}
                        </CardTitle>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {course.shortDescription}
                        </p>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        {/* Course Details */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-gray-300">{course.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-gray-300">{course.coverageArea}</span>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-blue-400" />
                              <span className="text-sm text-gray-300">One-to-One</span>
                            </div>
                            <div className="flex items-center space-x-1 text-yellow-400 font-bold">
                              <IndianRupee className="h-4 w-4" />
                              <span>{Number(course.oneToOnePrice).toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-green-400" />
                              <span className="text-sm text-gray-300">
                                Group ({course.maxGroupSize} max)
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-yellow-400 font-bold">
                              <IndianRupee className="h-4 w-4" />
                              <span>{Number(course.groupLearningPrice).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Prerequisites */}
                        <div className="bg-blue-500/20 p-3 rounded-lg">
                          <h4 className="text-sm font-semibold text-blue-300 mb-1">Prerequisites</h4>
                          <p className="text-xs text-gray-300">{course.prerequisites}</p>
                        </div>

                        {/* Application Buttons */}
                        <div className="space-y-3">
                          <Link href={`/home-tuition/apply/one-to-one/${course.id}`}>
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                              <User className="w-4 h-4 mr-2" />
                              Apply for One-to-One
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                          
                          <Link href={`/home-tuition/apply/group/${course.id}`}>
                            <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
                              <Users className="w-4 h-4 mr-2" />
                              Apply for Group Learning
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>

                        {/* Deadlines */}
                        {course.applicationDeadline && (
                          <div className="flex items-center space-x-2 text-orange-400 bg-orange-500/20 p-2 rounded">
                            <Calendar className="h-4 w-4" />
                            <span className="text-xs">
                              Application Deadline: {new Date(course.applicationDeadline).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="how-it-works" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {[
                  {
                    step: "1",
                    title: "Apply Online",
                    description: "Submit your application with personal details and upload your Aadhar card for verification."
                  },
                  {
                    step: "2", 
                    title: "Interview Process",
                    description: "Selected candidates will be interviewed to assess their dedication and learning goals."
                  },
                  {
                    step: "3",
                    title: "Course Selection",
                    description: "Upon selection, choose between one-to-one or group learning format based on your preference."
                  },
                  {
                    step: "4",
                    title: "Home Sessions",
                    description: "Begin your astrology journey with personalized sessions conducted at your home."
                  }
                ].map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 h-full">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-yellow-500 text-black rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                          {step.step}
                        </div>
                        <h3 className="font-semibold text-white mb-3">{step.title}</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">{step.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
              >
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-2" />
                      Why Choose Home Tuition?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="space-y-2 text-gray-300">
                      <li>• Comfortable learning in your own environment</li>
                      <li>• Flexible scheduling based on your availability</li>
                      <li>• Personalized attention and customized teaching</li>
                      <li>• Direct interaction with experienced astrologer</li>
                      <li>• Practical hands-on learning approach</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <MapPin className="w-5 h-5 text-yellow-400 mr-2" />
                      Service Coverage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-gray-300">
                      <p className="mb-2"><strong>Primary Area:</strong> Within 25km of Kolkata city center</p>
                      <p className="mb-2"><strong>Special Arrangements:</strong> Extended coverage for group learning (4+ students)</p>
                      <p className="text-sm text-yellow-400">
                        Contact us for specific location availability
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}