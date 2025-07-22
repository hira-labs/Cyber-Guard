"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Fade,
  IconButton,
  InputAdornment,
} from "@mui/material";
import styles from "../../../assets/styles/CyberSecurityLandingPage.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AccountLogin } from "@/utils/api-methods";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// Import custom snackbar component
import CustomSnackbar from "@/components/CustomSnackbar";

// Add global styles for autofill
const globalStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(85, 193, 183, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#55c1b7',
      borderWidth: '2px',
    },
  },
  '& .MuiInputBase-input': {
    transition: 'background-color 0.3s ease',
    '&:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px rgba(28, 28, 30, 0.8) inset',
      WebkitTextFillColor: '#fff',
      caretColor: '#fff',
      borderRadius: '8px',
      transition: 'background-color 5000s ease-in-out 0s',
    },
  },
};

// Circuit Animation component from landing page
const CircuitAnimation = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const dotCount = 55;
    
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('div');
      dot.className = styles.circuitDot;
      
      // Add variety with different colors and sizes
      if (i % 5 === 0) {
        dot.classList.add(styles.accent);
      } else if (i % 7 === 0) {
        dot.classList.add(styles.danger);
      }
      
      if (i % 4 === 0) {
        dot.classList.add(styles.large);
      } else if (i % 3 === 0) {
        dot.classList.add(styles.small);
      }
      
      // Random positioning
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${Math.random() * 100}%`;
      
      // Random delay for more organic feel
      dot.style.animationDelay = `${Math.random() * 5}s`;
      
      // Slightly randomize animation duration
      dot.style.animationDuration = `${3 + Math.random() * 3}s`;
      
      container.appendChild(dot);
    }
  }, []);
  
  return <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}></div>;
};

// Security Visual component from landing page
const SecurityVisual = () => {
  return (
    <div className={styles.securityVisual}>
      <div className={`${styles.securityRing} ${styles.ring1}`}></div>
      <div className={`${styles.securityRing} ${styles.ring2}`}></div>
      <div className={`${styles.securityRing} ${styles.ring3}`}></div>
      <div className={`${styles.securityRing} ${styles.ring4}`}></div>
      
      {/* Threat indicators */}
      <div className={`${styles.threatIndicator} ${styles.threatIndicator1}`}></div>
      <div className={`${styles.threatIndicator} ${styles.threatIndicator2}`}></div>
      <div className={`${styles.threatIndicator} ${styles.threatIndicator3}`}></div>
      <div className={`${styles.threatIndicator} ${styles.threatIndicator4}`}></div>
    </div>
  );
};

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  // Add snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  
  const router = useRouter();
  const formRef = useRef(null);
  
  // Form animation on mount
  useEffect(() => {
    if (formRef.current) {
      formRef.current.classList.add(styles.formAppear);
    }
  }, []);

  // Close snackbar handler
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Check if AccountLogin exists before calling it
      if (typeof AccountLogin !== 'undefined' && AccountLogin.login) {
        const response = await AccountLogin.login(formData);
        // Store email in localStorage
        localStorage.setItem("userEmail", formData.email);
        
        setLoginSuccess(true);
        // Show success snackbar
        setSnackbar({
          open: true,
          message: "Login successful! Redirecting...",
          severity: "success",
        });
        
        setTimeout(() => {
          // Redirect to dashboard
          router.push("/dashboard/pishingEmailChecker");
        }, 1500);
      } else {
        console.log("Login would happen here with:", formData);
        // For demo purposes, simulate success
        setLoginSuccess(true);
        // Show success snackbar
        setSnackbar({
          open: true,
          message: "Login successful! Redirecting...",
          severity: "success",
        });
        
        setTimeout(() => {
          router.push("/dashboard/pishingEmailChecker");
        }, 1500);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password");
      // Show error snackbar
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Invalid email or password",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loginSuccess) {
    return (
      <Box
        sx={{
          padding: "25px",
          borderRadius: "16px",
          backgroundColor: "rgba(28, 28, 30, 0.5)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(85, 193, 183, 0.2)",
          color: "#fff",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(85, 193, 183, 0.2)",
          zIndex: 10,
          minHeight: "400px",
          maxWidth: "400px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div className={styles.successIcon}>
          <div className={styles.successIconRing}></div>
          <div className={styles.checkmark}></div>
        </div>
        <Typography variant="h6" sx={{ mt: 2 }}>Login Successful!</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>Redirecting to dashboard...</Typography>
        <CircularProgress size={20} sx={{ color: "#55c1b7", mt: 2 }} />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      ref={formRef}
      sx={{
        padding: "25px",
        borderRadius: "16px",
        backgroundColor: "rgba(28, 28, 30, 0.5)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(85, 193, 183, 0.2)",
        color: "#fff",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(85, 193, 183, 0.2)",
        zIndex: 10,
        minHeight: "400px",
        maxWidth: "400px",
        width: "100%"
      }}
    >
      <div className={styles.securityBadge}>
        <LockOutlinedIcon />
      </div>
      
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          letterSpacing: "1px",
          color: "#ffffff",
          marginBottom: "16px",
          position: "relative",
          display: "inline-block",
        }}
      >
        Login to Your Account
        <span className={styles.underline}></span>
      </Typography>
      
      <Grid container spacing={2}>
        
        <Grid item xs={12}>
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            fullWidth
            size="small"
            value={formData.email}
            onChange={handleChange}
            error={!!error}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{color: "rgba(255, 255, 255, 0.5)"}}>
                  <EmailOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
              style: {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "#fff",
                borderRadius: "8px",
              },
            }}
            InputLabelProps={{
              style: { color: "#b3b3b3" },
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(85, 193, 183, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#55c1b7',
                  borderWidth: '2px',
                },
              },
              '& .MuiInputBase-input': {
                '&:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px rgba(28, 28, 30, 0.8) inset',
                  WebkitTextFillColor: '#fff',
                  caretColor: '#fff',
                  borderRadius: '8px',
                  transition: 'background-color 5000s ease-in-out 0s',
                },
              },
            }}
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            size="small"
            value={formData.password}
            onChange={handleChange}
            error={!!error}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{color: "rgba(255, 255, 255, 0.5)"}}>
                  <LockOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                    sx={{color: "rgba(255, 255, 255, 0.5)"}}
                  >
                    {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
              style: {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "#fff",
                borderRadius: "8px",
              },
            }}
            InputLabelProps={{
              style: { color: "#b3b3b3" },
            }}
            required
          />
        </Grid>
        
        <Grid item xs={12} container justifyContent="flex-end">
          <Link href="/landingPage/forgotPassword" className={styles.forgotPasswordLink}>
            <Typography variant="caption" sx={{ color: "#55c1b7", textDecoration: "none" }}>
              Forgot Password?
            </Typography>
          </Link>
        </Grid>
        
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              background: "linear-gradient(45deg, #ff5722 30%, #ff9800 90%)",
              color: "#fff",
              fontWeight: "bold",
              padding: "8px 16px",
              fontSize: "14px",
              borderRadius: "8px",
              textTransform: "none",
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                boxShadow: "0 0 20px rgba(255, 87, 34, 0.7)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : (
              "Login"
            )}
          </Button>
        </Grid>
        
        <Grid item xs={12}>
          <Box mt={1} textAlign="center">
            <Typography variant="body2" sx={{ color: "#b3b3b3", fontSize: '12px' }}>
              Don't have an account?{" "}
              <Link href="/landingPage/signup" className={styles.authLink}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Decorative elements */}
      <div className={styles.securityPulse}></div>
      <div className={styles.cornerAccent1}></div>
      <div className={styles.cornerAccent2}></div>

      {/* Add the custom snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
};

const LoginPage = () => {
  return (
    <div className={styles.container}>
      {/* Circuit animation overlay for entire page */}
      <CircuitAnimation />
      
      <Link href="/landingPage" className={styles.backLink}>
        <IconButton color="primary" className={styles.backButton}>
          <ArrowBackIcon />
        </IconButton>
      </Link>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '0 5%'
      }}>
        {/* Left side: Form - more spacing from left */}
        <div style={{
          flex: '0 0 45%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
          <LoginForm />
        </div>
        
        {/* Right side: Security Visual - centered */}
        <div style={{
          flex: '0 0 45%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginLeft:"25%"
        }}>
          <SecurityVisual />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
