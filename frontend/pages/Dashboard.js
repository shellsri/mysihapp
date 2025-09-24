import React, { useState } from "react";
import { CivicIssue } from "@/entities/CivicIssue";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload,
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ReportIssue() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    location: {
      address: "",
      latitude: null,
      longitude: null
    },
    is_anonymous: false,
    contact_email: ""
  });
  
  const [photos, setPhotos] = useState([]);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    { value: "pothole", label: "Pothole" },
    { value: "streetlight", label: "Street Light" },
    { value: "garbage", label: "Garbage/Waste" },
    { value: "drainage", label: "Drainage Issue" },
    { value: "traffic_signal", label: "Traffic Signal" },
    { value: "water_supply", label: "Water Supply" },
    { value: "park_maintenance", label: "Park Maintenance" },
    { value: "road_maintenance", label: "Road Maintenance" },
    { value: "other", label: "Other" }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePhotoUpload = async (files) => {
    setUploadingPhoto(true);
    try {
      for (const file of files) {
        const { file_url } = await UploadFile({ file });
        setUploadedPhotos(prev => [...prev, file_url]);
        setPhotos(prev => [...prev, file]);
      }
    } catch (error) {
      setError("Failed to upload photos. Please try again.");
    }
    setUploadingPhoto(false);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleInputChange('location.latitude', position.coords.latitude);
          handleInputChange('location.longitude', position.coords.longitude);
          // In a real app, you'd reverse geocode to get the address
          handleInputChange('location.address', ${position.coords.latitude}, ${position.coords.longitude});
        },
        (error) => {
          setError("Unable to get your location. Please enter the address manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const issueData = {
        ...formData,
        photos: uploadedPhotos,
        upvotes: 0,
        upvoted_by: []
      };

      await CivicIssue.create(issueData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate(createPageUrl("Dashboard"));
      }, 2000);
      
    } catch (error) {
      setError("Failed to submit report. Please try again.");
    }
    
    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Report Submitted!</h2>
            <p className="text-slate-600">
              Thank you for helping improve our community. You'll receive updates on your report.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Report a Civic Issue</h1>
          <p className="text-slate-600">Help us make your community better by reporting problems you've noticed.</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Issue Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Brief description of the issue"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide detailed information about the issue..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Minor inconvenience</SelectItem>
                    <SelectItem value="medium">Medium - Moderate impact</SelectItem>
                    <SelectItem value="high">High - Significant problem</SelectItem>
                    <SelectItem value="critical">Critical - Safety hazard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <Label>Location</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.location.address}
                    onChange={(e) => handleInputChange('location.address', e.target.value)}
                    placeholder="Enter address or location description"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    className="flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Use Current
                  </Button>
                </div>
              </div>

              {/* Photos */}
              <div className="space-y-4">
                <Label>Photos (Optional)</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(Array.from(e.target.files))}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Camera className="w-8 h-8 text-slate-400" />
                      <p className="text-slate-600">Click to upload photos or drag and drop</p>
                      <p className="text-sm text-slate-400">PNG, JPG up to 10MB each</p>
                    </div>
                  </label>
                </div>

                {uploadingPhoto && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading photos...</span>
                  </div>
                )}

                {photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={Issue photo ${index + 1}}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={formData.is_anonymous}
                    onCheckedChange={(checked) => handleInputChange('is_anonymous', checked)}
                  />
                  <Label htmlFor="anonymous" className="text-sm font-normal">
                    Submit this report anonymously
                  </Label>
                </div>

                {!formData.is_anonymous && (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email for Updates (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      placeholder="Get notified about status changes"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl("Dashboard"))}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Report
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
