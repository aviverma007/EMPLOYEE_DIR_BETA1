import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { Input } from './input';

const EmployeeSelect = ({ 
  employees = [], 
  value = '', 
  onChange, 
  placeholder = "Select reporting manager",
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp => {
    const searchLower = searchTerm.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(searchLower) ||
      emp.id?.toLowerCase().includes(searchLower) ||
      emp.department?.toLowerCase().includes(searchLower)
    );
  });

  // Parse the current value to extract name
  const getDisplayValue = () => {
    if (!value) return '';
    
    // Value format: "NAME(EMPLOYEE_ID)"
    const match = value.match(/^(.+?)\((\d+)\)$/);
    if (match) {
      return match[1]; // Return just the name
    }
    return value;
  };

  const handleSelect = (employee) => {
    const formattedValue = `${employee.name}(${employee.id})`;
    onChange(formattedValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Selected Value Display / Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md cursor-pointer hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {getDisplayValue() || placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && (
            <X 
              className="h-4 w-4 text-gray-400 hover:text-gray-600" 
              onClick={handleClear}
            />
          )}
          <ChevronDown 
            className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, ID, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 w-full text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Employee List */}
          <div className="overflow-y-auto max-h-64">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  onClick={() => handleSelect(employee)}
                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {employee.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {employee.id} • {employee.department || 'N/A'} • {employee.location || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 py-8 text-center text-gray-500 text-sm">
                {searchTerm ? 'No employees found matching your search' : 'No employees available'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSelect;
