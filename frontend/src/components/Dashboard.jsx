import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  FileText,
  ExternalLink,
  Monitor,
  Maximize2,
  Minimize2
} from 'lucide-react';

const Dashboard = () => {
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);

  const dashboards = [
    {
      id: 'po-dashboard',
      title: 'PO Dashboard',
      description: 'Purchase Order Analytics and Tracking',
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      url: 'https://app.powerbi.com/reportEmbed?reportId=8eff9893-39e5-44ff-8393-eed2716e5c86&autoAuth=true&ctid=711f4066-07b7-45a1-9e32-978e86528cad',
      color: 'from-blue-500 to-blue-700',
      category: 'Finance'
    },
    {
      id: 'qms-dashboard',
      title: 'QMS Dashboard',
      description: 'Quality Management System Analytics',
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      url: 'https://app.powerbi.com/reportEmbed?reportId=ff391e55-8a76-42c8-b62c-1c209a6c2663&autoAuth=true&ctid=711f4066-07b7-45a1-9e32-978e86528cad',
      color: 'from-green-500 to-green-700',
      category: 'Quality'
    },
    {
      id: 'assets-dashboard',
      title: 'Assets Dashboard',
      description: 'Asset Management and Tracking',
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      url: 'https://app.powerbi.com/reportEmbed?reportId=95bc0742-cbfd-46a6-81da-e05ee4b628e8&autoAuth=true&ctid=711f4066-07b7-45a1-9e32-978e86528cad',
      color: 'from-purple-500 to-purple-700',
      category: 'Assets'
    },
    {
      id: 'attendance-dashboard',
      title: 'Employee Attendance',
      description: 'Employee Attendance Analytics',
      icon: <Users className="h-8 w-8 text-orange-600" />,
      url: 'https://app.powerbi.com/reportEmbed?reportId=4be8796e-c0a4-4712-879c-9cd9a183e365&autoAuth=true&ctid=711f4066-07b7-45a1-9e32-978e86528cad',
      color: 'from-orange-500 to-orange-700',
      category: 'HR'
    },
    {
      id: 'pr-dashboard',
      title: 'PR Dashboard',
      description: 'Purchase Request Analytics',
      icon: <Calendar className="h-8 w-8 text-indigo-600" />,
      url: 'https://app.powerbi.com/reportEmbed?reportId=b9bb2eaa-6315-4235-a051-d41d2219a899&autoAuth=true&ctid=711f4066-07b7-45a1-9e32-978e86528cad',
      color: 'from-indigo-500 to-indigo-700',
      category: 'Finance'
    }
  ];

  const categories = [...new Set(dashboards.map(d => d.category))];

  const handleDashboardClick = (dashboard) => {
    setSelectedDashboard(dashboard);
  };

  const handleBackToDashboards = () => {
    setSelectedDashboard(null);
    setFullScreen(false);
  };

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  if (selectedDashboard) {
    return (
      <div className={`${fullScreen ? 'fixed inset-0 z-50 bg-white' : 'h-full'} flex flex-col`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 bg-gradient-to-r ${selectedDashboard.color} text-white ${fullScreen ? 'shadow-lg' : 'rounded-t-lg'}`}>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDashboards}
              className="text-white hover:bg-white/20"
            >
              ← Back to Dashboards
            </Button>
            <div className="flex items-center gap-2">
              {selectedDashboard.icon}
              <h2 className="text-xl font-bold">{selectedDashboard.title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-gray-700">
              {selectedDashboard.category}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullScreen}
              className="text-white hover:bg-white/20"
              title={fullScreen ? "Exit Full Screen" : "Full Screen"}
            >
              {fullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(selectedDashboard.url, '_blank')}
              className="text-white hover:bg-white/20"
              title="Open in New Tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard Embed */}
        <div className={`flex-1 ${fullScreen ? '' : 'p-4'}`}>
          <iframe
            src={selectedDashboard.url}
            className="w-full h-full border-0 rounded-lg shadow-lg"
            title={selectedDashboard.title}
            allowFullScreen
          />
        </div>
      </div>
    );
  }
    {
      id: 5,
      title: "System Settings",
      description: "Configure system preferences",
      icon: <Settings className="h-8 w-8" />,
      url: "#", // Placeholder - user will provide later
      color: "bg-gray-600 hover:bg-gray-700",
      textColor: "text-white"
    }
  ]);

  const handleButtonClick = (button) => {
    if (button.url && button.url !== "#") {
      window.open(button.url, '_blank', 'noopener,noreferrer');
    } else {
      // Placeholder behavior - user will add links later
      console.log(`Button ${button.title} clicked - URL to be configured`);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 p-6">
      {/* Dashboard Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </div>
        <p className="text-gray-600">Quick access to essential tools and services</p>
      </div>

      {/* Dashboard Buttons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {buttons.map((button) => (
          <Card key={button.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6">
              <button
                onClick={() => handleButtonClick(button)}
                className={`w-full h-full flex flex-col items-center space-y-4 p-4 rounded-lg transition-all duration-200 ${button.color} ${button.textColor} group-hover:scale-105`}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  {button.icon}
                </div>
                
                {/* Title and Description */}
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">{button.title}</h3>
                  <p className="text-sm opacity-90 leading-tight">{button.description}</p>
                </div>
                
                {/* External link indicator */}
                <div className="flex items-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-xs">Quick Access</span>
                </div>
              </button>
            </CardContent>
          </Card>
        ))}
      </div>


    </div>
  );
};

export default Dashboard;