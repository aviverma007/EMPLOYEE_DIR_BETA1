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

  return (
    <div className="h-full overflow-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white p-8 rounded-lg mb-6 shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-full">
            <Monitor className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Business Intelligence Dashboards</h1>
            <p className="text-blue-100 text-lg">
              Real-time analytics and insights for data-driven decisions
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5" />
              <span className="font-semibold">Real-time Data</span>
            </div>
            <p className="text-sm text-blue-100">Live business metrics and KPIs</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5" />
              <span className="font-semibold">Advanced Analytics</span>
            </div>
            <p className="text-sm text-blue-100">Predictive insights and trends</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5" />
              <span className="font-semibold">Team Collaboration</span>
            </div>
            <p className="text-sm text-blue-100">Shared insights across teams</p>
          </div>
        </div>
      </div>

      {/* Dashboard Categories */}
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
              <h2 className="text-xl font-bold text-gray-800">{category} Dashboards</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboards
                .filter(dashboard => dashboard.category === category)
                .map(dashboard => (
                <Card 
                  key={dashboard.id} 
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white border-0 shadow-lg"
                  onClick={() => handleDashboardClick(dashboard)}
                >
                  <CardHeader className={`bg-gradient-to-br ${dashboard.color} text-white rounded-t-lg pb-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          {dashboard.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold">
                            {dashboard.title}
                          </CardTitle>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {dashboard.category}
                          </Badge>
                        </div>
                      </div>
                      <ExternalLink className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4">
                      {dashboard.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Monitor className="h-4 w-4" />
                        <span>Power BI Dashboard</span>
                      </div>
                      
                      <Button 
                        size="sm"
                        className={`bg-gradient-to-r ${dashboard.color} hover:opacity-90 text-white border-0`}
                      >
                        View Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600 mb-2">
          <strong>SmartWorld Developers</strong> - Business Intelligence Platform
        </p>
        <p className="text-sm text-gray-500">
          Powered by Microsoft Power BI • Real-time data visualization and analytics
        </p>
      </div>
    </div>
  );
};

export default Dashboard;