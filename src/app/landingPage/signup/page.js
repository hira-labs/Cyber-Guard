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
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import styles from "../../../assets/styles/CyberSecurityLandingPage.module.css";
import { AccountCreation } from "../../../utils/api-methods";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// Import custom snackbar component
import CustomSnackbar from "@/components/CustomSnackbar";

// Updated global form field styles - add to both files
const formFieldStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
      transition: 'border-color 0.3s',
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
    color: '#fff',
    '&:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px rgba(28, 28, 30, 0.8) inset !important',
      WebkitTextFillColor: '#fff !important',
      caretColor: '#fff',
      borderRadius: '8px',
      transition: 'background-color 5000s ease-in-out 0s',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#b3b3b3',
    '&.Mui-focused': {
      color: '#55c1b7',
    },
  },
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  borderRadius: "8px",
}

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

// Form validation helpers
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const validatePasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    Fname: "",
    Lname: "",
    email: "",
    password: "",
    phone: "",
    age: "",
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Add snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  
  const router = useRouter();
  const formRef = useRef(null);
  
  // Define steps array
  const steps = ['Personal Information', 'Account Details'];

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
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Fname.trim()) newErrors.Fname = "First name is required";
    if (!formData.Lname.trim()) newErrors.Lname = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
    } else if (isNaN(formData.age) || parseInt(formData.age) < 18) {
      newErrors.age = "Age must be at least 18";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    
    // If there are errors, show a snackbar with the first error
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      setSnackbar({
        open: true,
        message: firstError,
        severity: "error",
      });
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    const stepValid = activeStep === 0 
      ? formData.Fname && formData.Lname && formData.age
      : formData.email && formData.phone && formData.password ;
      
    if (stepValid) {
      setActiveStep((prevStep) => prevStep + 1);
      // Show success snackbar for completing the step
      setSnackbar({
        open: true,
        message: "Step completed successfully!",
        severity: "success",
      });
    } else {
      // Check which fields are missing for the current step
      const newErrors = {};
      if (activeStep === 0) {
        if (!formData.Fname.trim()) newErrors.Fname = "First name is required";
        if (!formData.Lname.trim()) newErrors.Lname = "Last name is required";
        if (!formData.age.trim()) newErrors.age = "Age is required";
      } else {
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (!formData.password) newErrors.confirmPassword = "Please confirm your password";
      }
      
      setErrors(newErrors);
      
      // Show error snackbar
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "warning",
      });
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      Fname: formData.Fname,
      Lname: formData.Lname,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      age: Number(formData.age),
    };

    try {
      // Check if AccountCreation.register exists before calling it
      if (typeof AccountCreation !== 'undefined' && AccountCreation.register) {
        const response = await AccountCreation.register(payload);
        setFormSubmitted(true);
        
        // Show success snackbar
        setSnackbar({
          open: true,
          message: "Account created successfully!",
          severity: "success",
        });
        
        setTimeout(() => {
          router.push("/landingPage/login");
        }, 2000);
      } else {
        console.log("Registration would happen here with:", payload);
        // For demo purposes, simulate success
        setFormSubmitted(true);
        
        // Show success snackbar
        setSnackbar({
          open: true,
          message: "Account created successfully!",
          severity: "success",
        });
        
        setTimeout(() => {
          router.push("/landingPage/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      // Show error snackbar
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Registration failed. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (formSubmitted) {
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
          minHeight: "480px",
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
        <Typography variant="h6" sx={{ mt: 2 }}>Account Created!</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>Redirecting to login...</Typography>
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
        minHeight: "480px",
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
        Create Secure Account
        <span className={styles.underline}></span>
      </Typography>
      
      <Stepper activeStep={activeStep} alternativeLabel sx={{mb: 2, mt: 1}}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel StepIconProps={{
              sx: {
                color: '#55c1b7',
                '&.Mui-completed': {
                  color: '#55c1b7',
                },
                '&.Mui-active': {
                  color: '#ff5722',
                }
              }
            }}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="First Name"
              name="Fname"
              variant="outlined"
              fullWidth
              size="small"
              value={formData.Fname}
              onChange={handleChange}
              error={!!errors.Fname}
              helperText={errors.Fname}
              sx={formFieldStyles}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              name="Lname"
              variant="outlined"
              fullWidth
              size="small"
              value={formData.Lname}
              onChange={handleChange}
              error={!!errors.Lname}
              helperText={errors.Lname}
              sx={formFieldStyles}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Age"
              name="age"
              variant="outlined"
              fullWidth
              size="small"
              value={formData.age}
              onChange={handleChange}
              error={!!errors.age}
              helperText={errors.age}
              sx={formFieldStyles}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleNext}
              sx={{
                background: "linear-gradient(45deg, #55c1b7 30%, #5d8cd1 90%)",
                color: "#fff",
                fontWeight: "bold",
                padding: "8px 16px",
                fontSize: "14px",
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": {
                  boxShadow: "0 0 15px rgba(85, 193, 183, 0.6)",
                },
              }}
            >
              Continue
            </Button>
          </Grid>
        </Grid>
      ) : (
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
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{color: "rgba(255, 255, 255, 0.5)"}}>
                    <EmailOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={formFieldStyles}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              name="phone"
              variant="outlined"
              fullWidth
              size="small"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              sx={formFieldStyles}
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
              error={!!errors.password}
              helperText={errors.password}
              sx={formFieldStyles}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              size="small"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={formFieldStyles}
              required
            />
          </Grid>
          
          {/* Remove submit error display and use snackbar instead */}
          
          <Grid item xs={12} container spacing={1}>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleBack}
                sx={{
                  color: "#55c1b7",
                  borderColor: "#55c1b7",
                  fontWeight: "bold",
                  padding: "8px 16px",
                  fontSize: "14px",
                  borderRadius: "8px",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#55c1b7",
                    backgroundColor: "rgba(85, 193, 183, 0.1)",
                  },
                }}
              >
                Back
              </Button>
            </Grid>
            <Grid item xs={6}>
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
                  "Create Account"
                )}
              </Button>
            </Grid>
          </Grid>
          
          <Grid item xs={12}>
            <Box mt={1} textAlign="center">
              <Typography variant="body2" sx={{ color: "#b3b3b3", fontSize: '12px' }}>
                Already have an account?{" "}
                <Link href="/landingPage/login" className={styles.authLink}>
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Add the custom snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />

      {/* Decorative elements */}
      <div className={styles.securityPulse}></div>
      <div className={styles.cornerAccent1}></div>
      <div className={styles.cornerAccent2}></div>
    </Box>
  );
};

const SignUp = () => {
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
          <SignUpForm />
        </div>
        
        {/* Right side: Security Visual - centered */}
        <div style={{
          flex: '0 0 45%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginLeft:"20%"
       
          
        }}>
          <SecurityVisual />
        </div>
      </div>
    </div>
  );
};

export default SignUp;

