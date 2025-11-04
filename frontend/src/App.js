import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "./components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import LoadingScreen from "./components/LoadingScreen";
import EmployeeDirectory from "./components/EmployeeDirectory";
import Header from "./components/Header";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { ChevronDown, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "./components/ui/button";
import HierarchyBuilder from "./components/HierarchyBuilder";
import Chatbot from "./components/Chatbot";

import Home from "./components/Home";
import Help from "./components/Help";
import Work from "./components/Work";
import Knowledge from "./components/Knowledge";
import Policies from "./components/Policies";
import Workflows from "./components/Workflows";
import Attendance from "./components/Attendance";
import MeetingRooms from "./components/MeetingRooms";
import HolidayCalendar from "./components/HolidayCalendar";
import AlertManagement from "./components/AlertManagement";
import UserAlerts from "./components/UserAlerts";
import Dashboard from "./components/Dashboard";

import BannerManagement from "./components/admin/BannerManagement";
import EmployeeManagement from "./components/admin/EmployeeManagement";

const AppContent = () => {
  const { isAuthenticated, initializeAuth, isAdmin, isUser } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [showLoading, setShowLoading] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminDashboardUnlocked, setIsAdminDashboardUnlocked] = useState(false);

  const ADMIN_PASSWORD = 'Sm@rtworld';

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
      initializeAuth();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (value) => {
    if (value === 'admin-dashboard' && !isAdminDashboardUnlocked) {
      setShowPasswordDialog(true);
    } else {
      setActiveTab(value);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      toast.error('Please enter the password');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === ADMIN_PASSWORD) {
      setShowPasswordDialog(false);
      setIsAdminDashboardUnlocked(true);
      setActiveTab('admin-dashboard');
      toast.success('Admin Dashboard unlocked successfully! 🔓');
    } else {
      toast.error('Incorrect password. Please try again.');
    }
    
    setIsLoading(false);
    setPassword('');
  };

  const handleDialogClose = () => {
    setShowPasswordDialog(false);
    setPassword('');
  };

  if (showLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="App min-h-screen bg-blue-50 dark:bg-black">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <div className="w-full min-h-screen flex flex-col">
              <Header />
              <div className="flex-1 w-full px-2 sm:px-4 lg:px-6 py-4">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full h-full flex flex-col">
                  {/* Navigation Tabs - Role-based access */}
                  <div className="flex justify-start mb-4 overflow-x-auto">
                    <TabsList className="flex w-auto h-10 shadow-md border rounded-lg p-1 min-w-max bg-white dark:bg-[#262626] border-blue-200 dark:border-gray-600">
                      <TabsTrigger 
                        value="home" 
                        className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-blue-700 dark:data-[state=inactive]:text-blue-400"
                      >
                        Home
                      </TabsTrigger>
                      
                      <TabsTrigger 
                        value="directory" 
                        className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-blue-700 dark:data-[state=inactive]:text-blue-400"
                      >
                        Employee Directory
                      </TabsTrigger>
                      
                      <TabsTrigger 
                        value="policies" 
                        className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-blue-700 dark:data-[state=inactive]:text-blue-400"
                      >
                        Policies
                      </TabsTrigger>
                      
                      <TabsTrigger 
                        value="meeting-rooms" 
                        className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-blue-700 dark:data-[state=inactive]:text-blue-400"
                      >
                        Meeting Rooms
                      </TabsTrigger>
                      
                      <TabsTrigger 
                        value="holiday-calendar" 
                        className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-blue-700 dark:data-[state=inactive]:text-blue-400"
                      >
                        Holiday Calendar
                      </TabsTrigger>
                      
                      <TabsTrigger 
                        value="dashboard" 
                        className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-blue-700 dark:data-[state=inactive]:text-blue-400"
                      >
                        Dashboard
                      </TabsTrigger>
                      
                      <TabsTrigger 
                        value="admin-dashboard" 
                        className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=inactive]:text-blue-700 dark:data-[state=inactive]:text-blue-400"
                      >
                        Admin Dashboard
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="flex-1 overflow-auto">
                    <TabsContent value="home" className="mt-0 h-full">
                      <Home />
                    </TabsContent>
                    
                    <TabsContent value="directory" className="mt-0 h-full">
                      <EmployeeDirectory />
                    </TabsContent>
                    
                    <TabsContent value="policies" className="mt-0 h-full">
                      <Policies />
                    </TabsContent>
                    
                    <TabsContent value="meeting-rooms" className="mt-0 h-full">
                      <MeetingRooms />
                    </TabsContent>
                    
                    <TabsContent value="holiday-calendar" className="mt-0 h-full">
                      <HolidayCalendar />
                    </TabsContent>
                    
                    <TabsContent value="dashboard" className="mt-0 h-full">
                      <Dashboard />
                    </TabsContent>
                    
                    <TabsContent value="admin-dashboard" className="mt-0 h-full">
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-4 rounded-lg">
                          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                          <p className="text-blue-100 dark:text-blue-200">Manage application settings and content</p>
                        </div>
                        <Tabs defaultValue="banner" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800">
                            <TabsTrigger value="banner" className="dark:data-[state=inactive]:text-gray-400">Banner Management</TabsTrigger>
                            <TabsTrigger value="employee" className="dark:data-[state=inactive]:text-gray-400">Employee Management</TabsTrigger>
                          </TabsList>
                          <TabsContent value="banner">
                            <BannerManagement />
                          </TabsContent>
                          <TabsContent value="employee">
                            <EmployeeManagement />
                          </TabsContent>
                        </Tabs>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
                
                <Chatbot />
              </div>
              <Toaster />
              
              {/* Admin Dashboard Password Dialog */}
              <Dialog open={showPasswordDialog} onOpenChange={handleDialogClose}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <Lock className="h-5 w-5 text-blue-600" />
                      <span>Admin Dashboard Authentication</span>
                    </DialogTitle>
                    <DialogDescription>
                      Enter the admin password to access the dashboard.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="admin-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handlePasswordSubmit();
                            }
                          }}
                          placeholder="Enter admin password"
                          className="pr-10"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={handleDialogClose}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handlePasswordSubmit}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Verifying...
                          </>
                        ) : (
                          'Unlock'
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;