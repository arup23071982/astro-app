import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Eye, ThumbsUp, ArrowLeft } from "lucide-react";
import type { Faq } from "@shared/schema";


export default function AdminFAQs() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  // Get all FAQs
  const { data: faqs = [], isLoading } = useQuery<Faq[]>({
    queryKey: ["/api/faqs"],
  });

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  // Create FAQ mutation
  const createFaqMutation = useMutation({
    mutationFn: async (faqData: any) => {
      return apiRequest("POST", "/api/faqs", faqData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      setIsCreateDialogOpen(false);
      toast({ title: "FAQ created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create FAQ", variant: "destructive" });
    },
  });

  // Update FAQ mutation
  const updateFaqMutation = useMutation({
    mutationFn: async ({ id, ...faqData }: any) => {
      return apiRequest("PUT", `/api/faqs/${id}`, faqData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      setIsEditDialogOpen(false);
      setEditingFaq(null);
      toast({ title: "FAQ updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update FAQ", variant: "destructive" });
    },
  });

  // Delete FAQ mutation
  const deleteFaqMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/faqs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      toast({ title: "FAQ deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete FAQ", variant: "destructive" });
    },
  });

  const handleCreateFaq = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const keywords = formData.get("keywords") as string;
    
    const faqData = {
      question: formData.get("question"),
      answer: formData.get("answer"),
      category: formData.get("category"),
      keywords: keywords ? keywords.split(",").map(k => k.trim()) : [],
      priority: parseInt(formData.get("priority") as string) || 5,
      isActive: true,
    };

    createFaqMutation.mutate(faqData);
  };

  const handleUpdateFaq = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingFaq) return;

    const formData = new FormData(event.currentTarget);
    const keywords = formData.get("keywords") as string;
    
    const faqData = {
      id: editingFaq.id,
      question: formData.get("question"),
      answer: formData.get("answer"),
      category: formData.get("category"),
      keywords: keywords ? keywords.split(",").map(k => k.trim()) : [],
      priority: parseInt(formData.get("priority") as string) || 5,
      isActive: formData.get("isActive") === "true",
    };

    updateFaqMutation.mutate(faqData);
  };

  const handleEdit = (faq: Faq) => {
    setEditingFaq(faq);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      deleteFaqMutation.mutate(id);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      consultation: "bg-blue-500/20 text-blue-400",
      courses: "bg-green-500/20 text-green-400",
      products: "bg-purple-500/20 text-purple-400",
      billing: "bg-yellow-500/20 text-yellow-400",
      technical: "bg-red-500/20 text-red-400",
      general: "bg-gray-500/20 text-gray-400",
    };
    return colors[category as keyof typeof colors] || "bg-gray-500/20 text-gray-400";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded w-1/4"></div>
            <div className="h-64 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => window.location.href = "/admin"}
              className="glass flex items-center space-x-2"
              data-testid="back-to-admin"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div>
              <h1 className="text-4xl font-bold neon-text text-primary mb-2">
                FAQ Management
              </h1>
              <p className="text-muted-foreground">Manage frequently asked questions and AI responses</p>
            </div>
          </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-pink-500/25"
              data-testid="button-create-faq"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New FAQ</DialogTitle>
              <DialogDescription>
                Add a new frequently asked question to help users get instant answers.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateFaq} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Question</label>
                <Input 
                  name="question" 
                  placeholder="Enter the question..."
                  required 
                  data-testid="input-question"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Answer</label>
                <Textarea 
                  name="answer" 
                  placeholder="Enter the detailed answer..."
                  rows={4}
                  required 
                  data-testid="textarea-answer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select name="category" defaultValue="general">
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder={"Select category"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="courses">Courses</SelectItem>
                      <SelectItem value="products">Products</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <Input 
                    name="priority" 
                    type="number" 
                    defaultValue={5}
                    min={1}
                    max={10}
                    data-testid="input-priority"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
                <Input 
                  name="keywords" 
                  placeholder="booking, appointment, schedule"
                  data-testid="input-keywords"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createFaqMutation.isPending}
                  data-testid="button-submit"
                >
                  {createFaqMutation.isPending ? "Creating..." : "Create FAQ"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total FAQs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{faqs.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active FAQs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {faqs.filter(faq => faq.isActive).length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{categories.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {faqs.reduce((sum, faq) => sum + (faq.viewCount || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-filter-category">
                <SelectValue placeholder={"Filter by category"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Table */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFaqs.map((faq) => (
                <TableRow key={faq.id} className="border-white/10">
                  <TableCell className="max-w-md">
                    <div>
                      <div className="font-medium text-white truncate">{faq.question}</div>
                      <div className="text-sm text-gray-400 truncate mt-1">
                        {faq.answer.substring(0, 100)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(faq.category)}>
                      {faq.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-white font-medium">{faq.priority}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {faq.viewCount}
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {faq.helpfulCount}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={faq.isActive ? "default" : "secondary"}>
                      {faq.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(faq)}
                        data-testid={`button-edit-${faq.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(faq.id)}
                        className="text-red-400 hover:text-red-300"
                        data-testid={`button-delete-${faq.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              {searchTerm || selectedCategory !== "all" 
                ? "No FAQs match your filters" 
                : "No FAQs found. Create your first FAQ to get started."
              }
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
            <DialogDescription>
              Update the FAQ details.
            </DialogDescription>
          </DialogHeader>

          {editingFaq && (
            <form onSubmit={handleUpdateFaq} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Question</label>
                <Input 
                  name="question" 
                  defaultValue={editingFaq.question}
                  required 
                  data-testid="input-edit-question"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Answer</label>
                <Textarea 
                  name="answer" 
                  defaultValue={editingFaq.answer}
                  rows={4}
                  required 
                  data-testid="textarea-edit-answer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select name="category" defaultValue={editingFaq.category}>
                    <SelectTrigger data-testid="select-edit-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="courses">Courses</SelectItem>
                      <SelectItem value="products">Products</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <Input 
                    name="priority" 
                    type="number" 
                    defaultValue={editingFaq.priority || 5}
                    min={1}
                    max={10}
                    data-testid="input-edit-priority"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
                <Input 
                  name="keywords" 
                  defaultValue={editingFaq.keywords?.join(", ") || ""}
                  data-testid="input-edit-keywords"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select name="isActive" defaultValue={editingFaq.isActive?.toString() || "true"}>
                  <SelectTrigger data-testid="select-edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingFaq(null);
                  }}
                  data-testid="button-edit-cancel"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateFaqMutation.isPending}
                  data-testid="button-edit-submit"
                >
                  {updateFaqMutation.isPending ? "Updating..." : "Update FAQ"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}