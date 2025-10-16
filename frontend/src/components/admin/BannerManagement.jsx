import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Image as ImageIcon, Upload, Trash2, Plus, Save, X, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../ui/tabs';

const BannerManagement = () => {
  const [bannerImages, setBannerImages] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editType, setEditType] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      console.log('Fetching sliders from:', `${backendUrl}/api/home-sliders`);
      
      const response = await fetch(`${backendUrl}/api/home-sliders`);
      console.log('Sliders response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Sliders data:', data);
        setBannerImages(data.bannerImages || []);
        setGalleryImages(data.galleryImages || []);
        toast.success(`Loaded ${data.bannerImages?.length || 0} banner images and ${data.galleryImages?.length || 0} gallery images`);
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to load sliders: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching sliders:', error);
      toast.error(`Failed to load sliders: ${error.message}`);
      // Set default images on error
      setBannerImages([
        "/images/smart-world-orchard.webp",
        "/images/smart-world-one-dxp.webp",
        "/images/smart-world-gems.webp",
        "/images/smart-world-the-edition.webp",
        "/images/smart-world-sky-arc.webp"
      ]);
      setGalleryImages([
        "/images/gallery-1.jpg",
        "/images/gallery-2.jpg",
        "/images/gallery-3.jpeg",
        "/images/gallery-4.jpg",
        "/images/gallery-5.jpg"
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
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

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (type) => {
    if (!selectedFile && !imageUrl) {
      toast.error('Please select an image or enter an image URL');
      return;
    }

    setUploading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      let finalImageUrl = imageUrl;

      // If file is selected, upload it first
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('bannerType', type);

        const uploadResponse = await fetch(`${backendUrl}/api/upload-banner`, {
          method: 'POST',
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        finalImageUrl = uploadData.imageUrl;
      }

      // Now add/update the slider
      if (editingIndex !== null) {
        // Update existing image
        const endpoint = type === 'banner' 
          ? `${backendUrl}/api/home-sliders/banner/${editingIndex}`
          : `${backendUrl}/api/home-sliders/gallery/${editingIndex}`;

        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: finalImageUrl })
        });

        if (!response.ok) throw new Error('Failed to update image');
        
        toast.success('Image updated successfully!');
      } else {
        // Add new image
        const endpoint = type === 'banner'
          ? `${backendUrl}/api/home-sliders/banner`
          : `${backendUrl}/api/home-sliders/gallery`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: finalImageUrl })
        });

        if (!response.ok) throw new Error('Failed to add image');

        toast.success('Image added successfully!');
      }

      // Refresh sliders
      await fetchSliders();
      handleCloseDialog();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to process image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (type, index) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const endpoint = type === 'banner'
        ? `${backendUrl}/api/home-sliders/banner/${index}`
        : `${backendUrl}/api/home-sliders/gallery/${index}`;

      const response = await fetch(endpoint, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete image');

      toast.success('Image deleted successfully!');
      await fetchSliders();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleOpenDialog = (type, index = null) => {
    setEditType(type);
    setEditingIndex(index);
    setIsDialogOpen(true);

    if (index !== null) {
      const currentUrl = type === 'banner' 
        ? bannerImages[index] 
        : galleryImages[index];
      setImageUrl(currentUrl);
      setPreview(currentUrl);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedFile(null);
    setPreview('');
    setImageUrl('');
    setEditingIndex(null);
    setEditType('');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Home Page Slider Management</h2>
          <p className="text-gray-600 mt-1">Manage banner and gallery images for the Home page</p>
        </div>
        <Button 
          onClick={fetchSliders}
          variant="outline"
          className="flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="banner" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="banner">Project Banner Slider</TabsTrigger>
          <TabsTrigger value="gallery">Company Gallery Slider</TabsTrigger>
        </TabsList>

        {/* Banner Images Tab */}
        <TabsContent value="banner" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Project Banner Images</CardTitle>
                <Button
                  onClick={() => handleOpenDialog('banner')}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Banner Image
                </Button>
              </div>
              <p className="text-sm text-gray-600">These images appear in the main rotating banner on the Home page</p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : bannerImages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No banner images yet. Add your first banner image!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bannerImages.map((image, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="relative aspect-video">
                        <img
                          src={image}
                          alt={`Banner ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                          }}
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleOpenDialog('banner', index)}
                            className="bg-white/90 hover:bg-white"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete('banner', index)}
                            className="bg-red-500/90 hover:bg-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50">
                        <p className="text-xs text-gray-600 truncate">Position: {index + 1}</p>
                        <p className="text-xs text-gray-500 truncate">{image}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gallery Images Tab */}
        <TabsContent value="gallery" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Company Gallery Images</CardTitle>
                <Button
                  onClick={() => handleOpenDialog('gallery')}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Gallery Image
                </Button>
              </div>
              <p className="text-sm text-gray-600">These images appear in the company photo gallery slider on the Home page</p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : galleryImages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No gallery images yet. Add your first gallery image!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryImages.map((image, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="relative aspect-video">
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                          }}
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleOpenDialog('gallery', index)}
                            className="bg-white/90 hover:bg-white"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete('gallery', index)}
                            className="bg-red-500/90 hover:bg-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50">
                        <p className="text-xs text-gray-600 truncate">Position: {index + 1}</p>
                        <p className="text-xs text-gray-500 truncate">{image}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Image Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? 'Edit' : 'Add'} {editType === 'banner' ? 'Banner' : 'Gallery'} Image
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Image URL Input */}
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                placeholder="Enter image URL (e.g., https://example.com/image.jpg or /images/photo.jpg)"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  if (e.target.value) {
                    setPreview(e.target.value);
                    setSelectedFile(null);
                  }
                }}
              />
              <p className="text-xs text-gray-500">Enter a full URL or a path to an image in the /public/images folder</p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">OR</span>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Upload Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(imageUrl || '');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">Upload an image file (max 5MB)</p>
            </div>

            {/* Preview */}
            {preview && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="relative aspect-video border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200?text=Preview+Not+Available';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleUpload(editType)}
                disabled={uploading || (!selectedFile && !imageUrl)}
              >
                {uploading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    {editingIndex !== null ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingIndex !== null ? 'Update' : 'Add'} Image
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BannerManagement;
