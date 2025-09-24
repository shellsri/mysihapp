import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { 
  MapPin, 
  Plus, 
  BarChart3, 
  Settings,
  Shield,
  Menu,
  X,
  Home,
  FileText,
  Users
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
    } catch (error) {
      console.log("User not authenticated");
    }
  };

  const citizenNavItems = [
    {
      title: "Issue Map",
      url: createPageUrl("Dashboard"),
      icon: MapPin,
      description: "View all reported issues"
    },
    {
      title: "Report Issue",
      url: createPageUrl("ReportIssue"),
      icon: Plus,
      description: "Report a new civic issue"
    },
    {
      title: "My Reports",
      url: createPageUrl("MyReports"),
      icon: FileText,
      description: "Track your submitted issues"
    }
  ];

  const adminNavItems = [
    {
      title: "Admin Dashboard",
      url: createPageUrl("AdminDashboard"),
      icon: BarChart3,
      description: "Manage all issues"
    },
    {
      title: "Issue Management",
      url: createPageUrl("IssueManagement"),
      icon: Settings,
      description: "Review and assign issues"
    },
    {
      title: "Reports & Analytics",
      url: createPageUrl("Analytics"),
      icon: BarChart3,
      description: "View system analytics"
    }
  ];

  const navItems = isAdmin ? [...citizenNavItems, ...adminNavItems] : citizenNavItems;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <Sidebar className="border-r border-slate-200">
          <SidebarHeader className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">CivicReport</h2>
                <p className="text-xs text-slate-500">Community Issue Tracker</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-3">
                Citizen Tools
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {citizenNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-lg mb-2 ${
                          location.pathname === item.url ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                          <item.icon className="w-5 h-5" />
                          <div>
                            <span className="font-medium">{item.title}</span>
                            <p className="text-xs text-slate-500">{item.description}</p>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {isAdmin && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-3">
                  <div className="flex items-center gap-2">
                    Admin Tools
                    <Badge variant="secondary" className="bg-red-100 text-red-700">Admin</Badge>
                  </div>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminNavItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-red-50 hover:text-red-700 transition-all duration-200 rounded-lg mb-2 ${
                            location.pathname === item.url ? 'bg-red-50 text-red-700 border-l-4 border-red-600' : ''
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                            <item.icon className="w-5 h-5" />
                            <div>
                              <span className="font-medium">{item.title}</span>
                              <p className="text-xs text-slate-500">{item.description}</p>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            <SidebarGroup>
              <SidebarGroupContent>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">Community Impact</span>
                  </div>
                  <p className="text-xs text-blue-700 mb-3">
                    Every report helps build a better city for everyone.
                  </p>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    View Public Map
                  </Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200 p-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm truncate">
                    {user.full_name || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {isAdmin ? 'Administrator' : 'Citizen'}
                  </p>
                </div>
              </div>
            ) : (
              <Button 
                onClick={() => User.login()} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </Button>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-slate-200 px-6 py-4 md:hidden">
            <div className="flex items-center justify-between">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold text-slate-900">CivicReport</h1>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
