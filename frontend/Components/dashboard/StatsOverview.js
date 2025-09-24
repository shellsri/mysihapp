import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Users,
  MapPin
} from "lucide-react";

export default function StatsOverview({ issues }) {
  const getStats = () => {
    const total = issues.length;
    const reported = issues.filter(i => i.status === 'reported').length;
    const inProgress = issues.filter(i => i.status === 'in_progress').length;
    const resolved = issues.filter(i => i.status === 'resolved').length;
    const totalUpvotes = issues.reduce((sum, issue) => sum + (issue.upvotes || 0), 0);
    
    return { total, reported, inProgress, resolved, totalUpvotes };
  };

  const stats = getStats();

  const statCards = [
    {
      title: "Total Reports",
      value: stats.total,
      icon: MapPin,
      bgColor: "bg-blue-500",
      description: "Community submissions"
    },
    {
      title: "Pending Action", 
      value: stats.reported,
      icon: AlertTriangle,
      bgColor: "bg-yellow-500",
      description: "Awaiting response"
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      bgColor: "bg-orange-500", 
      description: "Being addressed"
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: CheckCircle2,
      bgColor: "bg-green-500",
      description: "Successfully completed"
    },
    {
      title: "Community Votes",
      value: stats.totalUpvotes,
      icon: TrendingUp,
      bgColor: "bg-purple-500",
      description: "Citizen engagement"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <Card key={index} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.description}</p>
              </div>
              <div className={p-3 rounded-xl ${stat.bgColor} bg-opacity-10}>
                <stat.icon className={w-5 h-5 ${stat.bgColor.replace('bg-', 'text-')}} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
