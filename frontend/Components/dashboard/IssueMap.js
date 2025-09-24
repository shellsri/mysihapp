import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";

export default function IssueMap({ issues, onIssueSelect }) {
  const getStatusColor = (status) => {
    const colors = {
      reported: "bg-blue-500",
      acknowledged: "bg-yellow-500", 
      in_progress: "bg-orange-500",
      resolved: "bg-green-500",
      rejected: "bg-red-500"
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <Card className="h-96 shadow-sm border-slate-200">
      <CardContent className="p-0 h-full relative">
        {/* Map Placeholder */}
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
              {Array(96).fill(0).map((_, i) => (
                <div key={i} className="border border-slate-400"></div>
              ))}
            </div>
          </div>
          
          {/* Center content */}
          <div className="text-center z-10">
            <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 mx-auto">
              <Navigation className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Interactive Map View</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Map integration shows real locations of all reported issues. 
              Click markers to view details and community votes.
            </p>
            
            {/* Sample markers */}
            <div className="flex justify-center gap-4 mt-6">
              {['reported', 'in_progress', 'resolved'].map((status, index) => (
                <div key={status} className="flex items-center gap-2">
                  <div className={w-3 h-3 rounded-full ${getStatusColor(status)}}></div>
                  <span className="text-sm text-slate-600 capitalize">{status.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Simulated issue markers */}
          {issues.slice(0, 6).map((issue, index) => (
            <div
              key={issue.id}
              className={absolute w-4 h-4 rounded-full ${getStatusColor(issue.status)} cursor-pointer hover:scale-150 transition-transform shadow-lg}
              style={{
                left: ${20 + (index * 12)}%,
                top: ${30 + (index % 3) * 20}%
              }}
              onClick={() => onIssueSelect(issue.id)}
            />
          ))}
        </div>
        
        {/* Map controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <div className="bg-white rounded-lg shadow-sm p-2 flex flex-col gap-1">
            <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center cursor-pointer hover:bg-slate-200">
              <span className="text-lg font-bold">+</span>
            </div>
            <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center cursor-pointer hover:bg-slate-200">
              <span className="text-lg font-bold">-</span>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-sm p-3">
          <p className="text-xs font-semibold text-slate-700 mb-2">Issue Status</p>
          <div className="space-y-1">
            {[
              { status: 'reported', label: 'New', color: getStatusColor('reported') },
              { status: 'in_progress', label: 'In Progress', color: getStatusColor('in_progress') },
              { status: 'resolved', label: 'Resolved', color: getStatusColor('resolved') }
            ].map(item => (
              <div key={item.status} className="flex items-center gap-2">
                <div className={w-2 h-2 rounded-full ${item.color}}></div>
                <span className="text-xs text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
