import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { UserPlus, Search, Trash2, Edit2, Download, Upload as UploadIcon, Image as ImageIcon } from 'lucide-react';
import EmployeeSelect from '../ui/employee-select';
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

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    designation: '',
    department: '',
    location: '',
    grade: '',
    mobile: '',
    email: '',
    extension: '',
    reporting_manager: '',
    date_of_joining: '',
    date_of_birth: '',
    blood_group: '',
    emergency_contact: '',
    profileImage: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp => 
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      console.log('Fetching employees from:', `${backendUrl}/api/employees`);
      
      const response = await fetch(`${backendUrl}/api/employees`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Employees loaded:', data.length);
        setEmployees(data);
        setFilteredEmployees(data);
        toast.success(`Loaded ${data.length} employees successfully`);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error(`Failed to load employees: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      designation: '',
      department: '',
      location: '',
      grade: '',
      mobile: '',
      email: '',
      extension: '',
      reporting_manager: '',
      date_of_joining: '',
      date_of_birth: '',
      blood_group: '',
      emergency_contact: '',
      profileImage: ''
    });
    setEditingEmployee(null);
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.id || !formData.name || !formData.department) {
      toast.error('Please fill in all required fields (ID, Name, Department)');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = formData.profileImage;

      // Upload image if selected
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
        imageFormData.append('employeeId', formData.id);

        const imageResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/employees/${formData.id}/upload-image`, {
          method: 'POST',
          body: imageFormData
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          imageUrl = imageData.imageUrl;
        }
      }

      const payload = { ...formData, profileImage: imageUrl };

      const url = editingEmployee 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/employees/${editingEmployee.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/employees`;
      
      const method = editingEmployee ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(editingEmployee ? 'Employee updated successfully!' : 'Employee added successfully!');
        setIsDialogOpen(false);
        resetForm();
        fetchEmployees();
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to save employee');
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error(error.message || 'Failed to save employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      id: employee.id || '',
      name: employee.name || '',
      designation: employee.designation || '',
      department: employee.department || '',
      location: employee.location || '',
      grade: employee.grade || '',
      mobile: employee.mobile || '',
      email: employee.email || '',
      extension: employee.extension || '',
      reporting_manager: employee.reporting_manager || '',
      date_of_joining: employee.date_of_joining ? employee.date_of_joining.split('T')[0] : '',
      date_of_birth: employee.date_of_birth ? employee.date_of_birth.split('T')[0] : '',
      blood_group: employee.blood_group || '',
      emergency_contact: employee.emergency_contact || '',
      profileImage: employee.profileImage || ''
    });
    setImagePreview(employee.profileImage || '');
    setIsDialogOpen(true);
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/employees/${employeeId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Employee deleted successfully!');
        fetchEmployees();
      } else {
        throw new Error('Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee. Please try again.');
    }
  };

  const handleExportToExcel = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/employees/export-excel`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `employees_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Employees exported successfully!');
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Error exporting:', error);
      toast.error('Failed to export employees');
    }
  };

  const handleSyncToMasterExcel = async () => {
    if (!window.confirm('This will sync all current employee data from database to master Excel file. Continue?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/employees/sync-to-excel`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const result = await response.json();
        toast.success(`✅ Synced ${result.employee_count} employees to master Excel file!`);
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Sync failed');
      }
    } catch (error) {
      console.error('Error syncing:', error);
      toast.error(`Failed to sync to Excel: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600 mt-2">Add, edit, and manage employee records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSyncToMasterExcel} disabled={loading}>
            <UploadIcon className="h-4 w-4 mr-2" />
            Sync to Master Excel
          </Button>
          <Button variant="outline" onClick={handleExportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <Label htmlFor="profileImage" className="cursor-pointer">
                    <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('profileImage').click()}>
                      <UploadIcon className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                  </Label>
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="id">Employee ID *</Label>
                    <Input
                      id="id"
                      value={formData.id}
                      onChange={(e) => handleInputChange('id', e.target.value)}
                      placeholder="e.g., 80001"
                      required
                      disabled={editingEmployee !== null}
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      value={formData.designation}
                      onChange={(e) => handleInputChange('designation', e.target.value)}
                      placeholder="e.g., Senior Manager"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      placeholder="e.g., IT, HR, Finance"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., IFC, Noida"
                    />
                  </div>
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Input
                      id="grade"
                      value={formData.grade}
                      onChange={(e) => handleInputChange('grade', e.target.value)}
                      placeholder="e.g., L1, L2, L3"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      placeholder="e.g., +91 9876543210"
                      type="tel"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="employee@company.com"
                      type="email"
                    />
                  </div>
                </div>

                {/* Extension and Reporting Manager */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="extension">Extension Number</Label>
                    <Input
                      id="extension"
                      value={formData.extension}
                      onChange={(e) => handleInputChange('extension', e.target.value)}
                      placeholder="e.g., 1234"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reporting_manager">Reporting Manager</Label>
                    <Input
                      id="reporting_manager"
                      value={formData.reporting_manager}
                      onChange={(e) => handleInputChange('reporting_manager', e.target.value)}
                      placeholder="Manager's name"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date_of_joining">Date of Joining</Label>
                    <Input
                      id="date_of_joining"
                      value={formData.date_of_joining}
                      onChange={(e) => handleInputChange('date_of_joining', e.target.value)}
                      type="date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      type="date"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="blood_group">Blood Group</Label>
                    <Select value={formData.blood_group} onValueChange={(value) => handleInputChange('blood_group', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="emergency_contact">Emergency Contact</Label>
                    <Input
                      id="emergency_contact"
                      value={formData.emergency_contact}
                      onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                      placeholder="Emergency contact number"
                      type="tel"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : editingEmployee ? 'Update Employee' : 'Add Employee'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search by name, ID, department, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Employees List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading employees...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joining Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                      {searchTerm ? 'No employees found matching your search' : 'No employees added yet'}
                    </td>
                  </tr>
                ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        {employee.profileImage ? (
                          <img src={employee.profileImage} alt={employee.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            {employee.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.designation || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.location || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {employee.date_of_joining ? new Date(employee.date_of_joining).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.mobile || employee.email || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(employee)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(employee.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      {!loading && (
        <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
          <div>
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;