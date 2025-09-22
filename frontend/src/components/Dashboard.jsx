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
      url: 'https://app.powerbi.com/view?r=eyJrIjoiYjk4YjVlM2YtYzJhZC00ZGJlLWE4YjQtOTYzZTU2MzkzYjZlIiwidCI6IjUwZjA5ZmVmLTc0NzQtNGE0MC1hM2RmLWJhNzQ3NDA4YmJjNCJ9',
      color: 'from-blue-500 to-blue-700'
    },
    {
      id: 'qms-dashboard',
      title: 'QMS Dashboard',
      description: 'Quality Management System Analytics',
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      url: 'https://app.powerbi.com/view?r=eyJrIjoiNmE4YzJkYzAtZTNiNC00MjIwLTkzYzgtOTU3MTQzNzNmODc3IiwidCI6IjUwZjA5ZmVmLTc0NzQtNGE0MC1hM2RmLWJhNzQ3NDA4YmJjNCJ9',
      color: 'from-green-500 to-green-700'
    },
    {
      id: 'assets-dashboard',
      title: 'Assets Dashboard',
      description: 'Asset Management and Tracking',
      icon: <BarChart3 className="h-6 w-6 text-purple-600" />,
      url: 'https://app.powerbi.com/view?r=eyJrIjoiZmM4OGEyNzMtNjE4ZC00ZDczLWE4MDQtNzJhYjBjMzMyZjZlIiwidCI6IjUwZjA5ZmVmLTc0NzQtNGE0MC1hM2RmLWJhNzQ3NDA4YmJjNCJ9',
      color: 'from-purple-500 to-purple-700'
    },
    {
      id: 'attendance-dashboard',
      title: 'Employee Attendance',
      description: 'Employee Attendance Analytics',
      icon: <Users className="h-6 w-6 text-orange-600" />,
      url: 'https://app.powerbi.com/view?r=eyJrIjoiOWE3MzIxM2QtOWY1ZC00ODcwLWJlZDctMjQxZGY0ZjYwNzQ2IiwidCI6IjUwZjA5ZmVmLTc0NzQtNGE0MC1hM2RmLWJhNzQ3NDA4YmJjNCJ9',
      color: 'from-orange-500 to-orange-700'
    },
    {
      id: 'pr-dashboard',
      title: 'PR Dashboard',  
      description: 'Purchase Request Analytics',
      icon: <Calendar className="h-6 w-6 text-indigo-600" />,
      url: 'https://app.powerbi.com/view?r=eyJrIjoiYzA4ZDJlMDctYjk4YS00NzY4LTg3MzMtNzE2NjkzNGEzYjcwIiwidCI6IjUwZjA5ZmVmLTc0NzQtNGE0MC1hM2RmLWJhNzQ3NDA4YmJjNCJ9',
      color: 'from-indigo-500 to-indigo-700'
    }
  ];

  const handleDashboardClick = (dashboard) => {
    window.open(dashboard.url, '_blank');
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
          <div className="w-full h-full border-0 rounded-lg shadow-lg bg-white flex flex-col">
            {/* Demo Dashboard Content */}
            <div className="p-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                {/* Chart 1 */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">₹47.2L</div>
                  <div className="text-gray-600 text-sm">Total Revenue</div>
                  <div className="w-full h-20 mt-4 bg-blue-200 rounded flex items-end justify-center space-x-1">
                    {[40, 65, 45, 80, 60, 75, 90].map((height, i) => (
                      <div key={i} className="bg-blue-500 w-6 rounded-t" style={{height: `${height}%`}}></div>
                    ))}
                  </div>
                </div>

                {/* Chart 2 */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">285</div>
                  <div className="text-gray-600 text-sm">Active Projects</div>
                  <div className="w-20 h-20 mt-4 relative">
                    <div className="w-full h-full bg-green-200 rounded-full"></div>
                    <div className="absolute inset-2 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">78%</div>
                  </div>
                </div>

                {/* Chart 3 */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">1,247</div>
                  <div className="text-gray-600 text-sm">Total Orders</div>
                  <div className="flex items-center space-x-2 mt-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div className="text-sm text-gray-600">+12% from last month</div>
                  </div>
                </div>

                {/* Chart 4 */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">98.5%</div>
                  <div className="text-gray-600 text-sm">System Uptime</div>
                  <div className="w-full h-6 mt-4 bg-orange-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{width: '98.5%'}}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer with note */}
            <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-500">
              📊 Demo {selectedDashboard.title} - Sample Analytics Data
            </div>
          </div>
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