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
import InfoIcon from "@mui/icons-material/Info";
import styles from "../../../assets/styles/securityTips.module.css";

const truncateText = (text, limit) => {
  if (!text) return ""; // Handle null or undefined text
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
};

const SecurityTipCard = React.memo(({ item, onViewDetails }) => {
  return (
    <Grid item xs={12} sm={6} md={4} key={item._id}>
      <Card
        className={styles.card}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Typography variant="h6" className={styles.tipTitle}>
            {item.title}
          </Typography>
          <Typography
            variant="body2"
            className={styles.tipDescription}
            sx={{ marginBottom: "auto" }}
          >
            {truncateText(item.description, 100)} {/* Truncate description */}
          </Typography>
        </CardContent>
        <Button
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: "#4caf50",
            color: "#fff",
            fontWeight: "bold",
            width: "90%",
            alignSelf: "center",
            marginBottom: "10px",
            fontSize: "12px",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#388e3c",
              boxShadow: "0 0 10px rgba(76, 175, 80, 0.7)",
            },
          }}
          onClick={() => onViewDetails(item)}
        >
          View Details
        </Button>
      </Card>
    </Grid>
  );
});

const SecurityTipsList = ({ onCreateNew }) => {
  const [tips, setTips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchSecurityTips = useCallback(async () => {
    const apiKey = "76288fd339374100ac2f6287d5de8afd"; // Replace with your News API key
    const url = `https://newsapi.org/v2/everything?q=security&apiKey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.articles) {
        const filteredArticles = data.articles.filter(
          (article) =>
            article.title !== "[Removed]" &&
            article.description !== "[Removed]" &&
            article.author !== null &&
            article.source.name !== "[Removed]"
        );
        setTips(filteredArticles); // Set the filtered articles
      } else {
        console.error("Failed to fetch security tips: Invalid response data.");
      }
    } catch (error) {
      console.error("Error fetching security tips:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSecurityTips();
  }, [fetchSecurityTips]);

  const handleViewDetails = (tip) => {
    setSelectedTip(tip);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCopyTip = () => {
    if (selectedTip) {
      navigator.clipboard.writeText(selectedTip.description);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className={styles.securityTipsContainer}>
      <div className={styles.header}>
        <Typography variant="h5" className={styles.title}>
          Security Tips
        </Typography>
        <IconButton
          aria-label="Create New Tip"
          className={styles.addButton}
          onClick={onCreateNew}
        >
          <InfoIcon />
        </IconButton>
      </div>
      <Grid container spacing={2} sx={{ padding: "20px" }}>
        {isLoading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={150} />
            </Grid>
          ))
        ) : tips.length === 0 ? (
          <Typography variant="body1" className={styles.noTips}>
            No security tips available.
          </Typography>
        ) : (
          tips.map((item) => (
            <SecurityTipCard
              key={item.url}
              item={item}
              onViewDetails={handleViewDetails}
            />
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
            {selectedTip?.title}
          </Typography>
          <Typography variant="body1" style={{ marginBottom: "20px" }}>
            {selectedTip?.description}
          </Typography>
          <IconButton onClick={handleCopyTip} style={{ color: "#4caf50" }}>
            <InfoIcon />
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
          Tip copied to clipboard!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SecurityTipsList;
