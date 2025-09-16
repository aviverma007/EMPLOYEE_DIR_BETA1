// Frontend-only API using dataService
import dataService from './dataService';
import imageStorage from './imageStorage';

// API Base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Employee API endpoints - Backend persistent
export const employeeAPI = {
  // Get all employees with optional search and filters
  getAll: async (searchParams = {}) => {
    try {
      const url = new URL(`${API_BASE_URL}/api/employees`);
      
      // Add search parameters to URL
      if (searchParams.search) url.searchParams.append('search', searchParams.search);
      if (searchParams.department) url.searchParams.append('department', searchParams.department);
      if (searchParams.location) url.searchParams.append('location', searchParams.location);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  // Update employee profile image
  updateImage: async (employeeId, imageData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees/${employeeId}/image`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: imageData }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update employee image');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating employee image:', error);
      throw error;
    }
  },

  // Upload employee profile image file
  uploadImage: async (employeeId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await fetch(`${API_BASE_URL}/api/employees/${employeeId}/upload-image`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload employee image');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading employee image:', error);
      throw error;
    }
  }
};

// Hierarchy API endpoints - Backend persistent
export const hierarchyAPI = {
  // Get all hierarchy relationships
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hierarchy`);
      if (!response.ok) {
        throw new Error('Failed to fetch hierarchy');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching hierarchy:', error);
      throw error;
    }
  },

  // Add new hierarchy relationship
  create: async (relationshipData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hierarchy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(relationshipData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create hierarchy relationship');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating hierarchy:', error);
      throw error;
    }
  },

  // Remove hierarchy relationship
  remove: async (employeeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hierarchy/${employeeId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete hierarchy relationship');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting hierarchy:', error);
      throw error;
    }
  },

  // Clear all hierarchy relationships
  clearAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hierarchy/clear`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to clear hierarchy');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error clearing hierarchy:', error);
      throw error;
    }
  }
};

// Utility API endpoints - Backend persistent
export const utilityAPI = {
  // Refresh Excel data
  refreshExcel: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/refresh-excel`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh Excel data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error refreshing Excel data:', error);
      throw error;
    }
  },

  // Get departments
  getDepartments: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/departments`);
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  // Get locations  
  getLocations: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/locations`);
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  },

  // Get system statistics
  getStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
};

// News API endpoints - Backend persistent
export const newsAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news`);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  create: async (newsData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create news');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  },

  update: async (id, newsData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update news');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete news');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  }
};

// Task API endpoints - Backend persistent
export const taskAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  create: async (taskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create task');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  update: async (id, taskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update task');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete task');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};

// Knowledge API endpoints - Backend persistent
export const knowledgeAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/knowledge`);
      if (!response.ok) {
        throw new Error('Failed to fetch knowledge');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching knowledge:', error);
      throw error;
    }
  },

  create: async (knowledgeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/knowledge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(knowledgeData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create knowledge');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating knowledge:', error);
      throw error;
    }
  },

  update: async (id, knowledgeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/knowledge/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(knowledgeData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update knowledge');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating knowledge:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/knowledge/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete knowledge');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting knowledge:', error);
      throw error;
    }
  }
};

// Help API endpoints
export const helpAPI = {
  getAll: async () => {
    return await dataService.getHelp();
  },

  create: async (helpData) => {
    return await dataService.createHelp(helpData);
  },

  update: async (id, helpData) => {
    return await dataService.updateHelp(id, helpData);
  },

  addReply: async (id, replyData) => {
    return await dataService.addHelpReply(id, replyData);
  },

  delete: async (id) => {
    return await dataService.deleteHelp(id);
  }
};

