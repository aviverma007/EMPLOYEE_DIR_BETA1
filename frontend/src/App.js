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
import LoadingScreen from "./components/LoadingScreen";
import EmployeeDirectory from "./components/EmployeeDirectory";
import Header from "./components/Header";
import { Toaster } from "./components/ui/sonner";
import { ChevronDown } from "lucide-react";
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
      initializeAuth();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showLoading) {
    return <LoadingScreen />;
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
                  <div className="flex justify-start mb-4 overflow-x-auto">
                    <TabsList className="flex w-auto h-10 shadow-md border rounded-lg p-1 min-w-max bg-white border-blue-200">
                      <TabsTrigger 
                        value="home" 
                        className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-blue-700"
                      >
                        Home
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
                        value="dashboard" 
                        className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-blue-700"
                      >
                        Dashboard
                      </TabsTrigger>
                      
                      <TabsTrigger 
                        value="admin-dashboard" 
                        className="text-xs sm:text-sm font-medium rounded-md px-2 sm:px-4 py-2 whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=inactive]:text-blue-700"
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
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg">
                          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                          <p className="text-blue-100">Manage application settings and content</p>
                        </div>
                        <Tabs defaultValue="banner" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="banner">Banner Management</TabsTrigger>
                            <TabsTrigger value="employee">Employee Management</TabsTrigger>
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