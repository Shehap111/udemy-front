"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { useRouter } from "next/navigation";
import './login.css';

import {
  TextField,
  Button,
  Typography,
  Box
} from "@mui/material";

import Image from "next/image";
import logo from "../../../public/img/coursehab-high-resolution-logo.png";
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await dispatch(loginUser({ email, password })).unwrap();
      console.log("User logged in:", user);
      router.replace("/");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <section className="login">
      <div className="form_log_container">
        <div className="form_log">
          <form onSubmit={handleSubmit} className="">
            <Image src={logo} alt="logo" width={100} height={100} />
            <Typography variant="h5" gutterBottom>
              Sign In
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Welcome back Wick
            </Typography>

            {error && (
              <Typography color="error" variant="body2">
                {error?.message || "Login failed"}
              </Typography>
            )}

            <div>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
            </div>

            <div>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              className="login_btn"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Box display="flex" alignItems="center" width="100%" my={4}>
              <Box
                flex={1}
                height="1px"
                sx={{
                  backgroundImage: "linear-gradient(to right, rgba(33,38,45,0), #46494D)",
                }}
              />
              <Typography
                variant="body2"
                className="login_or"
                sx={{ mx: 2, color: "#fff" }}
              >
                OR SignIn With
              </Typography>
              <Box
                flex={1}
                height="1px"
                sx={{
                  backgroundImage: "linear-gradient(to left, rgba(33,38,45,0), #46494D)",
                }}
              />
            </Box>

            <Box display="flex" gap={2} justifyContent="center" mt={2}>
              <Button
                variant="outlined"
                startIcon={<GoogleIcon />}
                sx={{
                  borderColor: '#DB4437',
                  color: '#DB4437',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#DB44371A',
                    borderColor: '#DB4437',
                  },
                }}
                onClick={() => console.log("Google Login")}
              >
                Google
              </Button>

              <Button
                variant="outlined"
                startIcon={<FacebookIcon />}
                sx={{
                  borderColor: '#1877F2',
                  color: '#1877F2',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#1877F21A',
                    borderColor: '#1877F2',
                  },
                }}
                onClick={() => console.log("Facebook Login")}
              >
                Facebook
              </Button>
            </Box>

            <Typography variant="body2" color="textSecondary" align="center" mt={2}>
              Don't have an account?{" "}
              <Link href="/register">Sign Up</Link>
            </Typography>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;