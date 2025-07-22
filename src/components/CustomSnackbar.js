import React, { forwardRef } from 'react';
import { Snackbar, Alert as MuiAlert, Box } from '@mui/material';
import styles from "../assets/styles/customSnackbar.module.css";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

// Custom styled Alert component
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomSnackbar = ({ 
  open, 
  message, 
  severity = "error", 
  onClose, 
  autoHideDuration = 5000,
  position = { vertical: 'bottom', horizontal: 'center' }
}) => {
  // Icon based on severity
  const getIcon = () => {
    switch(severity) {
      case 'success':
        return <CheckCircleOutlineIcon fontSize="small" />;
      case 'error':
        return <ErrorOutlineIcon fontSize="small" />;
      case 'warning':
        return <WarningAmberOutlinedIcon fontSize="small" />;
      case 'info':
        return <InfoOutlinedIcon fontSize="small" />;
      default:
        return <InfoOutlinedIcon fontSize="small" />;
    }
  };

  // Color scheme based on severity
  const getColors = () => {
    switch(severity) {
      case 'success':
        return {
          background: 'rgba(46, 125, 50, 0.9)',
          borderColor: '#55c1b7',
          glow: '0 0 15px rgba(85, 193, 183, 0.6)'
        };
      case 'error':
        return {
          background: 'rgba(211, 47, 47, 0.9)',
          borderColor: '#ff5252',
          glow: '0 0 15px rgba(255, 82, 82, 0.6)'
        };
      case 'warning':
        return {
          background: 'rgba(237, 108, 2, 0.9)',
          borderColor: '#ff9800',
          glow: '0 0 15px rgba(255, 152, 0, 0.6)'
        };
      case 'info':
        return {
          background: 'rgba(2, 136, 209, 0.9)',
          borderColor: '#5d8cd1',
          glow: '0 0 15px rgba(93, 140, 209, 0.6)'
        };
      default:
        return {
          background: 'rgba(28, 28, 30, 0.9)',
          borderColor: '#55c1b7',
          glow: '0 0 15px rgba(85, 193, 183, 0.6)'
        };
    }
  };

  const colors = getColors();

  return (
    <Snackbar
      anchorOrigin={position}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
    >
      <Box
        sx={{
          backgroundColor: colors.background,
          backdropFilter: "blur(10px)",
          color: "#ffffff",
          border: `1px solid ${colors.borderColor}`,
          borderRadius: "8px",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5), ${colors.glow}`,
          maxWidth: "350px",
          width: "100%",
          position: "relative",
          overflow: "hidden"
        }}
        className={styles.customSnackbar}
      >
        {/* Security circuit animation dots */}
        <div className={styles.cornerAccent1} style={{ opacity: 0.4 }}></div>
        <div className={styles.cornerAccent2} style={{ opacity: 0.4 }}></div>
        
        {/* Icon */}
        <Box 
          sx={{ 
            mr: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {getIcon()}
        </Box>
        
        {/* Message */}
        <Box sx={{ flexGrow: 1 }}>
          {message}
        </Box>
      </Box>
    </Snackbar>
  );
};

export default CustomSnackbar;