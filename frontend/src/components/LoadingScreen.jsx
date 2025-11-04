import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="mb-8 animate-bounce">
          <img 
            src="/images/header-logo.png" 
            alt="SmartDesk Logo" 
            className="h-32 w-32 mx-auto object-contain rounded-2xl shadow-2xl bg-white p-4"
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white animate-pulse">
            SMARTDESK
          </h1>
          
          <div className="flex justify-center items-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          
          <p className="text-blue-200 text-sm">Loading your workspace...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
