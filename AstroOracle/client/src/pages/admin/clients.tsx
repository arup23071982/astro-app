import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus, Mail, Phone, Calendar, MapPin, ArrowLeft } from "lucide-react";


export default function AdminClients() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for testing (bypass authentication)
  const user = { isAdmin: true };
  const users = [
    { id: "1", fullName: "Ravi Kumar", email: "ravi@email.com", phoneNumber: "+91-9876543210", createdAt: "2024-01-15T10:00:00Z", isAdmin: false, consultationsCount: 5, totalSpent: 12500 },
    { id: "2", fullName: "Priya Sharma", email: "priya@email.com", phoneNumber: "+91-9876543211", createdAt: "2024-01-20T11:00:00Z", isAdmin: false, consultationsCount: 3, totalSpent: 7500 }
  ];
  const isLoading = false;

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

  const filteredUsers = users?.filter((user: any) => 
    !user.isAdmin && (
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.includes(searchTerm)
    )
  ) || [];

  return (
    <div className="min-h-screen pt-16 pb-16" data-testid="admin-clients">
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
                Client Management
              </h1>
              <p className="text-muted-foreground">
                Manage your astrology clients and their information
              </p>
            </div>
          </div>
          <Button className="neon-button mt-4 sm:mt-0" data-testid="add-client-button">
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Client
          </Button>
        </div>

        {/* Search and Filters */}
        <GlassCard className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={"Search clients by name, email, or phone..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 form-input"
                data-testid="search-clients"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="glass">
                All Clients ({filteredUsers.length})
              </Button>
              <Button variant="outline" size="sm" className="glass">
                Verified
              </Button>
              <Button variant="outline" size="sm" className="glass">
                Unverified
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Clients Table */}
        <GlassCard className="p-6">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Clients Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search criteria" : "Start by adding your first client"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/20">
                    <TableHead className="text-foreground">Client Info</TableHead>
                    <TableHead className="text-foreground">Contact</TableHead>
                    <TableHead className="text-foreground">Birth Details</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Joined</TableHead>
                    <TableHead className="text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((client: any, index: number) => (
                    <TableRow key={client.id} className="border-primary/10" data-testid={`client-row-${index}`}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {client.fullName?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground" data-testid={`client-name-${index}`}>
                              {client.fullName || 'Unknown'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              @{client.username}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {client.email && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Mail className="w-3 h-3 mr-1" />
                              {client.email}
                            </div>
                          )}
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="w-3 h-3 mr-1" />
                            {client.countryCode} {client.phoneNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {client.dateOfBirth && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(client.dateOfBirth).toLocaleDateString()}
                            </div>
                          )}
                          {client.placeOfBirth && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3 mr-1" />
                              {client.placeOfBirth}
                            </div>
                          )}
                          {client.timeOfBirth && (
                            <div className="text-sm text-muted-foreground">
                              Time: {client.timeOfBirth}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <Badge variant={client.isVerified ? "default" : "secondary"}>
                            {client.isVerified ? "Verified" : "Unverified"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {client.preferredLanguage?.toUpperCase() || 'EN'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(client.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="glass text-xs">
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="glass text-xs">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="glass text-xs">
                            History
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

        {/* Client Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <GlassCard className="p-6 text-center">
            <div className="text-2xl font-bold text-black bg-white/90 px-2 py-1 rounded-md inline-block mb-2">
              {filteredUsers.filter((u: any) => u.isVerified).length}
            </div>
            <div className="text-sm text-muted-foreground">Verified Clients</div>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-2xl font-bold text-black bg-white/90 px-2 py-1 rounded-md inline-block mb-2">
              {filteredUsers.filter((u: any) => u.dateOfBirth).length}
            </div>
            <div className="text-sm text-muted-foreground">Complete Profiles</div>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-2xl font-bold text-black bg-white/90 px-2 py-1 rounded-md inline-block mb-2">
              {filteredUsers.filter((u: any) => 
                new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              ).length}
            </div>
            <div className="text-sm text-muted-foreground">New This Month</div>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-2xl font-bold text-foreground bg-white/90 px-2 py-1 rounded-md inline-block mb-2">
              {new Set(filteredUsers.map((u: any) => u.preferredLanguage)).size}
            </div>
            <div className="text-sm text-muted-foreground">Languages</div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
