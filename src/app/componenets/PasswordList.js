"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Modal,
  Box,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { SecurityFeatures } from "@/utils/api-methods";
import styles from "../../assets/styles/passwordList.module.css";

const PasswordCard = React.memo(({ item, onViewDetails }) => {
  return (
    <Grid item xs={12} sm={6} md={4} key={item._id}>
      <Card className={styles.card}>
        <CardContent>
          <Typography variant="h6" className={styles.accountName}>
            {item.accountName}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#ff5722",
              color: "#fff",
              fontWeight: "bold",
              width: "100%",
              padding: "8px",
              fontSize: "12px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#e64a19",
                boxShadow: "0 0 10px rgba(255, 87, 34, 0.7)",
              },
            }}
            onClick={() => onViewDetails(item)}
          >
            View Password
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
});

const PasswordList = ({ onCreateNew }) => {
  const [passwords, setPasswords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchPasswords = useCallback(async () => {
    try {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        console.error("Email not found in localStorage.");
        return;
      }

      const response = await SecurityFeatures.getPasswords({ email });
      if (response && response.data) {
        setPasswords(response.data);
      } else {
        console.error("Failed to fetch passwords: Invalid response data.");
      }
    } catch (error) {
      console.error("Error fetching passwords:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPasswords();
  }, [fetchPasswords]);

  const handleViewDetails = (password) => {
    setSelectedPassword(password);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCopyPassword = () => {
    if (selectedPassword) {
      navigator.clipboard.writeText(selectedPassword.password);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className={styles.passwordListContainer}>
      <div className={styles.header}>
        <Typography variant="h5" className={styles.title}>
          Password List
        </Typography>
        <IconButton
          aria-label="Create New Password"
          className={styles.addButton}
          onClick={onCreateNew}
        >
          <AddCircleOutlineIcon />
        </IconButton>
      </div>
      <Grid container spacing={2}>
        {isLoading
          ? Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rectangular" height={150} />
              </Grid>
            ))
          : passwords.length === 0 ? (
            <Typography variant="body1" className={styles.noPasswords}>
              No passwords found.
            </Typography>
          ) : (
            passwords.map((item) => (
              <PasswordCard key={item._id} item={item} onViewDetails={handleViewDetails} />
            ))
          )}
      </Grid>

      {/* Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#333",
            padding: "20px",
            borderRadius: "8px",
            width: "90%",
            maxWidth: "400px",
            color: "#fff",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {selectedPassword?.accountName}
          </Typography>
          <Typography variant="body1" style={{ marginBottom: "20px" }}>
            Password: {selectedPassword?.password}
          </Typography>
          <IconButton onClick={handleCopyPassword} style={{ color: "#ff5722" }}>
            <FileCopyIcon />
          </IconButton>
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Password copied to clipboard!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PasswordList;
