import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  Bot, 
  User, 
  Headphones,
  TrendingUp,
  Clock,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle,
  Eye,
  Search,
  Calendar,
  BarChart3,
  Activity,
  Users,
  MessageSquare,
  Star,
  Zap,
  HelpCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";


export default function AdminSupportChat() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState("chats");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user is admin
  const { data: user } = useQuery({
    queryKey: ["/api/profile"],
    enabled: !!localStorage.getItem("token"),
  });

  const { data: supportChats, isLoading } = useQuery({
    queryKey: ["/api/admin/support-chats"],
    enabled: !!localStorage.getItem("token") && user?.isAdmin,
  });

  const { data: chatAnalytics } = useQuery({
    queryKey: ["/api/admin/chat-analytics"],
    enabled: !!localStorage.getItem("token") && user?.isAdmin,
  });

  const { data: messages } = useQuery({
    queryKey: ["/api/admin/chat-messages", selectedChat?.id],
    enabled: !!selectedChat?.id,
  });

  const escalateToHumanMutation = useMutation({
    mutationFn: async (chatId: string) => {
      return apiRequest("POST", `/api/support-chat/${chatId}/escalate`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/support-chats"] });
      toast({
        title: "Escalated",
        description: "Chat has been escalated to human support",
      });
    },
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

  const filteredChats = supportChats?.filter((chat: any) => 
    chat.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.sessionId?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = {
    totalChats: supportChats?.length || 0,
    activeChats: supportChats?.filter((c: any) => c.isActive).length || 0,
    humanSupportNeeded: supportChats?.filter((c: any) => c.needsHumanSupport).length || 0,
    avgResponseTime: chatAnalytics?.avgResponseTime || 0,
    satisfactionRate: chatAnalytics?.satisfactionRate || 0,
    resolutionRate: chatAnalytics?.resolutionRate || 0
  };

  return (
    <div className="min-h-screen pt-16 pb-16" data-testid="admin-support-chat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold neon-text text-primary mb-2">
            "AI Support Chat Management"
          </h1>
          <p className="text-muted-foreground">
            "Monitor AI chatbot performance and manage customer support interactions"
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-primary mb-1">{stats.totalChats}</div>
            <div className="text-sm text-muted-foreground">Total Chats</div>
          </GlassCard>
          
          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">{stats.activeChats}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Headphones className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400 mb-1">{stats.humanSupportNeeded}</div>
            <div className="text-sm text-muted-foreground">Need Human</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.avgResponseTime}s</div>
            <div className="text-sm text-muted-foreground">Avg Response</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400 mb-1">{stats.satisfactionRate}%</div>
            <div className="text-sm text-muted-foreground">Satisfaction</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-pink-400" />
            </div>
            <div className="text-2xl font-bold text-pink-400 mb-1">{stats.resolutionRate}%</div>
            <div className="text-sm text-muted-foreground">Resolution</div>
          </GlassCard>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="glass-card">
            <TabsTrigger value="chats" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Chat Sessions</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="escalations" className="flex items-center space-x-2">
              <Headphones className="w-4 h-4" />
              <span>Human Support</span>
            </TabsTrigger>
          </TabsList>

          {/* Chat Sessions Tab */}
          <TabsContent value="chats" className="space-y-6">
            {/* Search */}
            <GlassCard className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={"Search chats by user name, email, or session ID..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 form-input"
                />
              </div>
            </GlassCard>

            {/* Chat Sessions Table */}
            <GlassCard className="p-6">
              {filteredChats.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Chat Sessions Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Try adjusting your search criteria" : "No chat sessions have been initiated yet"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-primary/20">
                        <TableHead className="text-foreground">User Info</TableHead>
                        <TableHead className="text-foreground">Session Details</TableHead>
                        <TableHead className="text-foreground">Activity</TableHead>
                        <TableHead className="text-foreground">Status</TableHead>
                        <TableHead className="text-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredChats.map((chat: any, index: number) => (
                        <TableRow key={chat.id} className="border-primary/10">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">
                                  {chat.userName || 'Anonymous User'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {chat.userEmail || chat.sessionId}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm text-foreground">
                                Session: {chat.sessionId.slice(-8)}...
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Started: {new Date(chat.createdAt).toLocaleString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Messages: {chat.messageCount || 0}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm text-foreground">
                                Last: {chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleTimeString() : 'N/A'}
                              </p>
                              <div className="flex items-center space-x-2">
                                {chat.avgResponseTime && (
                                  <Badge variant="outline" className="text-xs">
                                    {chat.avgResponseTime}s avg
                                  </Badge>
                                )}
                                {chat.satisfaction && (
                                  <div className="flex items-center space-x-1">
                                    {chat.satisfaction === 'positive' ? (
                                      <ThumbsUp className="w-3 h-3 text-green-500" />
                                    ) : (
                                      <ThumbsDown className="w-3 h-3 text-red-500" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-2">
                              <Badge variant={chat.isActive ? "default" : "secondary"}>
                                {chat.isActive ? "Active" : "Inactive"}
                              </Badge>
                              {chat.needsHumanSupport && (
                                <Badge variant="destructive" className="block">
                                  Needs Human Support
                                </Badge>
                              )}
                              {chat.isResolved && (
                                <Badge variant="outline" className="block">
                                  Resolved
                                </Badge>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="glass"
                                    onClick={() => setSelectedChat(chat)}
                                  >
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="glass-card max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="text-primary">Chat Session Details</DialogTitle>
                                  </DialogHeader>
                                  {selectedChat && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-sm font-medium text-muted-foreground">User</label>
                                          <p className="text-foreground">{selectedChat.userName || 'Anonymous'}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium text-muted-foreground">Session ID</label>
                                          <p className="text-foreground font-mono text-sm">{selectedChat.sessionId}</p>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Messages</label>
                                        <div className="space-y-2 max-h-60 overflow-y-auto border border-primary/20 rounded-lg p-4">
                                          {messages?.map((msg: any, i: number) => (
                                            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                              <div className={`max-w-xs px-3 py-2 rounded-lg ${
                                                msg.sender === 'user' 
                                                  ? 'bg-primary/20 text-foreground' 
                                                  : 'bg-secondary/20 text-foreground'
                                              }`}>
                                                <div className="flex items-center space-x-2 mb-1">
                                                  {msg.sender === 'user' ? (
                                                    <User className="w-3 h-3" />
                                                  ) : (
                                                    <Bot className="w-3 h-3" />
                                                  )}
                                                  <span className="text-xs font-medium">
                                                    {msg.sender === 'user' ? 'User' : 'AI Assistant'}
                                                  </span>
                                                </div>
                                                <p className="text-sm">{msg.message}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                  {new Date(msg.createdAt).toLocaleTimeString()}
                                                </p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>

                              {chat.needsHumanSupport && !chat.isEscalated && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="glass text-red-500"
                                  onClick={() => escalateToHumanMutation.mutate(chat.id)}
                                >
                                  <Headphones className="w-3 h-3" />
                                </Button>
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

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <GlassCard className="p-6">
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Chat Analytics</h3>
                <p className="text-muted-foreground">AI performance metrics and insights</p>
              </div>
            </GlassCard>
          </TabsContent>

          {/* Human Support Tab */}
          <TabsContent value="escalations">
            <GlassCard className="p-6">
              <div className="text-center py-12">
                <Headphones className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Human Support Queue</h3>
                <p className="text-muted-foreground">Escalated chats requiring human intervention</p>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}