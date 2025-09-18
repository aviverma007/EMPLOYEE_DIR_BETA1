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
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      url: 'https://app.powerbi.com/reportEmbed?reportId=live-sandbox&autoAuth=true&ctid=live-sandbox',
      color: 'from-blue-500 to-blue-700'
    },
    {
      id: 'qms-dashboard',
      title: 'QMS Dashboard',
      description: 'Quality Management System Analytics',
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      url: 'https://app.powerbi.com/reportEmbed?reportId=live-sandbox&autoAuth=true&ctid=live-sandbox',
      color: 'from-green-500 to-green-700'
    },
    {
      id: 'assets-dashboard',
      title: 'Assets Dashboard',
      description: 'Asset Management and Tracking',
      icon: <BarChart3 className="h-6 w-6 text-purple-600" />,
      url: 'https://app.powerbi.com/reportEmbed?reportId=live-sandbox&autoAuth=true&ctid=live-sandbox',
      color: 'from-purple-500 to-purple-700'
    },
    {
      id: 'attendance-dashboard',
      title: 'Employee Attendance',
      description: 'Employee Attendance Analytics',
      icon: <Users className="h-6 w-6 text-orange-600" />,
      url: 'https://app.powerbi.com/reportEmbed?reportId=live-sandbox&autoAuth=true&ctid=live-sandbox',
      color: 'from-orange-500 to-orange-700'
    },
    {
      id: 'pr-dashboard',
      title: 'PR Dashboard',  
      description: 'Purchase Request Analytics',
      icon: <Calendar className="h-6 w-6 text-indigo-600" />,
      url: 'https://app.powerbi.com/reportEmbed?reportId=live-sandbox&autoAuth=true&ctid=live-sandbox',
      color: 'from-indigo-500 to-indigo-700'
    }
  ];

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

  return (
    <div className="h-full p-6">
      {/* Simple Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <div className="h-px bg-gray-300 w-full"></div>
      </div>

      {/* All Dashboards in Single Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {dashboards.map(dashboard => (
          <Card 
            key={dashboard.id} 
            className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-102 bg-white border border-gray-200"
            onClick={() => handleDashboardClick(dashboard)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                {dashboard.icon}
                <CardTitle className="text-sm font-semibold text-gray-800">
                  {dashboard.title}
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600 mb-3">
                {dashboard.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Power BI</span>
                <Button 
                  size="sm"
                  className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                >
                  View
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;