import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  FileText, 
  Settings,
  ExternalLink
} from 'lucide-react';

const Dashboard = () => {
  const [buttons] = useState([
    {
      id: 1,
      title: "Analytics",
      description: "Business analytics and reports",
      icon: <BarChart3 className="h-8 w-8" />,
      url: "#", // Placeholder - user will provide later
      color: "bg-blue-600 hover:bg-blue-700",
      textColor: "text-white"
    },
    {
      id: 2, 
      title: "Team Management",
      description: "Manage team and resources",
      icon: <Users className="h-8 w-8" />,
      url: "#", // Placeholder - user will provide later
      color: "bg-green-600 hover:bg-green-700",
      textColor: "text-white"
    },
    {
      id: 3,
      title: "Project Planning",
      description: "Plan and track projects",
      icon: <Calendar className="h-8 w-8" />,
      url: "#", // Placeholder - user will provide later
      color: "bg-purple-600 hover:bg-purple-700", 
      textColor: "text-white"
    },
    {
      id: 4,
      title: "Documentation",
      description: "Access important documents",
      icon: <FileText className="h-8 w-8" />,
      url: "#", // Placeholder - user will provide later
      color: "bg-orange-600 hover:bg-orange-700",
      textColor: "text-white"
    },
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