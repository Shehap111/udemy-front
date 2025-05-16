"use client";
import { useEffect, useState } from "react";
import {
  TextField, Button, Typography,
  FormControl, InputLabel, Select, MenuItem,
  Box, CircularProgress, CardMedia, FormControlLabel, Switch
} from "@mui/material";
import { toast } from "react-toastify";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const AddCourse = () => {
  // State for form data
  const [formData, setFormData] = useState({
    title: { en: "", ar: "", de: "", es: "" },
    description: { en: "", ar: "", de: "", es: "" },
    image: "",
    price: 0,
    instructor: { name: "", image: "" },
    categoryId: "",
    isActive: true,
    purchasesCount: 0
  });
  
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [instructorImagePreview, setInstructorImagePreview] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();
        setCategories(data.data || data);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle multilingual field changes
  const handleLangFieldChange = (field, lang, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value }
    }));
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();
      return data.file.path; // Cloudinary URL
    } catch (error) {
      toast.error('Image upload failed');
      throw error;
    }
  };

  // Handle image upload
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (e.g., 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "course") {
        setImagePreview(reader.result);
      } else {
        setInstructorImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);

    try {
      const imageUrl = await uploadToCloudinary(file);

      if (type === "course") {
        handleInputChange("image", imageUrl);
      } else {
        handleInputChange("instructor", {
          ...formData.instructor,
          image: imageUrl
        });
      }

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      if (type === "course") {
        setImagePreview("");
        handleInputChange("image", "");
      } else {
        setInstructorImagePreview("");
        handleInputChange("instructor", {
          ...formData.instructor,
          image: ""
        });
      }
    } finally {
      setIsUploading(false);
      e.target.value = ""; // Reset file input
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    const requiredLanguages = ['en', 'ar', 'de', 'es'];
    for (const lang of requiredLanguages) {
      if (!formData.title[lang]?.trim()) {
        toast.error(`Title is required in ${lang.toUpperCase()}`);
        setIsLoading(false);
        return;
      }
      if (!formData.description[lang]?.trim()) {
        toast.error(`Description is required in ${lang.toUpperCase()}`);
        setIsLoading(false);
        return;
      }
    }

    if (!formData.image) {
      toast.error("Course image is required");
      setIsLoading(false);
      return;
    }

    if (!formData.instructor.name.trim()) {
      toast.error("Instructor name is required");
      setIsLoading(false);
      return;
    }

    if (!formData.instructor.image) {
      toast.error("Instructor image is required");
      setIsLoading(false);
      return;
    }

    if (!formData.categoryId) {
      toast.error("Category is required");
      setIsLoading(false);
      return;
    }

    if (formData.price <= 0) {
      toast.error("Price must be greater than 0");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/courses/add-course", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create course");
      }

      toast.success("Course created successfully!");
      
      // Reset form
      setFormData({
        title: { en: "", ar: "", de: "", es: "" },
        description: { en: "", ar: "", de: "", es: "" },
        image: "",
        price: 0,
        instructor: { name: "", image: "" },
        categoryId: "",
        isActive: true,
        purchasesCount: 0
      });
      setImagePreview("");
      setInstructorImagePreview("");

    } catch (error) {
      toast.error(error.message || "Error creating course");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>Add New Course</Typography>

      {/* Basic Information Section */}
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Basic Information</Typography>
      
      {/* Course Title */}
      <Typography variant="h6" gutterBottom>Course Title</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mb: 3 }}>
        <TextField
          label="English Title"
          value={formData.title.en}
          onChange={(e) => handleLangFieldChange("title", "en", e.target.value)}
          required
        />
        <TextField
          label="Arabic Title"
          value={formData.title.ar}
          onChange={(e) => handleLangFieldChange("title", "ar", e.target.value)}
          required
        />
        <TextField
          label="German Title"
          value={formData.title.de}
          onChange={(e) => handleLangFieldChange("title", "de", e.target.value)}
          required
        />
        <TextField
          label="Spanish Title"
          value={formData.title.es}
          onChange={(e) => handleLangFieldChange("title", "es", e.target.value)}
          required
        />
      </Box>

      {/* Course Description */}
      <Typography variant="h6" gutterBottom>Course Description</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mb: 3 }}>
        <TextField
          label="English Description"
          value={formData.description.en}
          onChange={(e) => handleLangFieldChange("description", "en", e.target.value)}
          multiline
          rows={3}
          required
        />
        <TextField
          label="Arabic Description"
          value={formData.description.ar}
          onChange={(e) => handleLangFieldChange("description", "ar", e.target.value)}
          multiline
          rows={3}
          required
        />
        <TextField
          label="German Description"
          value={formData.description.de}
          onChange={(e) => handleLangFieldChange("description", "de", e.target.value)}
          multiline
          rows={3}
          required
        />
        <TextField
          label="Spanish Description"
          value={formData.description.es}
          onChange={(e) => handleLangFieldChange("description", "es", e.target.value)}
          multiline
          rows={3}
          required
        />
      </Box>

      {/* Media Section */}
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Media</Typography>
      
      {/* Course Image */}
      <Typography variant="h6" gutterBottom>Course Image</Typography>
      <Box sx={{ display: "flex", gap: 3, mb: 3, alignItems: "center" }}>
        <Box sx={{ 
          width: 150, 
          height: 150, 
          border: "1px dashed #ccc", 
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative'
        }}>
          {imagePreview ? (
            <CardMedia
              component="img"
              image={imagePreview}
              alt="Course preview"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Box sx={{ 
              width: "100%", 
              height: "100%", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center",
              color: "#666"
            }}>
              <CloudUploadIcon fontSize="large" />
              <Typography variant="caption">Course Image</Typography>
            </Box>
          )}
        </Box>
        <Box>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Image"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "course")}
            />
          </Button>
          {formData.image && (
            <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 1 }}>
              Image uploaded successfully
            </Typography>
          )}
        </Box>
      </Box>

      {/* Instructor Information */}
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Instructor Information</Typography>
      
      <Box sx={{ display: "flex", gap: 3, mb: 3, alignItems: "center" }}>
        <Box sx={{ 
          width: 100, 
          height: 100, 
          border: "1px dashed #ccc", 
          borderRadius: "50%",
          overflow: 'hidden',
          position: 'relative'
        }}>
          {instructorImagePreview ? (
            <CardMedia
              component="img"
              image={instructorImagePreview}
              alt="Instructor preview"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Box sx={{ 
              width: "100%", 
              height: "100%", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center",
              color: "#666"
            }}>
              <CloudUploadIcon fontSize="medium" />
              <Typography variant="caption" sx={{ fontSize: 10 }}>Instructor</Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            label="Instructor Name"
            value={formData.instructor.name}
            onChange={(e) => handleInputChange("instructor", {
              ...formData.instructor,
              name: e.target.value
            })}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            fullWidth
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Instructor Image"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "instructor")}
            />
          </Button>
          {formData.instructor.image && (
            <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 1 }}>
              Instructor image uploaded
            </Typography>
          )}
        </Box>
      </Box>

      {/* Pricing & Organization */}
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Pricing & Organization</Typography>
      
      {/* Course Price */}
      <TextField
        label="Price"
        type="number"
        value={formData.price}
        onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
        required
        sx={{ mb: 3 }}
        InputProps={{ inputProps: { min: 0, step: 0.01 } }}
        fullWidth
      />

      {/* Category Selection */}
      <FormControl fullWidth sx={{ mb: 3 }} required>
        <InputLabel>Category</InputLabel>
        <Select
          value={formData.categoryId}
          onChange={(e) => handleInputChange("categoryId", e.target.value)}
          label="Category"
        >
          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.title?.en || category.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Status Section */}
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Status</Typography>
      
      <FormControlLabel
        control={
          <Switch
            checked={formData.isActive}
            onChange={(e) => handleInputChange("isActive", e.target.checked)}
          />
        }
        label="Active Course"
        sx={{ mb: 3 }}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isLoading || isUploading}
        sx={{ mt: 3 }}
        fullWidth
      >
        {isLoading ? <CircularProgress size={24} /> : "Create Course"}
      </Button>
    </Box>
  );
};

export default AddCourse;