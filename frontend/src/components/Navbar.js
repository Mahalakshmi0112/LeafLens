import React, { useState, useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import Chip from "@material-ui/core/Chip";
import MenuIcon from "@material-ui/icons/Menu";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import CameraAltIcon from "@material-ui/icons/CameraAltOutlined";
import HistoryIcon from "@material-ui/icons/HistoryOutlined";
import MenuBookIcon from "@material-ui/icons/MenuBookOutlined";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { useAppTheme } from "../context/ThemeContext";
import { checkBackendHealth } from "../services/api";
import { useAuth } from "../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: theme.palette.type === "dark" ? "#1B261E" : "#FFFFFF",
    color: theme.palette.text.primary,
    boxShadow: theme.palette.type === "dark" 
      ? "0 2px 12px rgba(0, 0, 0, 0.4)" 
      : "0 2px 14px rgba(79, 111, 82, 0.08)",
    borderBottom: `1px solid ${theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.06)" : "rgba(79, 111, 82, 0.1)"}`,
    position: "sticky",
    top: 0,
    zIndex: theme.zIndex.appBar,
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(1, 2),
    maxWidth: 1280,
    width: "100%",
    margin: "0 auto",
  },
  brandContainer: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "inherit",
    gap: theme.spacing(1.2),
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.palette.primary.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
    boxShadow: "0 3px 8px rgba(79, 111, 82, 0.3)",
  },
  brandName: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 700,
    fontSize: "1.3rem",
    lineHeight: 1.1,
    color: theme.palette.type === "dark" ? "#EAE3D2" : "#2C3E2D",
  },
  brandSubtitle: {
    fontSize: "0.72rem",
    color: theme.palette.text.secondary,
    fontWeight: 600,
    letterSpacing: "0.03em",
  },
  navLinks: {
    display: "none",
    alignItems: "center",
    gap: theme.spacing(1),
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  navButton: {
    borderRadius: 12,
    padding: "6px 14px",
    fontWeight: 700,
    fontSize: "0.9rem",
    color: theme.palette.text.primary,
    "&:hover": {
      backgroundColor: theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.06)" : "rgba(79, 111, 82, 0.08)",
    },
  },
  activeNavButton: {
    backgroundColor: theme.palette.type === "dark" ? "rgba(134, 167, 137, 0.18)" : "rgba(79, 111, 82, 0.12)",
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.type === "dark" ? "rgba(134, 167, 137, 0.25)" : "rgba(79, 111, 82, 0.18)",
    },
  },
  scanCtaButton: {
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    borderRadius: 12,
    padding: "6px 16px",
    fontWeight: 700,
    marginLeft: theme.spacing(1),
    boxShadow: "0 3px 10px rgba(79, 111, 82, 0.25)",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  statusChip: {
    fontWeight: 700,
    fontSize: "0.75rem",
    height: 28,
    borderRadius: 14,
  },
  onlineStatus: {
    backgroundColor: theme.palette.type === "dark" ? "rgba(134, 167, 137, 0.2)" : "#E8F5E9",
    color: theme.palette.type === "dark" ? "#A3C9A8" : "#2E7D32",
    border: `1px solid ${theme.palette.type === "dark" ? "rgba(134, 167, 137, 0.3)" : "#C8E6C9"}`,
  },
  offlineStatus: {
    backgroundColor: theme.palette.type === "dark" ? "rgba(200, 105, 74, 0.2)" : "#FDF0D5",
    color: theme.palette.type === "dark" ? "#E57A5D" : "#B76518",
    border: `1px solid ${theme.palette.type === "dark" ? "rgba(200, 105, 74, 0.3)" : "#FFE082"}`,
  },
  mobileMenuBtn: {
    display: "block",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  drawerPaper: {
    width: 270,
    backgroundColor: theme.palette.type === "dark" ? "#1B261E" : "#FDFBF7",
    padding: theme.spacing(2, 1),
  },
  drawerHeader: {
    padding: theme.spacing(1, 2, 2, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(1),
  },
}));

