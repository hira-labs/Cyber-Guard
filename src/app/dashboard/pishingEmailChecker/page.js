"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Container,
  Grid,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import { SecurityFeatures } from "@/utils/api-methods";
import InfoIcon from '@mui/icons-material/Info';
import EmailIcon from '@mui/icons-material/Email';
import ShieldIcon from '@mui/icons-material/Shield';
import styles from "../../../assets/styles/PhishingEmailChecker.module.css";

// Circuit Animation component from landing page
const CircuitAnimation = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const dotCount = 35; // Increased number of dots

    // Clear any existing dots
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Create circuit dots with more variety
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

const PhishingEmailChecker = () => {
  const [senderAddress, setSenderAddress] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = {
      senderEmail: senderAddress,
      emailContent: emailContent,
    };

    try {
      const response = await SecurityFeatures.EmailChecker(formData);
      setResult(response?.data || { isPhishing: false, message: "No phishing detected" });
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Apollo.io inspired animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Circuit animation overlay */}
      <CircuitAnimation />
      
      {/* Main content wrapper */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={styles.contentContainer}
      >
        {/* Header with animation */}
        <motion.div variants={itemVariants}>
          <Box 
            sx={{ 
              textAlign: "center", 
              mb: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20 
              }}
              className={styles.iconPulse}
            >
              <ShieldIcon 
                sx={{ 
                  fontSize: { xs: 60, sm: 80 }, 
                  color: "#6d5bff",
                  mb: 2  
                }} 
              />
            </motion.div>
            
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.8rem', sm: '2.5rem' },
                background: "linear-gradient(90deg, #6d5bff, #e46bff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
                textShadow: "0 0 30px rgba(109, 91, 255, 0.3)"
              }}
            >
              Phishing Email Checker
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                maxWidth: "700px",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: { xs: '0.9rem', sm: '1rem' },
                px: 2
              }}
            >
              Protect yourself from malicious emails by scanning suspicious messages
            </Typography>
          </Box>
        </motion.div>

        {/* Main content */}
        <Grid container spacing={3} sx={{ width: '100%', mx: 0 }}>
          {/* Left side - Form */}
          <Grid item xs={12} md={7} sx={{ px: { xs: 0, sm: 1 } }}>
            <motion.div variants={itemVariants}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: { xs: 2, sm: 3, md: 4 }, 
                  borderRadius: 3,
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  height: '100%'
                }}
              >
                <form>
                  <Box mb={3}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        mb: 1, 
                        fontWeight: 500,
                        color: "rgba(255, 255, 255, 0.9)" 
                      }}
                    >
                      Sender's Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      value={senderAddress}
                      onChange={(e) => setSenderAddress(e.target.value)}
                      placeholder="example@domain.com"
                      InputProps={{
                        startAdornment: <EmailIcon color="action" sx={{ mr: 1, color: "rgba(255, 255, 255, 0.5)" }} />,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "rgba(255, 255, 255, 0.05)",
                          color: "rgba(255, 255, 255, 0.9)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(109, 91, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#6d5bff",
                          }
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: "rgba(255, 255, 255, 0.5)",
                          opacity: 1,
                        }
                      }}
                    />
                  </Box>
                  
                  <Box mb={3}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        mb: 1, 
                        fontWeight: 500, 
                        display: "flex", 
                        alignItems: "center",
                        color: "rgba(255, 255, 255, 0.9)" 
                      }}
                    >
                      Email Content
                      <Tooltip title="Paste the full email content including headers for better analysis">
                        <IconButton size="small" sx={{ ml: 1 }}>
                          <InfoIcon fontSize="small" sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      placeholder="Paste the complete email content here"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "rgba(255, 255, 255, 0.05)",
                          color: "rgba(255, 255, 255, 0.9)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(109, 91, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#6d5bff",
                          }
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: "rgba(255, 255, 255, 0.5)",
                          opacity: 1,
                        }
                      }}
                    />
                  </Box>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={checkEmail}
                      disabled={loading || !senderAddress || !emailContent}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ShieldIcon />}
                      sx={{
                        background: "linear-gradient(90deg, #6d5bff, #e46bff)",
                        color: "#fff",
                        fontWeight: "bold",
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1rem",
                        boxShadow: "0 4px 14px 0 rgba(109, 91, 255, 0.39)",
                        "&:hover": {
                          boxShadow: "0 6px 20px 0 rgba(109, 91, 255, 0.5)",
                        },
                        "&:disabled": {
                          background: "rgba(255, 255, 255, 0.12)",
                          color: "rgba(255, 255, 255, 0.3)",
                        }
                      }}
                    >
                      {loading ? "Analyzing..." : "Check for Phishing Threats"}
                    </Button>
                  </motion.div>
                </form>
              </Paper>
            </motion.div>
          </Grid>

          {/* Right side - Results */}
          <Grid item xs={12} md={5} sx={{ px: { xs: 0, sm: 1 } }}>
            <motion.div variants={itemVariants}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: { xs: 2, sm: 3, md: 4 }, 
                  height: '100%', 
                  minHeight: '300px',
                  borderRadius: 3,
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)"
                }}
              >
                {!loading && !result && !error && (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        transition: { 
                          repeat: Infinity, 
                          duration: 3,
                          ease: "easeInOut" 
                        }
                      }}
                      className={styles.floatAnimation}
                    >
                      <ShieldIcon 
                        sx={{ 
                          fontSize: { xs: 60, sm: 80 }, 
                          color: "#6d5bff", 
                          opacity: 0.7, 
                          mb: 2,
                          filter: "drop-shadow(0 0 10px rgba(109, 91, 255, 0.5))"
                        }} 
                      />
                    </motion.div>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: 500,
                        color: "rgba(255, 255, 255, 0.9)" 
                      }}
                    >
                      Ready to Analyze
                    </Typography>
                    <Typography color="rgba(255, 255, 255, 0.7)">
                      Enter an email address and content to check for phishing threats
                    </Typography>
                  </Box>
                )}

                {loading && (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        transition: { 
                          repeat: Infinity, 
                          duration: 2,
                          ease: "linear" 
                        }
                      }}
                      style={{ display: "inline-block", marginBottom: "20px" }}
                      className={styles.scanAnimation}
                    >
                      <CircularProgress 
                        size={80} 
                        thickness={4} 
                        sx={{ 
                          color: "#6d5bff",
                          boxShadow: "0 0 15px rgba(109, 91, 255, 0.6)"
                        }} 
                      />
                    </motion.div>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 500,
                        color: "rgba(255, 255, 255, 0.9)" 
                      }}
                    >
                      Analyzing Email Content
                    </Typography>
                    <Typography 
                      color="rgba(255, 255, 255, 0.7)" 
                      sx={{ mt: 1 }}
                    >
                      Our AI is checking for suspicious patterns...
                    </Typography>
                  </Box>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(244, 67, 54, 0.1)",
                        color: "#f44336",
                        border: "1px solid rgba(244, 67, 54, 0.3)"
                      }}
                    >
                      {error}
                    </Alert>
                    <Typography 
                      variant="body2" 
                      color="rgba(255, 255, 255, 0.7)" 
                      sx={{ mt: 2 }}
                    >
                      Please try again or contact support if the problem persists.
                    </Typography>
                  </motion.div>
                )}

                {result && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <Paper 
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: result.isPhishing === true ? "rgba(244, 67, 54, 0.1)" : "rgba(76, 175, 80, 0.1)",
                        border: `1px solid ${result.isPhishing === true ? "rgba(244, 67, 54, 0.3)" : "rgba(76, 175, 80, 0.3)"}`,
                        mb: 3
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            transition: { 
                              repeat: 3, 
                              duration: 0.5 
                            }
                          }}
                          className={result.isPhishing === true ? styles.pulseRed : styles.pulseGreen}
                        >
                          {result.isPhishing === true ? (
                            <ShieldIcon 
                              sx={{ 
                                color: "#f44336", 
                                fontSize: 40, 
                                mr: 2,
                                filter: "drop-shadow(0 0 8px rgba(244, 67, 54, 0.6))" 
                              }} 
                            />
                          ) : (
                            <ShieldIcon 
                              sx={{ 
                                color: "#4caf50", 
                                fontSize: 40, 
                                mr: 2,
                                filter: "drop-shadow(0 0 8px rgba(76, 175, 80, 0.6))" 
                              }} 
                            />
                          )}
                        </motion.div>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            color: result.isPhishing === true ? "#f44336" : "#4caf50"
                          }}
                        >
                          {result.isPhishing === true ? "Phishing Detected" : "No Phishing Detected"}
                        </Typography>
                      </Box>
                      
                      <Typography 
                        variant="body1" 
                        sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                      >
                        {typeof result === 'string' ? result : (
                          result.isPhishing === true 
                            ? "This email contains suspicious elements commonly found in phishing attempts." 
                            : "This email appears to be legitimate based on our analysis."
                        )}
                      </Typography>
                    </Paper>
                    
                    {result.isPhishing === true && (
                      <Alert 
                        severity="warning" 
                        sx={{ 
                          borderRadius: 2,
                          bgcolor: "rgba(255, 193, 7, 0.1)",
                          border: "1px solid rgba(255, 193, 7, 0.3)",
                          "& .MuiAlert-message": { width: "100%" },
                          color: "rgba(255, 193, 7, 0.9)"
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ mb: 1, color: "rgba(255, 255, 255, 0.9)" }}>Security Recommendations:</Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
                          - Do not click on any links in the email<br />
                          - Do not download any attachments<br />
                          - Do not reply to the sender<br />
                          - Report the email to your IT department
                        </Typography>
                      </Alert>
                    )}
                  </motion.div>
                )}
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </div>
  );
};

export default PhishingEmailChecker;
