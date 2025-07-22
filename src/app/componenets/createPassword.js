"use client"; // Mark as client-side component

import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Slider,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion"; // For smooth animations
import { SecurityFeatures } from "@/utils/api-methods";

const CreatePassword = () => {
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading
  const [passwordLength, setPasswordLength] = useState(16);
  const [strength, setStrength] = useState(3); // 1: weak, 2: medium, 3: strong
  const [includeSpecialChars, setIncludeSpecialChars] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message

  const handleAccountNameChange = (e) => {
    setAccountName(e.target.value);
  };

  const handlePasswordLengthChange = (event, newValue) => {
    setPasswordLength(newValue);
  };

  const handleStrengthChange = (event, newValue) => {
    setStrength(newValue);
  };

  const handleSpecialCharsToggle = (event) => {
    setIncludeSpecialChars(event.target.checked);
  };

  const generatePassword = async () => {
    setLoading(true); // Set loading to true when password generation starts
    try {
      const response = await SecurityFeatures.suggestPassword({
        accountName,
        length: passwordLength,
        strength:
          strength === 3 ? "strong" : strength === 2 ? "medium" : "weak",
        includeSpecialChars,
      });
      if (response && response.data.suggestedPassword) {
        setPassword(response.data.suggestedPassword);
        setIsPasswordGenerated(true);
      } else {
        console.error("Password generation failed: Invalid response", response);
      }
    } catch (error) {
      console.error("Error generating password:", error);
    } finally {
      setLoading(false); // Set loading to false when the process finishes
    }
  };

  const regeneratePassword = () => {
    generatePassword(); // Re-trigger password generation with same account name
  };

  const handleSavePassword = async () => {
    if (!accountName || !password) {
      setSnackbarMessage("Please generate a password and provide an account name before saving.");
      setSnackbarOpen(true);
      return;
    }

    const email = localStorage.getItem("userEmail"); // Fetch email from localStorage
    if (!email) {
      setSnackbarMessage("User email not found in localStorage.");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/store-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountName, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbarMessage(data.message); // Show success message
        setSnackbarOpen(true);
        setAccountName("");
        setPassword("");
        setIsPasswordGenerated(false);
      } else {
        console.error("Error storing password:", data.message);
        setSnackbarMessage(data.message || "Failed to store the password.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error storing password:", error);
      setSnackbarMessage("An error occurred while saving the password.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "55vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f5f5f5", // Light background color
        fontFamily: "'Roboto', sans-serif",
        flexDirection: "column",
        width: "100%",
        maxWidth: "600px", // Set max-width to 600px for responsiveness
        margin: "auto", // Center the box
        borderRadius: "20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          width: "100%",
          textAlign: "center",
          backgroundColor: "#fff", // White background for the card
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: "24px",
            letterSpacing: "1px",
            color: "#333",
          }}
        >
          Password Generator
        </Typography>

        <Box mb={3}>
          <TextField
            label="Account Name"
            variant="outlined"
            fullWidth
            value={accountName}
            onChange={handleAccountNameChange}
            placeholder="Enter account name"
            sx={{
              marginBottom: "16px",
              "& .MuiOutlinedInput-root": {
                padding: "12px",
              },
            }}
          />
        </Box>

        <Box mb={3} display="flex" flexDirection={{ xs: "column", sm: "row" }} justifyContent="space-between">
          <Box width={{ xs: "100%", sm: "48%" }}>
            <Typography variant="body1" sx={{ color: "#333" }}>
              Password Length: {passwordLength}
            </Typography>
            <Slider
              value={passwordLength}
              onChange={handlePasswordLengthChange}
              min={8}
              max={32}
              step={1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value} characters`}
              sx={{
                color: "#ff5722", // Slider color matches the generate button
                width: "100%",
                marginBottom: "24px",
              }}
            />
          </Box>
          <Box width={{ xs: "100%", sm: "48%" }}>
            <Typography variant="body1" sx={{ color: "#333" }}>
              Strength:{" "}
              {strength === 1 ? "Weak" : strength === 2 ? "Medium" : "Strong"}
            </Typography>
            <Slider
              value={strength}
              onChange={handleStrengthChange}
              min={1}
              max={3}
              step={1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) =>
                value === 1 ? "Weak" : value === 2 ? "Medium" : "Strong"
              }
              sx={{
                color: "#ff5722", // Slider color matches the generate button
                width: "100%",
                marginBottom: "24px",
              }}
            />
          </Box>
        </Box>

        <Box mb={3}>
          <FormControlLabel
            control={
              <Switch
                checked={includeSpecialChars}
                onChange={handleSpecialCharsToggle}
                color="primary"
              />
            }
            label="Include Special Characters"
            sx={{ color: "#333" }}
          />
        </Box>

        {!isPasswordGenerated && !loading && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={generatePassword}
              sx={{
                backgroundColor: "#ff5722",
                color: "#fff",
                fontWeight: "bold",
                padding: "12px 20px",
                fontSize: "16px",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#e64a19",
                  boxShadow: "0 0 20px rgba(255, 87, 34, 0.7)",
                },
              }}
            >
              Generate Password
            </Button>
          </motion.div>
        )}

        {loading && (
          <Box mt={4}>
            <CircularProgress color="secondary" />
          </Box>
        )}

        {isPasswordGenerated && (
          <Box mt={4}>
            <Typography
              variant="h6"
              sx={{ color: "#333", marginBottom: "16px" }}
            >
              <strong>Generated Password:</strong>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "18px",
                color: "#ff5722",
                marginBottom: "24px",
                wordBreak: "break-all",
              }}
            >
              {password}
            </Typography>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexDirection={{ xs: "column", sm: "row" }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="contained"
                  onClick={regeneratePassword} // Re-generate password
                  sx={{
                    backgroundColor: "#ff5722",
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "12px 20px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "#e64a19",
                      boxShadow: "0 0 20px rgba(255, 87, 34, 0.7)",
                    },
                  }}
                >
                  Regenerate
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSavePassword}
                  sx={{
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "12px 20px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "#388e3c",
                      boxShadow: "0 0 20px rgba(76, 175, 80, 0.7)",
                    },
                  }}
                >
                  Save Password
                </Button>
              </motion.div>
            </Box>
          </Box>
        )}
      </motion.div>

      {/* Snackbar for error and success messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreatePassword;
