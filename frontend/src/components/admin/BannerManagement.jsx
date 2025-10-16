import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Image, Upload, Trash2, Eye } from 'lucide-react';

const BannerManagement = () => {
  const [banners, setBanners] = useState({
    heroBanner: '/images/company logo.png',
    policyBanner: '/images/Policies_Banner.png',
    profileTiles: {
      pictures: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
      newJoinees: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400',
      celebrations: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400',
      todo: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400',
      workflow: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
      news: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400'
    }
  });
  
  const [previews, setPreviews] = useState({});
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const bannerTypes = [
    { key: 'heroBanner', label: 'Hero Banner (Login Page)', current: banners.heroBanner },
    { key: 'policyBanner', label: 'Policy Page Banner', current: banners.policyBanner },
    { key: 'pictures', label: 'Pictures Tile Background', current: banners.profileTiles.pictures },
    { key: 'newJoinees', label: 'New Joinees Tile Background', current: banners.profileTiles.newJoinees },
    { key: 'celebrations', label: 'Celebrations Tile Background', current: banners.profileTiles.celebrations },
    { key: 'todo', label: 'To Do List Tile Background', current: banners.profileTiles.todo },
    { key: 'workflow', label: 'Workflow Tile Background', current: banners.profileTiles.workflow },
    { key: 'news', label: 'Daily News Tile Background', current: banners.profileTiles.news }
  ];

  const handleFileSelect = (key, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews(prev => ({
        ...prev,
        [key]: { file, preview: reader.result }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (key) => {
    const previewData = previews[key];
    if (!previewData) {
      toast.error('Please select an image first');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', previewData.file);
      formData.append('bannerType', key);

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/upload-banner`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update local state
        if (key === 'heroBanner' || key === 'policyBanner') {
          setBanners(prev => ({ ...prev, [key]: data.imageUrl }));
        } else {
          setBanners(prev => ({
            ...prev,
            profileTiles: { ...prev.profileTiles, [key]: data.imageUrl }
          }));
        }
        
        // Clear preview
        setPreviews(prev => {
          const newPreviews = { ...prev };
          delete newPreviews[key];
          return newPreviews;
        });
        
        toast.success('Banner updated successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload banner. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePreview = (key) => {
    setPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[key];
      return newPreviews;
    });
    // Reset file input
    const input = document.getElementById(`file-${key}`);
    if (input) input.value = '';
  };

  const handleRemoveBanner = async (key) => {
    if (!window.confirm('Are you sure you want to remove this banner? It will be replaced with default image.')) return;
    
    try {
      // Reset to default image
      const defaultImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="20"%3ENo Banner%3C/text%3E%3C/svg%3E';
      
      if (key === 'heroBanner' || key === 'policyBanner') {
        setBanners(prev => ({ ...prev, [key]: defaultImage }));
      } else {
        setBanners(prev => ({
          ...prev,
          profileTiles: { ...prev.profileTiles, [key]: defaultImage }
        }));
      }
      
      toast.success('Banner removed successfully!');
    } catch (error) {
      console.error('Remove error:', error);
      toast.error('Failed to remove banner');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
        <p className="text-gray-600 mt-2">Upload and manage banner images across the application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bannerTypes.map(({ key, label, current }) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Banner Preview */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium text-gray-700">Current Banner</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveBanner(key)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
                <div className="mt-2 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <img 
                    src={current} 
                    alt={label}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>

              {/* New Banner Upload */}
              {previews[key] && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">New Banner Preview</Label>
                  <div className="mt-2 border-2 border-blue-300 rounded-lg overflow-hidden bg-blue-50 relative">
                    <img 
                      src={previews[key].preview} 
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => handleRemovePreview(key)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* File Input */}
              <div>
                <Label htmlFor={`file-${key}`} className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to select image</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </Label>
                <Input
                  id={`file-${key}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(key, e)}
                  className="hidden"
                />
              </div>

              {/* Upload Button */}
              {previews[key] && (
                <Button 
                  onClick={() => handleUpload(key)}
                  disabled={uploading}
                  className="w-full"
                >
                  {uploading ? 'Uploading...' : 'Upload & Apply'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BannerManagement;