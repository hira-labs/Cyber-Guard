"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  CircularProgress,
  Box,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SecurityIcon from "@mui/icons-material/Security";
import styles from "../../assets/styles/CyberSecurityLandingPage.module.css";
import "../../assets/styles/global.css";
import { redirect } from "next/navigation";
import Typewriter from "typewriter-effect";

// Enhanced Circuit Animation component with more dots and variety
const CircuitAnimation = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const dotCount = 55; 

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

// Updated Security Visual with new inner ring
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

const CyberSecurityLandingPage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };

  const handleMenuClose = () => {
    setOpenMenu(false);
  };

  const handleGetStarted = () => {
    setIsLoading(true);
    setTimeout(() => {
      redirect("/landingPage/signup");
    }, 600);
  };

  const handleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      redirect("/landingPage/login");
    }, 600);
  };

  return (
    <div className={styles.container}>
      {/* Circuit animation overlay */}
      <CircuitAnimation />

      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.contentLeft}>
            <div className={styles.tagline}>SECURITY FOR AI</div>

            <div className={styles.typingContainer}>
              <h1 className={styles.mainHeading}>
                <Typewriter
                  options={{
                    loop: true,
                    delay: 50,
                    deleteSpeed: 30,
                    cursor: ""
                  }}
                  onInit={(typewriter) => {
                    typewriter
                      .typeString("You're innovating with <span>AI.</span><br>We're securing it.")
                      .pauseFor(2000)
                      .deleteAll()
                      .typeString("Smart Defense. <span>Smarter AI.</span>")
                      .pauseFor(2000)
                      .deleteAll()
                      .typeString("<span>Advanced</span> Encryption Technology")
                      .pauseFor(2000)
                      .deleteAll()
                      .typeString("Defending Data with <span>Intelligence</span>")
                      .pauseFor(2000)
                      .start();
                  }}
                />
              </h1>
            </div>

            <p className={styles.staticTagline}>
              Advanced neural networks protecting your digital assets with military-grade protocols and continuous threat monitoring.
            </p>

            {isLoading ? (
              <div className={styles.loadingContainer}>
                <CircularProgress size={24} sx={{ color: "#55c1b7" }} />
                <div className={styles.loadingText}>Initializing Secure Connection...</div>
              </div>
            ) : (
              <div className={styles.ctaButtons}>
                <Button
                  variant="contained"
                  className={styles.primaryBtn}
                  onClick={handleGetStarted}
                  disableElevation
                  size="small"
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  className={styles.secondaryBtn}
                  onClick={handleSignIn}
                  size="small"
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>

          <div className={styles.contentRight} style={{ marginLeft: "20%" }}>
            <SecurityVisual />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CyberSecurityLandingPage;