// Meeting Rooms API endpoints - Backend persistent
export const meetingRoomAPI = {
  getAll: async (filters = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/meeting-rooms`);
      if (!response.ok) {
        throw new Error('Failed to fetch meeting rooms');
      }
      let rooms = await response.json();
      
      // Apply frontend filters if needed
      if (filters.location) {
        rooms = rooms.filter(room => room.location === filters.location);
      }
      if (filters.floor) {
        rooms = rooms.filter(room => room.floor === filters.floor);
      }
      if (filters.status) {
        rooms = rooms.filter(room => room.status === filters.status);
      }
      
      return rooms;
    } catch (error) {
      console.error('Error fetching meeting rooms:', error);
      throw error;
    }
  },

  getLocations: async () => {
    try {
      const rooms = await meetingRoomAPI.getAll();
      const locations = [...new Set(rooms.map(room => room.location))];
      return locations;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  },

  getFloors: async () => {
    try {
      const rooms = await meetingRoomAPI.getAll();
      const floors = [...new Set(rooms.map(room => room.floor))];
      return floors;
    } catch (error) {
      console.error('Error fetching floors:', error);
      throw error;
    }
  },

  book: async (roomId, bookingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/meeting-rooms/${roomId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to book meeting room');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error booking meeting room:', error);
      throw error;
    }
  },

  cancelBooking: async (roomId, bookingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/meeting-rooms/${roomId}/booking/${bookingId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to cancel booking');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  clearAllBookings: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/meeting-rooms/clear-all-bookings`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to clear bookings');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error clearing all bookings:', error);
      throw error;
    }
  }
};

// Alerts API endpoints - Backend persistent
export const alertAPI = {
  getAll: async (targetAudience = 'all') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts?target_audience=${targetAudience}`);
      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },

  create: async (alertData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create alert');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  },

  update: async (alertId, alertData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update alert');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating alert:', error);
      throw error;
    }
  },

  delete: async (alertId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts/${alertId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete alert');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw error;
    }
  }
};

// Attendance API endpoints
export const attendanceAPI = {
  getAll: async (searchParams = {}) => {
    return await dataService.getAttendance(searchParams);
  },

  create: async (attendanceData) => {
    return await dataService.createAttendance(attendanceData);
  },

  update: async (id, attendanceData) => {
    // For frontend-only, we'll just update the existing record
    const attendance = dataService.attendance.find(a => a.id === id);
    if (attendance) {
      Object.assign(attendance, attendanceData, { updated_at: new Date().toISOString() });
      return attendance;
    }
    throw new Error('Attendance record not found');
  }
};

// Policies API endpoints
export const policyAPI = {
  getAll: async () => {
    return await dataService.getPolicies();
  },

  create: async (policyData) => {
    return await dataService.createPolicy(policyData);
  },

  update: async (id, policyData) => {
    const index = dataService.policies.findIndex(p => p.id === id);
    if (index > -1) {
      dataService.policies[index] = {
        ...dataService.policies[index],
        ...policyData,
        updated_at: new Date().toISOString()
      };
      return dataService.policies[index];
    }
    throw new Error('Policy not found');
  },

  delete: async (id) => {
    const index = dataService.policies.findIndex(p => p.id === id);
    if (index > -1) {
      dataService.policies.splice(index, 1);
      return { message: 'Policy deleted' };
    }
    throw new Error('Policy not found');
  }
};

// Workflows API endpoints
export const workflowAPI = {
  getAll: async () => {
    return await dataService.getWorkflows();
  },

  create: async (workflowData) => {
    return await dataService.createWorkflow(workflowData);
  },

  update: async (id, workflowData) => {
    const index = dataService.workflows.findIndex(w => w.id === id);
    if (index > -1) {
      dataService.workflows[index] = {
        ...dataService.workflows[index],
        ...workflowData,
        updated_at: new Date().toISOString()
      };
      return dataService.workflows[index];
    }
    throw new Error('Workflow not found');
  }
};

// Chat API endpoints (simplified for frontend-only)
export const chatAPI = {
  getHistory: async (sessionId) => {
    // Return empty history for frontend-only mode
    return [];
  },

  send: async (message, sessionId) => {
    // Return a mock response for frontend-only mode
    return {
      response: "I'm sorry, the AI chat feature is currently unavailable in offline mode. Please use other features of the application.",
      sessionId: sessionId
    };
  },

  clearHistory: async (sessionId) => {
    // No-op for frontend-only mode
    return { message: 'Chat history cleared' };
  }
};