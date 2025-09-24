import React, { useState, useEffect, useCallback } from "react";
import { CivicIssue } from "@/entities/CivicIssue";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Search, 
  Calendar,
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye
} from "lucide-react";
import { format } from "date-fns";

export default function MyReports() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadUserAndReports();
  }, []);

  const filterIssues = useCallback(() => {
    let filtered = issues;

    if (searchTerm) {
      filtered = filtered.filter(issue => 
        issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    setFilteredIssues(filtered);
  }, [issues, searchTerm, statusFilter]);

  useEffect(() => {
    filterIssues();
  }, [filterIssues]);

  const loadUserAndReports = async () => {
    setLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      const userIssues = await CivicIssue.filter({ created_by: userData.email }, '-created_date', 50);
      setIssues(userIssues);
    } catch (error) {
      console.error("Error loading reports:", error);
    }
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    const icons = {
      reported: <Clock className="w-4 h-4 text-blue-500" />,
      acknowledged: <Eye className="w-4 h-4 text-yellow-500" />,
      in_progress: <AlertCircle className="w-4 h-4 text-orange-500" />,
      resolved: <CheckCircle2 className="w-4 h-4 text-green-500" />,
      rejected: <AlertCircle className="w-4 h-4 text-red-500" />
    };
    return icons[status] || <Clock className="w-4 h-4 text-gray-500" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      reported: "bg-blue-100 text-blue-800 border-blue-200",
      acknowledged: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      in_progress: "bg-orange-100 text-orange-800 border-orange-200",
      resolved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200"
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getCategoryLabel = (category) => {
    const labels = {
      pothole: "Pothole",
      streetlight: "Street Light",
      garbage: "Garbage/Waste",
      drainage: "Drainage",
      traffic_signal: "Traffic Signal",
      water_supply: "Water Supply",
      park_maintenance: "Park Maintenance",
      road_maintenance: "Road Maintenance",
      other: "Other"
    };
    return labels[category] || category;
  };

  const getStats = () => {
    const total = issues.length;
    const resolved = issues.filter(i => i.status === 'resolved').length;
    const pending = issues.filter(i => i.status === 'reported' || i.status === 'acknowledged').length;
    const inProgress = issues.filter(i => i.status === 'in_progress').length;
    
    return { total, resolved, pending, inProgress };
  };

  const stats = getStats();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Sign In Required</h2>
            <p className="text-slate-600 mb-4">Please sign in to view your reports.</p>
            <Button onClick={() => User.login()} className="bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Reports</h1>
          <p className="text-slate-600">Track the status of issues you've reported</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-900 mb-1">{stats.total}</div>
              <div className="text-sm text-slate-600">Total Reports</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">{stats.pending}</div>
              <div className="text-sm text-slate-600">Pending</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{stats.inProgress}</div>
              <div className="text-sm text-slate-600">In Progress</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.resolved}</div>
              <div className="text-sm text-slate-600">Resolved</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search your reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-slate-600">Loading your reports...</p>
          </div>
        ) : filteredIssues.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {issues.length === 0 ? "No Reports Yet" : "No Reports Found"}
            </h3>
            <p className="text-slate-600">
              {issues.length === 0 
                ? "You haven't submitted any reports yet. Start by reporting an issue in your community!"
                : "Try adjusting your search or filter criteria."
              }
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue) => (
              <Card key={issue.id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Issue Photos */}
                    {issue.photos && issue.photos.length > 0 && (
                      <div className="w-full md:w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={issue.photos[0]} 
                          alt={issue.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Issue Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">
                            {issue.title}
                          </h3>
                          <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                            {issue.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(issue.status)}
                          <Badge className={${getStatusColor(issue.status)} border}>
                            {issue.status?.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <Badge variant="outline" className="bg-slate-50">
                          {getCategoryLabel(issue.category)}
                        </Badge>
                        
                        {issue.upvotes > 0 && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            <Star className="w-3 h-3 mr-1" />
                            {issue.upvotes} votes
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(issue.created_date), 'MMM d, yyyy')}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate max-w-48">
                            {issue.location?.address || 'Location not specified'}
                          </span>
                        </div>
                        
                        {issue.assigned_department && (
                          <div className="text-blue-600 font-medium">
                            Assigned to: {issue.assigned_department.replace('_', ' ')}
                          </div>
                        )}
                      </div>
                      
                      {issue.resolution_notes && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm font-medium text-slate-700 mb-1">Resolution Notes:</p>
                          <p className="text-sm text-slate-600">{issue.resolution_notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
