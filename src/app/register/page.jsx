'use client'
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import '../login/login.css';
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/img/coursehab-high-resolution-logo.png";
import { useRouter } from "next/navigation";



const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profileImage: "",
  });
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const router = useRouter();

    
const uploadImageToServer = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await axios.post(`${BASE_URL}/api/upload-image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.file.url; // هنا هنرجع اللينك بس
};

    
    
    
const handleChange = (e) => {
  const { name, value, files } = e.target;
  if (name === "profileImage") {
    const file = files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file }); // خليها الملف نفسه مؤقتًا
    }
  } else {
    setFormData({ ...formData, [name]: value });
  }
};
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let imageUrl = "";

    // لو المستخدم رفع صورة بنفسه
    if (formData.profileImage && typeof formData.profileImage !== "string") {
      imageUrl = await uploadImageToServer(formData.profileImage);
    }

    const finalData = {
      ...formData,
      profileImage: imageUrl || undefined, // لو مفيش صورة، يسيبها فاضية
    };

    await axios.post(`${BASE_URL}/api/users`, finalData);
    toast.success("Account created successfully!");
    router.replace("/login");
  } catch (error) {
    toast.error(error.response?.data?.message || "Error occurred");
  }
};



  return (
<section className="login register">
<div className="form_log_container">
<div className="form_log">
<Image width={100} height={100} src={logo} alt="logo" />
<Typography variant="h5" gutterBottom>Sign In</Typography>
<Typography variant="body2" color="textSecondary" gutterBottom> Join us by creating a free account</Typography>            
    
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: "auto", mt: 4 }}
    >

      <Stack spacing={2}>
        <TextField
          label="First Name"
          name="firstName"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          label="Last Name"
          name="lastName"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          onChange={handleChange}
        />
        <Button component="label">
          Upload Profile Image
          <input
            type="file"
            hidden
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
          />
        </Button>
        {formData.profileImage && (
          <Avatar
            src={formData.profileImage}
            sx={{ width: 56, height: 56 }}
          />
        )}
        <Button     className="login_btn " variant="contained" color="primary" type="submit">
          Register
        </Button>
      </Stack>
      
                      
  <Typography variant="body2" color="textSecondary" align="center" mt={2}>
    I have an account <Link href="/login">Sign In</Link>
  </Typography>                      
    </Box>  
</div>
</div>  
</section>
  );
};

export default Register;



