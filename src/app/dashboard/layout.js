"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Typography,
  Box,
  Avatar,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../assets/images/logo.png";
import {
  Menu as MenuIcon,
  AccountCircle,
  ChevronLeft,
  Search,
  Home,
  Security,
  Password,
  Link as LinkIcon,
  Lightbulb,
  Help,
} from "@mui/icons-material";
import styles from "../../assets/styles/layout.module.css";

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleResize = () => setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  return (
    <Box
      className={styles.container}
    >
      {/* Header (Navbar) */}
      <AppBar position="fixed" color="default" elevation={1} className={styles.navbar}>
        <Toolbar className={styles.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="toggle sidebar"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            {openDrawer ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 'bold' }}>
            {openDrawer ? '' : 'CyberGuard'}
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <Search />
            </IconButton>
            
            <Tooltip title="Progress: 0%">
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Progress: 0%
                </Typography>
                <Box
                  sx={{
                    width: 100,
                    height: 6,
                    bgcolor: 'rgba(0,0,0,0.1)',
                    borderRadius: 3,
                  }}
                >
                  <Box sx={{ width: '0%', height: '100%', bgcolor: 'primary.main', borderRadius: 3 }}/>
                </Box>
              </Box>
            </Tooltip>
            
            <Avatar sx={{ bgcolor: '#f0f0f0', color: '#666' }}>
              <AccountCircle />
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Side Navigation Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={openDrawer}
        onClose={isMobile ? toggleDrawer : undefined}
        sx={{
          width: openDrawer ? 240 : 70,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: openDrawer ? 240 : 70,
            boxSizing: 'border-box',
            bgcolor: '#1e2a3a',
            color: 'white',
            transition: 'width 0.2s ease-in-out',
            overflowX: 'hidden',
            borderRight: 'none',
            height: '100%',
            top: 0,
            paddingTop: '64px',
          },
        }}
      >
        <Toolbar 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '64px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            position: 'fixed',
            top: 0,
            width: openDrawer ? 240 : 70,
            zIndex: 1,
            bgcolor: '#1e2a3a',
          }}
        >
          {openDrawer ? (
            <Box sx={{ width: 140, height: 40, position: 'relative' }}>
              <Image 
                src={Logo} 
                alt="CyberGuard Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </Box>
          ) : (
            <Box sx={{ width: 32, height: 32, position: 'relative' }}>
              <Image 
                src={Logo} 
                alt="CyberGuard Icon"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </Box>
          )}
        </Toolbar>
        
        <Box sx={{ mt: 2 }}>
          <List>
            <ListItem 
              button 
              component={Link} 
              href="/dashboard"
              sx={{ 
                py: 1.5, 
                px: 2, 
                my: 0.5,
                borderRadius: openDrawer ? '0 20px 20px 0' : '50%',
                ml: openDrawer ? 0 : 1,
                width: openDrawer ? 'auto' : '50px',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                <Home />
              </ListItemIcon>
              {openDrawer && <ListItemText primary="Dashboard" />}
            </ListItem>

            <Typography
              variant="overline"
              sx={{
                px: 3,
                py: 1.5,
                display: openDrawer ? 'block' : 'none',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.75rem'
              }}
            >
              SECURITY TOOLS
            </Typography>

            <ListItem 
              button 
              component={Link} 
              href="/dashboard/pishingEmailChecker"
              sx={{ 
                py: 1.5, 
                px: 2, 
                my: 0.5,
                borderRadius: openDrawer ? '0 20px 20px 0' : '50%',
                ml: openDrawer ? 0 : 1,
                width: openDrawer ? 'auto' : '50px',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                <Security />
              </ListItemIcon>
              {openDrawer && <ListItemText primary="Phishing Email Checker" />}
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              href="/dashboard/passwordManager"
              sx={{ 
                py: 1.5, 
                px: 2, 
                my: 0.5,
                borderRadius: openDrawer ? '0 20px 20px 0' : '50%',
                ml: openDrawer ? 0 : 1,
                width: openDrawer ? 'auto' : '50px',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                <Password />
              </ListItemIcon>
              {openDrawer && <ListItemText primary="Password Manager" />}
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              href="/dashboard/urlChecker"
              sx={{ 
                py: 1.5, 
                px: 2, 
                my: 0.5,
                borderRadius: openDrawer ? '0 20px 20px 0' : '50%',
                ml: openDrawer ? 0 : 1,
                width: openDrawer ? 'auto' : '50px',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                <LinkIcon />
              </ListItemIcon>
              {openDrawer && <ListItemText primary="URL Checker" />}
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              href="/dashboard/securityTips"
              sx={{ 
                py: 1.5, 
                px: 2, 
                my: 0.5,
                borderRadius: openDrawer ? '0 20px 20px 0' : '50%',
                ml: openDrawer ? 0 : 1,
                width: openDrawer ? 'auto' : '50px',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                <Lightbulb />
              </ListItemIcon>
              {openDrawer && <ListItemText primary="Security Tips" />}
            </ListItem>
          </List>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', px: 2 }}>
          <IconButton 
            color="inherit"
            sx={{ 
              borderRadius: 2, 
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              width: openDrawer ? 'auto' : 45,
              height: 45
            }}
          >
            <Help />
            {openDrawer && <Typography sx={{ ml: 1 }}>Help</Typography>}
          </IconButton>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: "84px",
          ml: {
            xs: 0,
            sm: openDrawer ? "240px" : "70px",
          },
          transition: "margin 0.2s ease-in-out",
          bgcolor: "#f9fafb",
          height: "100vh", 
          overflow: "auto", // Keep only this container scrollable
        }}
      >
        <Box sx={{ 
          width: "100%", 
          maxWidth: 1200,
          margin: "0 auto",
          paddingBottom: 4,
          overflow: "visible", // Prevent this container from scrolling
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
