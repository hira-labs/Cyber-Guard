import React from "react";
import { AppBar, Toolbar, Typography, Box, Container, Button } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import styles from "../../assets/styles/layout.module.css"; 
import Logo from "../../assets/images/logo.png"; 

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      {/* Modern Header (Navbar) */}
      <AppBar position="fixed" className={styles.navbar} elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters className={styles.toolbar}>
            {/* Logo Section */}
            <Box className={styles.logoSection}>
              <div className={styles.logoWrapper}>
                {/* Using the actual logo image from assets */}
                <Image 
                  src={Logo}
                  alt="CyberGuard Logo" 
                  width={40} 
                  height={40} 
                  className={styles.logo} 
                  priority
                />
              </div>
             
            </Box>
            
            {/* Navigation Links */}
            <Box className={styles.navLinksContainer}>
              <Link href="/landingPage" className={styles.navLink}>
                <Button variant="text" color="inherit">Home</Button>
              </Link>
              <Link href="/landingPage/signup" className={styles.navLink}>
                <Button variant="text" color="inherit">Sign Up</Button>
              </Link>
              <Link href="/landingPage/login" className={styles.navLink}>
                <Button variant="contained" 
                  className={styles.loginButton} 
                  disableElevation
                >
                  Log In
                </Button>
              </Link>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Spacer for fixed navbar */}
      <div className={styles.navbarSpacer} />

      {/* Main Content */}
      <main className={styles.mainContent}>{children}</main>

      {/* Minimalist Footer */}
      <footer className={styles.footer}>
        <Container maxWidth="lg">
          <Box className={styles.footerContent}>
            <Typography variant="caption" className={styles.copyright}>
              © {new Date().getFullYear()} CyberGuard. All rights reserved.
            </Typography>
            <Box className={styles.footerLinks}>
              <Link href="/terms" className={styles.footerLink}>Terms</Link>
              <Link href="/privacy" className={styles.footerLink}>Privacy</Link>
              <Link href="/contact" className={styles.footerLink}>Contact</Link>
            </Box>
          </Box>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;
