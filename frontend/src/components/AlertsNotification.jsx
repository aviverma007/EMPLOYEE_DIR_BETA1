import React, { useState, useEffect } from 'react';
import { Bell, X, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const AlertsNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/alerts?target_audience=user`);
      const activeAlerts = response.data.filter(alert => {
        if (!alert.expires_at) return true;
        return new Date(alert.expires_at) > new Date();
      });
      
      // Add some default notifications if no alerts from backend
      const defaultNotifications = [
        {
          id: 'default-1',
          title: '📢 Welcome to SmartDesk',
          message: 'Explore all the features available in your employee portal.',
          priority: 'medium',
          type: 'announcement',
          created_at: new Date().toISOString()
        },
        {
          id: 'default-2',
          title: '🎉 System Update',
          message: 'New features have been added to the meeting room booking system.',
          priority: 'low',
          type: 'system',
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'default-3',
          title: '📅 Upcoming Holiday',
          message: 'Check the holiday calendar for upcoming holidays this month.',
          priority: 'medium',
          type: 'announcement',
          created_at: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      
      const allAlerts = activeAlerts.length > 0 ? activeAlerts : defaultNotifications;
      setAlerts(allAlerts);
      setUnreadCount(allAlerts.length);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      // Show default notifications on error
      const defaultNotifications = [
        {
          id: 'default-1',
          title: '📢 Welcome to SmartDesk',
          message: 'Explore all the features available in your employee portal.',
          priority: 'medium',
          type: 'announcement',
          created_at: new Date().toISOString()
        },
        {
          id: 'default-2',
          title: '🎉 System Update',
          message: 'New features have been added to the meeting room booking system.',
          priority: 'low',
          type: 'system',
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'default-3',
          title: '📅 Upcoming Holiday',
          message: 'Check the holiday calendar for upcoming holidays this month.',
          priority: 'medium',
          type: 'announcement',
          created_at: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      setAlerts(defaultNotifications);
      setUnreadCount(defaultNotifications.length);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'system':
        return 'bg-purple-100 text-purple-800';
      case 'announcement':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          size="icon"
          className="relative hover:bg-blue-50 rounded-full"
        >
          <Bell className="h-6 w-6 text-blue-600" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <Card className="absolute right-0 top-12 w-80 max-h-[450px] shadow-2xl z-50 bg-white border-2 border-blue-200 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <Badge className="bg-white text-blue-600 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-blue-500 rounded-full h-7 w-7"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="overflow-y-auto max-h-[380px]">
                {alerts.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No new notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-blue-100">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="p-3 hover:bg-blue-50 transition-colors">
                        <div className="flex items-start space-x-2">
                          <div className="flex-shrink-0 mt-1">
                            <AlertCircle className={`h-4 w-4 ${
                              alert.priority === 'urgent' ? 'text-red-500' :
                              alert.priority === 'high' ? 'text-orange-500' :
                              'text-blue-500'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <Badge className={getPriorityColor(alert.priority)} variant="outline">
                                {alert.priority?.toUpperCase() || 'NORMAL'}
                              </Badge>
                              <Badge className={getTypeColor(alert.type)} variant="secondary">
                                {alert.type || 'general'}
                              </Badge>
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                              {alert.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-1">
                              {alert.message}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(alert.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  );
};

export default AlertsNotification;