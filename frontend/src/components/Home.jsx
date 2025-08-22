import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { useAuth } from "../context/AuthContext";
import { employeeAPI } from '../services/api';
import { 
  ChevronLeft, 
  ChevronRight, 
  Image, 
  Users, 
  PartyPopper, 
  CheckSquare, 
  Workflow, 
  Newspaper,
  Plus,
  X,
  ExternalLink,
  Globe,
  Building,
  UserCheck,
  Calendar,
  ChevronDown,
  User
} from "lucide-react";

const Home = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [todoItems, setTodoItems] = useState([
    { id: 1, text: "Review monthly reports", completed: false },
    { id: 2, text: "Schedule team meeting", completed: true },
    { id: 3, text: "Update employee profiles", completed: false }
  ]);
  const [newTodoText, setNewTodoText] = useState("");
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [currentJoineeIndex, setCurrentJoineeIndex] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(false);
  const [showUserProjectsDropdown, setShowUserProjectsDropdown] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const { isAdmin } = useAuth();

  // SmartWorld project banner images
  const bannerImages = [
    "https://customer-assets.emergentagent.com/job_alpha-search-fix/artifacts/5nmzbaqz_smart-world-orchard.webp",
    "https://customer-assets.emergentagent.com/job_alpha-search-fix/artifacts/fdyg3j9u_smart-world-one-dxp.webp", 
    "https://customer-assets.emergentagent.com/job_alpha-search-fix/artifacts/55c7jl50_smart-world-gems.webp",
    "https://customer-assets.emergentagent.com/job_alpha-search-fix/artifacts/0m7sp116_smart-world-the-edition.webp",
    "https://customer-assets.emergentagent.com/job_alpha-search-fix/artifacts/twxag3rn_smart-world-sky-arc.webp"
  ];

  // Company gallery images for photo slideshow
  const galleryImages = [
    "https://customer-assets.emergentagent.com/job_38901552-4b3f-4152-8c86-1ce1635ab130/artifacts/70beszdu_IMG-20250814-WA0090.jpg",
    "https://customer-assets.emergentagent.com/job_38901552-4b3f-4152-8c86-1ce1635ab130/artifacts/xq6fbjnj_IMG-20250814-WA0147.jpg",
    "https://customer-assets.emergentagent.com/job_38901552-4b3f-4152-8c86-1ce1635ab130/artifacts/apkd9exk_IMG-20250814-WA0181.jpeg",
    "https://customer-assets.emergentagent.com/job_38901552-4b3f-4152-8c86-1ce1635ab130/artifacts/w6boogvj_IMG-20250814-WA0201.jpg",
    "https://customer-assets.emergentagent.com/job_38901552-4b3f-4152-8c86-1ce1635ab130/artifacts/exnv01mp_IMG-20250814-WA0224.jpg"
  ];

  // Project links data
  const projectLinks = [
    { name: "SKY ARC", url: "https://smartworlddevelopers.com/project/sky-arc/" },
    { name: "THE EDITION", url: "https://smartworlddevelopers.com/project/theedition/" },
    { name: "ONE DXP", url: "https://smartworlddevelopers.com/project/onedxp/" },
    { name: "ORCHARD STREET", url: "https://smartworlddevelopers.com/project/orchardstreet/" },
    { name: "ORCHARD", url: "https://smartworlddevelopers.com/project/orchard/" },
    { name: "GEMS", url: "https://smartworlddevelopers.com/project/gems/" }
  ];

  // External link buttons - removed Contact and updated Company Portal
  const externalButtons = [
    {
      title: "Adrenaline",
      icon: <UserCheck className="h-4 w-4" />,
      description: "Employee HR Portal",
      url: "https://maxhr.myadrenalin.com/AdrenalinMax/",
      color: "bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300"
    },
    {
      title: "Company Portal",
      icon: <Building className="h-4 w-4" />,
      description: "Main corporate website",
      url: "https://smartworlddevelopers.com/",
      color: "bg-blue-600 hover:bg-blue-700 text-white"
    },
    {
      title: "Projects",
      icon: <Globe className="h-4 w-4" />,
      description: "Our development projects",
      url: "#",
      color: "bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300",
      isDropdown: true
    },
    {
      title: "BIMABRO",
      icon: <User className="h-4 w-4" />,
      description: "Employee portal",
      url: "https://employee.bimabro.com/",
      color: "bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300"
    },
    {
      title: "Events",
      icon: <Calendar className="h-4 w-4" />,
      description: "Company events & updates",
      url: "#",
      color: "bg-blue-600 hover:bg-blue-700 text-white"
    }
  ];

  // External link buttons with images - FOR USER PROFILE ONLY
  const userQuickAccessButtons = [
    {
      title: "HR Portal",
      description: "Adrenaline",
      url: "https://maxhr.myadrenalin.com/AdrenalinMax/",
      image: "https://customer-assets.emergentagent.com/job_change-maker-1/artifacts/otz1j4e1_adrenaline%20hrms%20logo.png"
    },
    {
      title: "Company",
      description: "Website",
      url: "https://smartworlddevelopers.com/",
      image: "https://customer-assets.emergentagent.com/job_change-maker-1/artifacts/d2zoi8qy_company%20logo.png"
    },
    {
      title: "Projects",
      description: "Our Developments",
      url: "#",
      image: "https://customer-assets.emergentagent.com/job_change-maker-1/artifacts/ulju1r77_projects.png",
      isDropdown: true
    },
    {
      title: "BIMABRO",
      description: "Employee Portal",
      url: "https://employee.bimabro.com/",
      image: "https://customer-assets.emergentagent.com/job_fast-modify/artifacts/s5o6c9cu_BimaBro.jpg"
    },
    {
      title: "MAFOI",
      description: "HR Suite",
      url: "https://mafoi.hfactor.app/hrsuite/#/login/smartworld",
      image: "https://customer-assets.emergentagent.com/job_change-maker-1/artifacts/hnug73tl_MAFOI%20logo.jpg"
    }
  ];

  // Fetch employees data for new joinees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeAPI.getAll();
        // Filter employees who joined in the last 1 month
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        const recentJoinees = data.filter(emp => {
          if (!emp.dateOfJoining) return false;
          const joinDate = new Date(emp.dateOfJoining);
          return joinDate >= oneMonthAgo;
        }).sort((a, b) => new Date(b.dateOfJoining) - new Date(a.dateOfJoining));
        
        setEmployees(recentJoinees.slice(0, 15)); // Show latest 15 employees
      } catch (error) {
        console.error('Error fetching employees:', error);
        // Fallback data for demonstration
        setEmployees([]);
      }
    };
    
    fetchEmployees();
  }, []);

  // Auto-scroll banner every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // Auto-scroll gallery images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGalleryIndex(prev => (prev + 1) % galleryImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  // Auto-scroll gallery images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGalleryIndex(prev => (prev + 1) % galleryImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  // Auto-scroll new joinees every 3 seconds (showing 3 at a time)
  useEffect(() => {
    if (employees.length > 3) {
      const interval = setInterval(() => {
        setCurrentJoineeIndex(prev => {
          const nextIndex = prev + 1;
          return nextIndex + 2 >= employees.length ? 0 : nextIndex;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [employees.length]);

  // Navigate banner manually
  const navigateBanner = (direction) => {
    if (direction === 'next') {
      setCurrentBannerIndex(prev => (prev + 1) % bannerImages.length);
    } else {
      setCurrentBannerIndex(prev => (prev - 1 + bannerImages.length) % bannerImages.length);
    }
  };

  // Todo list functions
  const addTodoItem = () => {
    if (newTodoText.trim()) {
      const newItem = {
        id: Date.now(),
        text: newTodoText.trim(),
        completed: false
      };
      setTodoItems([...todoItems, newItem]);
      setNewTodoText("");
      setShowAddTodo(false);
      localStorage.setItem('userTodos', JSON.stringify([...todoItems, newItem]));
    }
  };

  const toggleTodoItem = (id) => {
    const updatedItems = todoItems.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setTodoItems(updatedItems);
    localStorage.setItem('userTodos', JSON.stringify(updatedItems));
  };

  const removeTodoItem = (id) => {
    const updatedItems = todoItems.filter(item => item.id !== id);
    setTodoItems(updatedItems);
    localStorage.setItem('userTodos', JSON.stringify(updatedItems));
  };

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('userTodos');
    if (savedTodos) {
      setTodoItems(JSON.parse(savedTodos));
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Handle projects dropdown
  const handleProjectsClick = () => {
    setShowProjectsDropdown(!showProjectsDropdown);
  };

  // Define different tiles for Admin vs User
  const adminTiles = [
    {
      title: "PICTURES",
      icon: <Image className="h-6 w-6" />,
      description: "Company gallery and events",
      color: "bg-blue-600",
      textColor: "text-white",
      interactive: true
    },
    {
      title: "NEW JOINEES",
      icon: <Users className="h-6 w-6" />,
      description: "",
      color: "bg-white border-2 border-blue-200",
      textColor: "text-blue-900",
      interactive: true
    },
    {
      title: "CELEBRATIONS",
      icon: <PartyPopper className="h-6 w-6" />,
      description: "Birthdays, anniversaries & achievements",
      color: "bg-blue-600",
      textColor: "text-white"
    },
    {
      title: "TO DO LIST",
      icon: <CheckSquare className="h-6 w-6" />,
      description: "Your personal task manager",
      color: "bg-white border-2 border-blue-200",
      textColor: "text-blue-900",
      interactive: true
    },
    {
      title: "WORKFLOW",
      icon: <Workflow className="h-6 w-6" />,
      description: "Process management & tracking",
      color: "bg-blue-600",
      textColor: "text-white"
    },
    {
      title: "DAILY COMPANY NEWS",
      icon: <Newspaper className="h-6 w-6" />,
      description: "Latest updates and announcements",
      color: "bg-white border-2 border-blue-200",
      textColor: "text-blue-900"
    }
  ];

  const userTiles = [
    {
      title: "PICTURES",
      icon: <Image className="h-6 w-6" />,
      description: "Company gallery and events",
      color: "bg-blue-600",
      textColor: "text-white",
      interactive: true
    },
    {
      title: "NEW JOINEES",
      icon: <Users className="h-6 w-6" />,
      description: "",
      color: "bg-white border-2 border-blue-200",
      textColor: "text-blue-900",
      interactive: true
    },
    {
      title: "TO DO LIST",
      icon: <CheckSquare className="h-6 w-6" />,
      description: "Your personal task manager",
      color: "bg-white border-2 border-blue-200",
      textColor: "text-blue-900",
      interactive: true
    }
  ];

  const tiles = isAdmin() ? adminTiles : userTiles;

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Compact Banner Section */}
      <div className="relative w-full h-48 rounded-lg shadow-md overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
        >
          {bannerImages.map((image, index) => (
            <div
              key={index}
              className="min-w-full h-full relative"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-3xl font-bold mb-2">Welcome to SmartWorld</h2>
                  <p className="text-lg">BUILDING HOMES FOR FUTURE TODAY</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <button
          onClick={() => navigateBanner('prev')}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 transition-all"
        >
          <ChevronLeft className="h-5 w-5 text-gray-800" />
        </button>
        <button
          onClick={() => navigateBanner('next')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 transition-all"
        >
          <ChevronRight className="h-5 w-5 text-gray-800" />
        </button>
        
        {/* Dots Indicator */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentBannerIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Tiles Section - Responsive Height Grid */}
      <div className={`flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${
        !isAdmin() ? 'max-h-72' : ''
      }`}>
        {tiles.map((tile, index) => (
          <Card 
            key={index}
            className={`${tile.color} ${tile.textColor} shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col ${
              tile.title === "PICTURES" ? "overflow-hidden border-0 p-0" : "transform hover:scale-105"
            } ${
              !isAdmin() ? 'h-56' : 'h-full'
            }`}
          >
            {tile.title === "PICTURES" ? (
              // Full-screen Pictures tile without borders
              <div className="h-full w-full relative overflow-hidden">
                {/* Full-screen slideshow container */}
                <div 
                  className="flex transition-transform duration-700 ease-in-out h-full"
                  style={{ transform: `translateX(-${currentGalleryIndex * 100}%)` }}
                >
                  {galleryImages.map((image, idx) => (
                    <div 
                      key={idx}
                      className="min-w-full h-full relative overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`Company gallery ${idx + 1}`}
                        className="w-full h-full object-cover transition-all duration-500"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                      {/* Overlay gradient for better visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>
                  ))}
                </div>
                
                {/* Title overlay - Only show for Admin */}
                {isAdmin() && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center space-x-2 text-white">
                      <Image className="h-5 w-5" />
                      <span className="text-sm font-bold tracking-wide">PICTURES</span>
                    </div>
                  </div>
                )}
                
                {/* Slide indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentGalleryIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        idx === currentGalleryIndex 
                          ? 'bg-white scale-110 shadow-lg' 
                          : 'bg-white/60 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-10">
                  <div 
                    className="h-full bg-white/80 transition-all duration-2000 ease-linear"
                    style={{ 
                      width: `${((currentGalleryIndex + 1) / galleryImages.length) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                <CardHeader className="pb-2 flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    {tile.icon}
                    <CardTitle className="text-base font-bold">{tile.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 flex-1 flex flex-col">
                  {tile.interactive && tile.title === "NEW JOINEES" ? (
                    <div className="flex-1 flex flex-col">
                      <p className="text-xs opacity-90 mb-3">{tile.description}</p>
                      
                      {/* New Joinees Enhanced Display */}
                      {employees.length > 0 ? (
                        <div className="flex-1 flex flex-col">
                          <div className={`space-y-2 overflow-hidden relative ${
                            !isAdmin() ? 'h-32' : 'h-40'
                          }`}>
                            <div 
                              className="transition-transform duration-1000 ease-in-out"
                              style={{ 
                                transform: `translateY(-${(currentJoineeIndex) * (isAdmin() ? 42 : 38)}px)` 
                              }}
                            >
                              {/* Create extended array for seamless scrolling */}
                              {employees.concat(employees.slice(0, 5)).map((employee, idx) => (
                                <div 
                                  key={`${employee.id}-${idx}`}
                                  className={`bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-2 mb-2 shadow-sm hover:shadow-md transition-all duration-300 ${
                                    !isAdmin() ? 'h-8' : 'h-10'
                                  }`}
                                  style={{
                                    outline: '1px solid rgba(59, 130, 246, 0.3)',
                                    outlineOffset: '1px'
                                  }}
                                >
                                  <div className="flex items-center justify-between h-full">
                                    {/* Employee Name with White Background */}
                                    <div className="bg-white px-2 py-1 rounded-md border border-blue-300 shadow-sm flex-shrink-0">
                                      <span className="font-bold text-blue-900 text-xs">
                                        {employee.name}
                                      </span>
                                    </div>
                                    
                                    {/* Employee Details */}
                                    <div className="flex flex-col justify-center ml-2 flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <span className="text-blue-700 font-medium text-[10px] truncate">
                                          ID: {employee.id}
                                        </span>
                                        <span className="text-blue-500 text-[9px] flex-shrink-0 ml-2">
                                          {formatDate(employee.dateOfJoining)}
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-2 text-[9px] mt-0.5">
                                        <span className="bg-blue-200 text-blue-800 px-1 rounded text-[8px] font-medium">
                                          {employee.grade || 'N/A'}
                                        </span>
                                        <span className="text-blue-600 truncate font-medium">
                                          {employee.department.length > 15 ? employee.department.substring(0, 15) + '..' : employee.department}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Enhanced Progress indicator */}
                          <div className="flex justify-center mt-2 space-x-1">
                            {employees.slice(0, Math.min(8, employees.length)).map((_, idx) => (
                              <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                  idx === currentJoineeIndex 
                                    ? 'bg-blue-600 w-6 shadow-md' 
                                    : idx === (currentJoineeIndex + 1) % employees.length
                                    ? 'bg-blue-400 w-3'
                                    : 'bg-blue-200 w-2'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-blue-700 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300">
                          <div className="text-center p-4">
                            <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                            <p className="text-sm font-medium">Loading new joinees...</p>
                            <p className="text-xs text-blue-500">Last 1 month</p>
                          </div>
                        </div>
                      )}
                    </div>
              ) : tile.interactive && tile.title === "TO DO LIST" ? (
                <div className="flex-1 flex flex-col">
                  <p className="text-xs opacity-90 mb-2">{tile.description}</p>
                  
                  {/* Todo Items Count and Scroll Indicator */}
                  {todoItems.length > 4 && (
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-blue-600">{todoItems.length} tasks</span>
                      <span className="text-[10px] text-blue-500">↕ scroll to see more</span>
                    </div>
                  )}
                  
                  {/* Todo Items - Enhanced Scrollable Version */}
                  <div className={`flex-1 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100 hover:scrollbar-thumb-blue-500 ${
                    !isAdmin() ? 'max-h-28' : 'max-h-32'
                  }`}>
                    {todoItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-2 bg-blue-50 rounded p-1.5 hover:bg-blue-100 transition-colors">
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={() => toggleTodoItem(item.id)}
                          className="border-blue-400 h-3 w-3 flex-shrink-0"
                        />
                        <span className={`flex-1 text-xs text-blue-900 ${item.completed ? 'line-through opacity-70' : ''} break-words`}>
                          {item.text}
                        </span>
                        <button
                          onClick={() => removeTodoItem(item.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {todoItems.length === 0 && (
                      <div className="flex items-center justify-center h-16 text-blue-500">
                        <p className="text-xs opacity-75">No tasks yet. Add one below!</p>
                      </div>
                    )}
                  </div>

                  {/* Add Todo - Compact */}
                  {showAddTodo ? (
                    <div className="mt-auto space-y-1.5">
                      <Input
                        value={newTodoText}
                        onChange={(e) => setNewTodoText(e.target.value)}
                        placeholder="Enter new task..."
                        className="bg-blue-50 text-blue-900 placeholder-blue-500 border-blue-200 h-8 text-xs"
                        onKeyPress={(e) => e.key === 'Enter' && addTodoItem()}
                      />
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          onClick={addTodoItem}
                          className="bg-blue-600 text-white hover:bg-blue-700 h-7 px-2 text-xs"
                        >
                          Add
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setShowAddTodo(false);
                            setNewTodoText("");
                          }}
                          className="border-blue-400 text-blue-600 hover:bg-blue-50 h-7 px-2 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setShowAddTodo(true)}
                      className="mt-auto bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 border h-7 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Task
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex items-start">
                  <p className="text-xs opacity-90">{tile.description}</p>
                </div>
              )}
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* External Links Section - Full Width Stretch for Admin Only */}
      {isAdmin() && (
        <div className="mt-4">
          <h3 className="text-md font-medium text-blue-900 mb-3 text-center">Quick Links</h3>
          <div className="w-full flex gap-3 justify-stretch">
            {externalButtons.map((button, index) => (
              <div key={index} className="flex-1 relative">
                {button.isDropdown ? (
                  <div className="relative">
                    <button
                      onClick={handleProjectsClick}
                      className={`${button.color} ${button.color.includes('text-white') ? 'text-white' : 'text-blue-700'} rounded-md p-3 shadow-sm transition-all duration-200 hover:shadow-md group text-center w-full`}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <div className="flex items-center space-x-1">
                          {button.icon}
                          <ChevronDown className={`h-4 w-4 transition-transform ${showProjectsDropdown ? 'rotate-180' : ''}`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{button.title}</h4>
                          <p className="text-xs opacity-75">{button.description}</p>
                        </div>
                      </div>
                    </button>
                    
                    {showProjectsDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-blue-200 rounded-md shadow-lg z-50">
                        <div className="p-2 bg-blue-50 border-b border-blue-200">
                          <h4 className="text-xs font-semibold text-blue-800 text-center">SmartWorld Projects</h4>
                        </div>
                        {projectLinks.map((project, projIndex) => (
                          <a
                            key={projIndex}
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-3 text-sm text-blue-700 hover:bg-blue-50 transition-colors border-b border-blue-100 last:border-b-0 flex items-center justify-between group"
                            onClick={() => setShowProjectsDropdown(false)}
                          >
                            <span className="font-medium">{project.name}</span>
                            <ExternalLink className="h-3 w-3 opacity-40 group-hover:opacity-70 transition-opacity" />
                          </a>
                        ))}
                        <div className="p-2 bg-gray-50 text-center">
                          <span className="text-xs text-gray-500">Click to visit project details</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={button.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${button.color} ${button.color.includes('text-white') ? 'text-white' : 'text-blue-700'} rounded-md p-3 shadow-sm transition-all duration-200 hover:shadow-md group text-center w-full block`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      {button.icon}
                      <div>
                        <h4 className="font-medium text-sm">{button.title}</h4>
                        <p className="text-xs opacity-75">{button.description}</p>
                      </div>
                      <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-75 transition-opacity" />
                    </div>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Quick Links Section - Image-only design as requested (NO square boundaries) */}
      {!isAdmin() && (
        <div className="mt-4">
          <h3 className="text-md font-medium text-blue-900 mb-3 text-center">Quick Access</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {userQuickAccessButtons.map((button, index) => (
              <div key={index} className="relative flex flex-col items-center">
                {button.isDropdown ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserProjectsDropdown(!showUserProjectsDropdown)}
                      className="group transition-all duration-200 hover:scale-110 text-center"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <img 
                          src={button.image} 
                          alt={button.title}
                          className="h-12 w-12 object-contain drop-shadow-lg hover:drop-shadow-xl transition-all duration-200"
                        />
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-sm text-blue-700">{button.title}</span>
                          <ChevronDown className={`h-3 w-3 text-blue-500 transition-transform ${showUserProjectsDropdown ? 'rotate-180' : ''}`} />
                        </div>
                        <p className="text-xs text-blue-600">{button.description}</p>
                      </div>
                    </button>
                    
                    {showUserProjectsDropdown && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white border border-blue-200 rounded-md shadow-lg z-50 min-w-48">
                        <div className="p-2 bg-blue-50 border-b border-blue-200">
                          <h4 className="text-xs font-semibold text-blue-800 text-center">SmartWorld Projects</h4>
                        </div>
                        {projectLinks.map((project, projIndex) => (
                          <a
                            key={projIndex}
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-3 text-sm text-blue-700 hover:bg-blue-50 transition-colors border-b border-blue-100 last:border-b-0 flex items-center justify-between group"
                            onClick={() => setShowUserProjectsDropdown(false)}
                          >
                            <span className="font-medium">{project.name}</span>
                            <ExternalLink className="h-3 w-3 opacity-40 group-hover:opacity-70 transition-opacity" />
                          </a>
                        ))}
                        <div className="p-2 bg-gray-50 text-center">
                          <span className="text-xs text-gray-500">Click to visit project details</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={button.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group transition-all duration-200 hover:scale-110 text-center"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <img 
                        src={button.image} 
                        alt={button.title}
                        className="h-12 w-12 object-contain drop-shadow-lg hover:drop-shadow-xl transition-all duration-200"
                      />
                      <div>
                        <h4 className="font-medium text-sm text-blue-700">{button.title}</h4>
                        <p className="text-xs text-blue-600">{button.description}</p>
                      </div>
                    </div>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Close dropdowns when clicking outside */}
      {(showProjectsDropdown || showUserProjectsDropdown) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowProjectsDropdown(false);
            setShowUserProjectsDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default Home;