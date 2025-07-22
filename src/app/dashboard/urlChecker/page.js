"use client"; // Mark the file as a client component

import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";
import { SecurityFeatures } from "@/utils/api-methods";

const URLChecker = () => {
  const [url, setUrl] = useState("");
  const [responseDetails, setResponseDetails] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const checkURL = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResponseDetails(null);

    try {
      const response = await SecurityFeatures.checkURL({ url });
      console.log(response);
      // Verify response structure
      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }

      setResponseDetails(response.data); // Ensure data is assigned properly
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred");
      setResponseDetails(null); // Reset state on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        flexDirection: "column",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ width: "100%", maxWidth: "600px", textAlign: "center" }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: "24px",
            letterSpacing: "1px",
          }}
        >
          URL Checker
        </Typography>
        <form onSubmit={checkURL}>
          <Box mb={3}>
            <TextField
              label="URL"
              variant="outlined"
              fullWidth
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to check"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                input: { color: "#000", fontSize: "16px" },
                "& .MuiInputLabel-root": { color: "#666" },
              }}
            />
          </Box>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="contained"
              fullWidth
              type="submit"
              sx={{
                backgroundColor: "#ff5722",
                color: "#fff",
                fontWeight: "bold",
                padding: "12px 20px",
                fontSize: "16px",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#ff5722" },
              }}
            >
              Check URL
            </Button>
          </motion.div>
        </form>

        {loading && (
          <Box mt={4}>
            <CircularProgress color="primary" />
          </Box>
        )}
        {error && (
          <Box mt={4}>
            <Typography variant="h6" sx={{ color: "#d32f2f" }}>
              Error: {error}
            </Typography>
          </Box>
        )}
        {responseDetails?.lenght && (
          <Box mt={4}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Card
                variant="outlined"
                sx={{
                  maxWidth: "500px",
                  margin: "auto",
                  backgroundColor: "#1e1e2f",
                  color: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  overflow: "hidden",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                      paddingBottom: "10px",
                      marginBottom: "12px",
                    }}
                  >
                    🔍 Analysis Results
                  </Typography>
                  <Box sx={{ display: "grid", gap: "8px", fontSize: "14px" }}>
                    <Typography variant="body1">
                      <strong>IP Address:</strong> {responseDetails.ip}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Malicious:</strong>{" "}
                      <span
                        style={{
                          color: responseDetails.isMalicious
                            ? "#ff5252"
                            : "#4caf50",
                          fontWeight: "bold",
                        }}
                      >
                        {responseDetails.isMalicious ? "Yes" : "No"}
                      </span>
                    </Typography>
                    <Typography variant="body1">
                      <strong>Confidence Score:</strong>{" "}
                      <span
                        style={{
                          color:
                            responseDetails.confidenceScore > 80
                              ? "#ff9800"
                              : "#4caf50",
                        }}
                      >
                        {responseDetails.confidenceScore}
                      </span>
                    </Typography>
                    <Typography variant="body1">
                      <strong>Categories:</strong>{" "}
                      {responseDetails?.categories?.length > 0
                        ? responseDetails.categories.join(", ")
                        : "None"}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Conclusion:</strong> {responseDetails.message}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        )}
      </motion.div>
    </Box>
  );
};

export default URLChecker;
