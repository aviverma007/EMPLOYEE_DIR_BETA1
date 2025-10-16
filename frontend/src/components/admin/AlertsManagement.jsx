import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { Bell, Plus, Trash2, Edit2, Eye, Calendar, Users, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const AlertsManagement = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'medium',
    type: 'announcement',
    target_audience: 'all',
    expires_at: ''
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      console.log('Fetching alerts from:', `${backendUrl}/api/alerts`);
      
      const response = await fetch(`${backendUrl}/api/alerts`);
      console.log('Alerts response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Alerts loaded:', data.length);
        setAlerts(data);
        if (data.length === 0) {
          toast.info('No alerts created yet. Create your first alert!');
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error(`Failed to load alerts: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      priority: 'medium',
      type: 'announcement',
      target_audience: 'all',
      expires_at: ''
    });
    setEditingAlert(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        created_by: 'admin',
        expires_at: formData.expires_at || null
      };

      const url = editingAlert 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/alerts/${editingAlert.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/alerts`;
      
      const method = editingAlert ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(editingAlert ? 'Alert updated successfully!' : 'Alert created successfully!');
        setIsDialogOpen(false);
        resetForm();
        fetchAlerts();
      } else {
        throw new Error('Failed to save alert');
      }
    } catch (error) {
      console.error('Error saving alert:', error);
      toast.error('Failed to save alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (alert) => {
    setEditingAlert(alert);
    setFormData({
      title: alert.title,
      message: alert.message,
      priority: alert.priority,
      type: alert.type,
      target_audience: alert.target_audience,
      expires_at: alert.expires_at ? alert.expires_at.split('T')[0] : ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (alertId) => {
    if (!window.confirm('Are you sure you want to delete this alert?')) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/alerts/${alertId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Alert deleted successfully!');
        fetchAlerts();
      } else {
        throw new Error('Failed to delete alert');
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast.error('Failed to delete alert. Please try again.');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'urgent': return '🚨';
      case 'announcement': return '📢';
      case 'system': return '⚙️';
      case 'general': return 'ℹ️';
      default: return '📌';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alerts Management</h1>
          <p className="text-gray-600 mt-2">Create and manage alerts for users</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAlert ? 'Edit Alert' : 'Create New Alert'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Alert Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter alert title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Alert Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Enter alert message"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target_audience">Target Audience</Label>
                  <Select value={formData.target_audience} onValueChange={(value) => handleInputChange('target_audience', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="user">Users Only</SelectItem>
                      <SelectItem value="admin">Admins Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="expires_at">Expiration Date (Optional)</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => handleInputChange('expires_at', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingAlert ? 'Update Alert' : 'Create Alert'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No alerts created yet</p>
              <p className="text-sm text-gray-500 mt-1">Create your first alert to notify users</p>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getTypeIcon(alert.type)}</span>
                      <h3 className="text-xl font-semibold text-gray-900">{alert.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(alert.priority)}`}>
                        {alert.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{alert.message}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Target: {alert.target_audience}</span>
                      </div>
                      {alert.expires_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Expires: {new Date(alert.expires_at).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>Type: {alert.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(alert)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(alert.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsManagement;