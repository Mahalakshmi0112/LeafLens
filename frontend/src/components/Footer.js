import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Divider from "@material-ui/core/Divider";
import { useAppTheme } from "../context/ThemeContext";
import { CROPS } from "../data/diseases";

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.type === "dark" ? "#141C16" : "#F4EFE6",
    color: theme.palette.text.secondary,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(4),
    marginTop: "auto",
    borderTop: `1px solid ${theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.06)" : "rgba(79, 111, 82, 0.12)"}`,
  },
  container: {
    maxWidth: 1280,
  },
  brandTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 700,
    fontSize: "1.4rem",
    color: theme.palette.type === "dark" ? "#EAE3D2" : "#2C3E2D",
    marginBottom: theme.spacing(1),
  },
  sectionHeading: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 600,
    fontSize: "1.05rem",
    color: theme.palette.type === "dark" ? "#EAE3D2" : "#3B2F2F",
    marginBottom: theme.spacing(1.5),
  },
  footerLink: {
    color: theme.palette.text.secondary,
    display: "block",
    marginBottom: theme.spacing(0.8),
    fontSize: "0.9rem",
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline",
    },
  },
  disclaimerBox: {
    backgroundColor: theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(79, 111, 82, 0.05)",
    border: `1px solid ${theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(79, 111, 82, 0.12)"}`,
    borderRadius: 14,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  disclaimerText: {
    fontSize: "0.82rem",
    lineHeight: 1.5,
    color: theme.palette.text.secondary,
  },
  bottomBar: {
    marginTop: theme.spacing(4),
    paddingTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
    },
  },
}));

const Footer = () => {
  const classes = useStyles();
  const { appConfig } = useAppTheme();

  return (
    <footer className={`${classes.footer} no-print`}>
      <Container className={classes.container}>
        <Grid container spacing={4}>
          {/* Brand and Mission */}
          <Grid item xs={12} md={4}>
            <Typography className={classes.brandTitle}>{appConfig.appName}</Typography>
            <Typography variant="body2" style={{ maxWidth: 320, lineHeight: 1.6 }}>
              Empowering farmers and growers with instant CNN-powered plant disease diagnostics and reliable organic and conventional treatment plans.
            </Typography>
            <div className={classes.disclaimerBox}>
              <Typography className={classes.disclaimerText}>
                <strong>Guidance Notice:</strong> AI predictions are assistive tools. Always verify severe conditions with your regional agronomy extension officer prior to intensive chemical treatments.
              </Typography>
            </div>
          </Grid>

          {/* Quick Navigation */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography className={classes.sectionHeading}>Navigation</Typography>
            <Link component={RouterLink} to="/" className={classes.footerLink}>
              Home
            </Link>
            <Link component={RouterLink} to="/scan" className={classes.footerLink}>
              Scan Leaf
            </Link>
            <Link component={RouterLink} to="/history" className={classes.footerLink}>
              Scan History
            </Link>
            <Link component={RouterLink} to="/library" className={classes.footerLink}>
              Disease Library
            </Link>
          </Grid>

          {/* Supported Crops */}
          <Grid item xs={6} sm={4} md={3}>
            <Typography className={classes.sectionHeading}>Supported Crops</Typography>
            {Object.values(CROPS).map((crop) => (
              <Link
                key={crop.id}
                component={RouterLink}
                to={`/scan/${crop.id}`}
                className={classes.footerLink}
              >
                {crop.name} ({crop.diseaseCount} conditions)
              </Link>
            ))}
          </Grid>

          {/* Best Practices */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography className={classes.sectionHeading}>Agronomic Safety</Typography>
            <Typography variant="body2" style={{ fontSize: "0.85rem", marginBottom: 8 }}>
              • Read chemical safety data sheets before application.
            </Typography>
            <Typography variant="body2" style={{ fontSize: "0.85rem", marginBottom: 8 }}>
              • Observe strict Pre-Harvest Intervals (PHI).
            </Typography>
            <Typography variant="body2" style={{ fontSize: "0.85rem" }}>
              • Disinfect pruning tools with 10% bleach or isopropyl alcohol between infected plants.
            </Typography>
          </Grid>
        </Grid>

        <Divider style={{ marginTop: 32, opacity: 0.5 }} />

        <div className={classes.bottomBar}>
          <Typography variant="caption" style={{ fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} {appConfig.appName} — Built for smallholder farmers and field agronomists.
          </Typography>
          <Typography variant="caption" style={{ fontSize: "0.8rem" }}>
            Model Precision: CNN Deep Learning (TensorFlow / FastAPI)
          </Typography>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
