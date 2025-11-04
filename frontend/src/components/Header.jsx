import React, { useState } from "react";
import { RefreshCw, Shield, User, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { utilityAPI } from "../services/api";
import { toast } from "sonner";
import AlertsNotification from "./AlertsNotification";

const Header = () => {
  const { user, isAdmin } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    console.log("Refresh button clicked. Admin status:", isAdmin());
    
    if (!isAdmin()) {
      console.log("Not an admin, showing error");
      toast.error("Only administrators can refresh data");
      return;
    }
    
    try {
      console.log("Starting Excel refresh...");
      setIsRefreshing(true);
      const result = await utilityAPI.refreshExcel();
      console.log("Refresh result:", result);
      
      toast.success(`Excel data refreshed successfully! Updated ${result.count} employees.`, {
        description: `Last updated: ${new Date().toLocaleString()}`
      });
      
      // Trigger a page reload to refresh all data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error("Error refreshing data:", error);
      console.error("Error details:", error.response?.data, error.message);
      toast.error(`Failed to refresh Excel data: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <header className={`bg-white dark:bg-[#404040] shadow-lg border-b border-blue-200 dark:border-gray-600 ${isAdmin() ? 'border-b-2' : ''}`}>
      <div className={`w-full ${isAdmin() ? 'px-6 py-4' : 'px-4 py-2'}`}>
        <div className="flex justify-between items-center">
          {/* Left side - Logo and System Name */}
          <div className={`flex items-center ${isAdmin() ? 'space-x-4' : 'space-x-3'}`}>
            <div 
              className={`flex items-center ${isAdmin() ? 'space-x-4' : 'space-x-3'} cursor-pointer hover:opacity-80 transition-opacity`}
              onClick={() => window.location.reload()}
            >
              <img 
                src="/images/header-logo.png"
                alt="Company Logo"
                className={`object-contain rounded-lg ${isAdmin() ? 'h-24 w-24 shadow-md' : 'h-12 w-12 shadow-sm'}`}
              />
              <div>
                <p className={`font-semibold text-blue-600 dark:text-blue-400 ${isAdmin() ? 'text-2xl' : 'text-lg'}`}>
                  SMARTDESK
                </p>
              </div>
            </div>
          </div>
          
          {/* Right side - Beta Badge, Profile, Refresh */}
          <div className={`flex items-center ${isAdmin() ? 'space-x-3' : 'space-x-2'}`}>
            {/* Beta Version Badge */}
            <Badge 
              variant="outline" 
              className="bg-orange-100 text-orange-700 border-orange-300 text-xs px-2 py-1"
            >
              Beta v1.0
            </Badge>
            
            {/* User Info */}
            <div className={`flex items-center ${isAdmin() ? 'space-x-3' : 'space-x-2'}`}>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-900 dark:text-gray-200">{user?.name}</p>
                <div className={`flex items-center justify-end ${isAdmin() ? 'space-x-2' : 'space-x-1'}`}>
                  <p className="text-xs text-blue-600 dark:text-blue-400">ID: {user?.employeeId}</p>
                  <Badge 
                    variant={isAdmin() ? "default" : "secondary"} 
                    className={`text-xs ${isAdmin() ? "bg-blue-600" : "bg-blue-100 text-blue-700"}`}
                  >
                    {isAdmin() ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                    {isAdmin() ? "Admin" : "Employee"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex items-center ${isAdmin() ? 'space-x-2' : 'space-x-1'}`}>
              {!isAdmin() && <AlertsNotification />}
              
              {isAdmin() && (
                <Button 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  size="sm"
                  variant="outline"
                  className="flex items-center space-x-1 hover:bg-blue-50 dark:hover:bg-gray-700 border-blue-200 dark:border-gray-600"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              )}
              
              {/* Dark Mode Toggle Slider */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  className={`
                    relative inline-flex items-center h-6 rounded-full w-11 
                    transition-colors duration-300 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-offset-2 
                    ${isDarkMode 
                      ? 'bg-gray-400 focus:ring-gray-400' 
                      : 'bg-blue-500 focus:ring-blue-400'
                    }
                  `}
                  role="switch"
                  aria-checked={isDarkMode}
                >
                  <span className="sr-only">Toggle dark mode</span>
                  <span
                    className={`
                      inline-block w-4 h-4 transform rounded-full
                      bg-white shadow-lg transition-transform duration-300 ease-in-out
                      flex items-center justify-center
                      ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  >
                    {isDarkMode ? (
                      <Moon className="h-3 w-3 text-gray-700" />
                    ) : (
                      <Sun className="h-3 w-3 text-yellow-500" />
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
