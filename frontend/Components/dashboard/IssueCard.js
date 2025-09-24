import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Calendar,
  ChevronUp,
  Eye,
  User,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";

export default function IssueCard({ issue, onUpvote, getCategoryLabel, getStatusColor }) {
  const getPriorityIcon = (priority) => {
    if (priority === 'critical' || priority === 'high') {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  return (
    <Card className="shadow-sm border-slate-200 hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Issue Photos */}
          {issue.photos && issue.photos.length > 0 && (
            <div className="w-full md:w-32 h-32 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
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
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900 truncate">
                    {issue.title}
                  </h3>
                  {getPriorityIcon(issue.priority)}
                </div>
                
                <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                  {issue.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className={${getStatusColor(issue.status)} border}>
                    {issue.status?.replace('_', ' ')}
                  </Badge>
                  
                  <Badge variant="outline" className="bg-slate-50">
                    {getCategoryLabel(issue.category)}
                  </Badge>
                  
                  {issue.priority !== 'medium' && (
                    <Badge variant="outline" className={
                      issue.priority === 'critical' ? 'bg-red-50 text-red-700 border-red-200' :
                      issue.priority === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }>
                      {issue.priority} priority
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate max-w-48">
                      {issue.location?.address || 'Location not specified'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(issue.created_date), 'MMM d, yyyy')}</span>
                  </div>
                  
                  {!issue.is_anonymous && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{issue.created_by}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex md:flex-col items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpvote(issue.id)}
              className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
            >
              <ChevronUp className="w-4 h-4" />
              <span className="font-semibold">{issue.upvotes || 0}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="text-slate-500">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