const LeafSvg = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const Navbar = () => {
  const classes = useStyles();
  const location = useLocation();
  const { isDark, toggleTheme, appConfig } = useAppTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(true);

  // Poll backend health every 30 seconds
  useEffect(() => {
    let mounted = true;
    const checkHealth = async () => {
      const online = await checkBackendHealth();
      if (mounted) setIsBackendOnline(online);
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    { label: "Scan Leaf", path: "/scan", icon: <CameraAltIcon /> },
    { label: "History", path: "/history", icon: <HistoryIcon /> },
    { label: "Stats", path: "/stats", icon: <HistoryIcon /> },
    { label: "Disease Library", path: "/library", icon: <MenuBookIcon /> },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <AppBar position="sticky" className={classes.appbar} elevation={0}>
      <Toolbar className={classes.toolbar} disableGutters>
        {/* Brand Logo & Name */}
        <RouterLink to="/" className={classes.brandContainer}>
          <div className={classes.logoIcon}>
            <LeafSvg />
          </div>
          <div>
            <Typography className={classes.brandName}>{appConfig.appName}</Typography>
            <Typography className={classes.brandSubtitle}>AI Crop Diagnostics</Typography>
          </div>
        </RouterLink>

        {/* Desktop Navigation Links */}
        <div className={classes.navLinks}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={RouterLink}
              to={item.path}
              className={`${classes.navButton} ${isActive(item.path) ? classes.activeNavButton : ""}`}
            >
              {item.label}
            </Button>
          ))}
          <Button
            component={RouterLink}
            to="/scan"
            variant="contained"
            className={classes.scanCtaButton}
            startIcon={<CameraAltIcon />}
          >
            Scan Now
          </Button>
        </div>

        {/* Right Section: Status, Theme Toggle, Mobile Hamburger */}
        <div className={classes.rightSection}>
          <Tooltip
            title={
              isBackendOnline
                ? "Express API, local MongoDB, and FastAPI are online"
                : "One or more services (Express, MongoDB, FastAPI) is unreachable"
            }
            arrow
          >
            <Chip
              icon={
                isBackendOnline ? (
                  <CheckCircleIcon style={{ fontSize: 16, color: "inherit" }} />
                ) : (
                  <ErrorOutlineIcon style={{ fontSize: 16, color: "inherit" }} />
                )
              }
              label={isBackendOnline ? "Services Online" : "Services Offline"}
              className={`${classes.statusChip} ${isBackendOnline ? classes.onlineStatus : classes.offlineStatus}`}
              size="small"
            />
          </Tooltip>

          {isAuthenticated ? (
            <Button color="inherit" onClick={logout} title={`Signed in as ${user?.email}`}>Log out</Button>
          ) : (
            <Button component={RouterLink} to="/login" color="inherit">Log in</Button>
          )}

          <Tooltip title={isDark ? "Switch to Daytime Warm mode" : "Switch to Evening Dark mode"} arrow>
            <IconButton onClick={toggleTheme} color="inherit" aria-label="toggle theme" size="small">
              {isDark ? <Brightness7Icon style={{ color: "#EAE3D2" }} /> : <Brightness4Icon style={{ color: "#4F6F52" }} />}
            </IconButton>
          </Tooltip>

          <IconButton
            className={classes.mobileMenuBtn}
            onClick={() => setMobileOpen(true)}
            color="inherit"
            aria-label="open mobile menu"
            edge="end"
          >
            <MenuIcon />
          </IconButton>
        </div>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.drawerHeader}>
          <div className={classes.brandContainer}>
            <div className={classes.logoIcon}>
              <LeafSvg />
            </div>
            <div>
              <Typography className={classes.brandName}>{appConfig.appName}</Typography>
              <Typography className={classes.brandSubtitle}>AI Crop Diagnostics</Typography>
            </div>
          </div>
        </div>
        <List>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.path}
              component={RouterLink}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              selected={isActive(item.path)}
              style={{ borderRadius: 12, margin: "4px 0" }}
            >
              <ListItemIcon style={{ color: isActive(item.path) ? "#4F6F52" : "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 700 : 500,
                }}
              />
            </ListItem>
          ))}
          {!isAuthenticated && <ListItem button component={RouterLink} to="/login" onClick={() => setMobileOpen(false)}>
            <ListItemText primary="Log in / Register" />
          </ListItem>}
          {isAuthenticated && <ListItem button onClick={() => { logout(); setMobileOpen(false); }}>
            <ListItemText primary={`Log out${user?.name ? ` (${user.name})` : ""}`} />
          </ListItem>}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
