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
import { Package, Plus, Edit, Trash2, Eye, Star, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";


export default function AdminProducts() {
  const [, setLocation] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "gemstones",
    price: "",
    currency: "INR",
    stock: "10",
    specifications: {},
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for testing (bypass authentication)
  const user = { isAdmin: true };
  const products = [
    { id: "1", name: "Blue Sapphire", description: "Powerful gemstone for Saturn benefits", category: "gemstones", price: 15000, stock: 5, rating: 4.8, isActive: true },
    { id: "2", name: "Rudraksha Mala", description: "108 bead authentic rudraksha mala", category: "malas", price: 2500, stock: 12, rating: 4.9, isActive: true }
  ];
  const isLoading = false;

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      return apiRequest("POST", "/api/products", productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsCreateDialogOpen(false);
      setNewProduct({
        name: "",
        description: "",
        category: "gemstones",
        price: "",
        currency: "INR",
        stock: "10",
        specifications: {},
      });
      toast({
        title: "Product Created",
        description: "New product has been added successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
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

  const handleCreateProduct = () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createProductMutation.mutate({
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
    });
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "gemstones", label: "Gemstones" },
    { value: "yantras", label: "Yantras" },
    { value: "malas", label: "Malas" },
    { value: "books", label: "Books" },
    { value: "kits", label: "Remedy Kits" },
  ];

  const categoryColors = {
    gemstones: "bg-purple-500/20 text-purple-500",
    yantras: "bg-yellow-500/20 text-yellow-500",
    malas: "bg-green-500/20 text-green-500",
    books: "bg-blue-500/20 text-blue-500",
    kits: "bg-red-500/20 text-red-500",
    jewelry: "bg-pink-500/20 text-pink-500",
  };

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products?.filter((product: any) => product.category === selectedCategory);

  return (
    <div className="min-h-screen pt-16 pb-16" data-testid="admin-products">
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
                Product Management
              </h1>
              <p className="text-muted-foreground">
                Manage your astrological products and remedies
              </p>
            </div>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="neon-button mt-4 sm:mt-0" data-testid="create-product-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-primary">Add New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Product Name *
                  </label>
                  <Input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g., Ruby Gemstone"
                    className="form-input"
                    data-testid="product-name-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description *
                  </label>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder={"Describe the product and its benefits..."}
                    className="form-input min-h-[100px]"
                    data-testid="product-description-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Category *
                    </label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        <SelectItem value="gemstones">Gemstones</SelectItem>
                        <SelectItem value="yantras">Yantras</SelectItem>
                        <SelectItem value="malas">Malas</SelectItem>
                        <SelectItem value="books">Books</SelectItem>
                        <SelectItem value="kits">Remedy Kits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Stock Quantity
                    </label>
                    <Input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      placeholder="10"
                      className="form-input"
                      data-testid="product-stock-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Price *
                    </label>
                    <Input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="2500"
                      className="form-input"
                      data-testid="product-price-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Currency
                    </label>
                    <Select
                      value={newProduct.currency}
                      onValueChange={(value) => setNewProduct({ ...newProduct, currency: value })}
                    >
                      <SelectTrigger className="form-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
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
                    onClick={handleCreateProduct}
                    disabled={createProductMutation.isPending}
                    className="neon-button"
                    data-testid="submit-product-button"
                  >
                    {createProductMutation.isPending ? "Adding..." : "Add Product"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category Filter */}
        <GlassCard className="p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={selectedCategory === category.value ? "neon-button" : "glass"}
                data-testid={`category-${category.value}`}
              >
                {category.label}
                {category.value !== "all" && (
                  <span className="ml-2 px-2 py-1 text-xs rounded-full bg-primary/20">
                    {products?.filter((p: any) => p.category === category.value).length || 0}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </GlassCard>

        {/* Product Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-2">
              {products?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Total Products</div>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-2xl font-bold text-secondary mb-2">
              {products?.filter((p: any) => p.isActive).length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Active Products</div>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-2xl font-bold text-secondary mb-2">
              {products?.reduce((total: number, product: any) => total + (product.stock || 0), 0) || 0}
            </div>
            <div className="text-sm text-muted-foreground">Total Stock</div>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-2">
              {new Set(products?.map((p: any) => p.category)).size || 0}
            </div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </GlassCard>
        </div>

        {/* Products Table */}
        <GlassCard className="p-6">
          {!filteredProducts || filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {selectedCategory === "all" ? "No Products Yet" : `No ${selectedCategory} Products`}
              </h3>
              <p className="text-muted-foreground mb-6">
                Add your first astrological product to start selling
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="neon-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/20">
                    <TableHead className="text-foreground">Product</TableHead>
                    <TableHead className="text-foreground">Category</TableHead>
                    <TableHead className="text-foreground">Price</TableHead>
                    <TableHead className="text-foreground">Stock</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product: any, index: number) => (
                    <TableRow key={product.id} className="border-primary/10" data-testid={`product-row-${index}`}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <Package className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground" data-testid={`product-name-${index}`}>
                              {product.name}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={categoryColors[product.category as keyof typeof categoryColors]}>
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-primary">
                          {product.currency === "INR" ? "₹" : "$"}{parseFloat(product.price).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${product.stock > 5 ? 'text-green-500' : product.stock > 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {product.stock} units
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant={product.isActive ? "default" : "secondary"}>
                            {product.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {!product.isActive && (
                            <span className="text-xs text-muted-foreground italic">
                              (Not available for purchase)
                            </span>
                          )}
                        </div>
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
