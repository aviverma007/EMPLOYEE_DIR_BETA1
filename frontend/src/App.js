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
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import LoginForm from "./components/LoginForm";
import EmployeeDirectory from "./components/EmployeeDirectory";
import Header from "./components/Header";
import { Toaster } from "./components/ui/sonner";
import { ChevronDown } from "lucide-react";
import { Button } from "./components/ui/button";
import HierarchyBuilder from "./components/HierarchyBuilder";

// Import required components for complete feature set
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

// Admin-only components
import BannerManagement from "./components/admin/BannerManagement";
import AlertsManagement from "./components/admin/AlertsManagement";
import EmployeeManagement from "./components/admin/EmployeeManagement";

const AppContent = () => {
  const { isAuthenticated, initializeAuth, isAdmin, isUser } = useAuth();
  const [activeTab, setActiveTab] = useState(isAdmin() ? "banner-management" : "home");

  useEffect(() => {
    initializeAuth();
  }, []);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="App min-h-screen bg-blue-50">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <div className="w-full min-h-screen flex flex-col">
              <Header />
              <div className="flex-1 w-full px-2 sm:px-4 lg:px-6 py-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
                  {/* Navigation Tabs - Role-based access */}
                  <div className={`flex justify-start mb-4 overflow-x-auto ${isAdmin() ? 'bg-gradient-to-r from-blue-50 to-blue-100 p-2 rounded-lg' : ''}`}>
                  <TabsList className={`flex w-auto h-10 shadow-md border rounded-lg p-1 min-w-max ${
                    isAdmin() 
                      ? 'bg-white border-blue-300' 
                      : 'bg-white border-blue-200'
                  }`}>
                      {/* Admin gets only 3 tabs */}
                      {isAdmin() && (
                        <>
                          <TabsTrigger 
                            value="banner-management" 
                            className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=inactive]:text-blue-700 data-[state=inactive]:hover:bg-blue-50"
                          >
                            Banner Management
                          </TabsTrigger>
                          
                          <TabsTrigger 
                            value="alerts-management" 
                            className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=inactive]:text-blue-700 data-[state=inactive]:hover:bg-blue-50"
                          >
                            Alerts Management
                          </TabsTrigger>
                          
                          <TabsTrigger 
                            value="employee-management" 
                            className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=inactive]:text-blue-700 data-[state=inactive]:hover:bg-blue-50"
                          >
                            Employee Management
                          </TabsTrigger>
                        </>
                      )}
                      
                      {/* User gets all original tabs */}
                      {isUser() && (
                        <>
                          <TabsTrigger 
                            value="home" 
                            className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-blue-700"
                          >
                            Home
                          </TabsTrigger>
                          
                          <TabsTrigger 
                            value="dashboard" 
                            className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-blue-700"
                          >
                            Dashboard
                          </TabsTrigger>
                          
                          <TabsTrigger 
                            value="directory" 
                            className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-blue-700"
                          >
                            Employee Directory
                          </TabsTrigger>
                          
                          <TabsTrigger 
                            value="policies" 
                            className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-blue-700"
                          >
                            Policies
                          </TabsTrigger>
                          
                          <TabsTrigger 
                            value="meeting-rooms" 
                            className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-blue-700"
                          >
                            Meeting Rooms
                          </TabsTrigger>
                          
                          <TabsTrigger 
                            value="holiday-calendar" 
                            className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-blue-700"
                          >
                            Holiday Calendar
                          </TabsTrigger>
                          
                          <TabsTrigger 
                            value="help" 
                            className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-blue-700"
                          >
                            Help
                          </TabsTrigger>
                        </>
                      )}
                    </TabsList>
                  </div>
                  
                  <div className="flex-1 overflow-auto">
                    {/* Admin-only 3 management tabs */}
                    {isAdmin() && (
                      <>
                        <TabsContent value="banner-management" className="mt-0 h-full">
                          <BannerManagement />
                        </TabsContent>
                        
                        <TabsContent value="alerts-management" className="mt-0 h-full">
                          <AlertsManagement />
                        </TabsContent>
                        
                        <TabsContent value="employee-management" className="mt-0 h-full">
                          <EmployeeManagement />
                        </TabsContent>
                      </>
                    )}
                    
                    {/* User tabs - all original functionality */}
                    {isUser() && (
                      <>
                        <TabsContent value="home" className="mt-0 h-full">
                          <Home />
                        </TabsContent>
                        
                        <TabsContent value="dashboard" className="mt-0 h-full">
                          <Dashboard />
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
                        
                        <TabsContent value="help" className="mt-0 h-full">
                          <Help />
                        </TabsContent>
                      </>
                    )}
                  </div>
                </Tabs>
                
                {/* User Alerts - Show for both User and Admin roles */}
                <UserAlerts />
              </div>
              <Toaster />
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;