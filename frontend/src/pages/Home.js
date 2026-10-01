import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import Chip from "@material-ui/core/Chip";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import CheckCircleIcon from "@material-ui/icons/CheckCircleOutline";
import SecurityIcon from "@material-ui/icons/SecurityOutlined";
import EcoIcon from "@material-ui/icons/EcoOutlined";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { CROPS } from "../data/diseases";
import { useAppTheme } from "../context/ThemeContext";

// Import Plant Icons
import plantIcon1 from "../plantIcons/PlantIcon1.png";
import plantIcon2 from "../plantIcons/PlantIcon2.png";
import plantIcon3 from "../plantIcons/PlantIcon3.png";
import plantIcon4 from "../plantIcons/PlantIcon4.png";

const CROP_ICONS = {
  tomato: plantIcon1,
  potato: plantIcon2,
  grape: plantIcon3,
  corn: plantIcon4,
};

const useStyles = makeStyles((theme) => ({
  heroSection: {
    padding: theme.spacing(8, 0, 6, 0),
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(4, 0, 3, 0),
    },
  },
  heroBadge: {
    backgroundColor: theme.palette.type === "dark" ? "rgba(134, 167, 137, 0.18)" : "#E8F0E4",
    color: theme.palette.primary.main,
    fontWeight: 700,
    fontSize: "0.85rem",
    padding: theme.spacing(0.5, 1.5),
    borderRadius: 20,
    marginBottom: theme.spacing(2),
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  heroTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 700,
    fontSize: "3rem",
    lineHeight: 1.15,
    maxWidth: 800,
    margin: "0 auto",
    color: theme.palette.type === "dark" ? "#F5EFE6" : "#2A1F1D",
    [theme.breakpoints.down("sm")]: {
      fontSize: "2.1rem",
    },
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    color: theme.palette.text.secondary,
    maxWidth: 620,
    margin: "18px auto 32px auto",
    lineHeight: 1.6,
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.05rem",
      marginBottom: 24,
    },
  },
  heroCtaBtn: {
    borderRadius: 16,
    padding: "14px 34px",
    fontSize: "1.1rem",
    fontWeight: 700,
    boxShadow: "0 8px 24px rgba(79, 111, 82, 0.3)",
  },
  sectionHeading: {
    textAlign: "center",
    marginBottom: theme.spacing(5),
  },
  sectionTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 700,
    fontSize: "2.2rem",
    marginBottom: theme.spacing(1),
    color: theme.palette.type === "dark" ? "#F5EFE6" : "#2B211E",
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.7rem",
    },
  },
  sectionSubtitle: {
    fontSize: "1.05rem",
    color: theme.palette.text.secondary,
    maxWidth: 580,
    margin: "0 auto",
  },
  cropCard: {
    height: "100%",
    borderRadius: 22,
    border: `1px solid ${theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(79, 111, 82, 0.12)"}`,
    backgroundColor: theme.palette.background.paper,
    transition: "transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: theme.palette.type === "dark"
        ? "0 12px 32px rgba(0, 0, 0, 0.6)"
        : "0 12px 32px rgba(60, 45, 30, 0.12)",
      borderColor: theme.palette.primary.main,
    },
  },
  cropActionArea: {
    height: "100%",
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  cropIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(2),
    transition: "transform 0.3s ease",
  },
  cropImage: {
    width: 72,
    height: 72,
    objectFit: "contain",
  },
  cropName: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 700,
    fontSize: "1.35rem",
    marginBottom: 4,
  },
  cropScientific: {
    fontSize: "0.82rem",
    fontStyle: "italic",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1.5),
  },
  cropBadge: {
    fontWeight: 700,
    fontSize: "0.78rem",
    borderRadius: 12,
    backgroundColor: theme.palette.type === "dark" ? "rgba(134, 167, 137, 0.15)" : "#EAF2E8",
    color: theme.palette.primary.main,
  },
  stepCard: {
    height: "100%",
    borderRadius: 20,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.03)" : "#FFFFFF",
    border: `1px solid ${theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.07)" : "rgba(79, 111, 82, 0.1)"}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "1.1rem",
    fontFamily: "'Lora', Georgia, serif",
    marginBottom: theme.spacing(2),
    boxShadow: "0 4px 12px rgba(79, 111, 82, 0.25)",
  },
  stepTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 700,
    fontSize: "1.2rem",
    marginBottom: theme.spacing(1),
  },
  trustBox: {
    borderRadius: 24,
    padding: theme.spacing(4.5),
    backgroundColor: theme.palette.type === "dark" ? "#1B261E" : "#F4EFE6",
    border: `1px solid ${theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(79, 111, 82, 0.15)"}`,
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
  },
}));

const Home = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { appConfig } = useAppTheme();

  const steps = [
    {
      step: "1",
      title: "Photograph a Leaf",
      description: "Snap a photo of the affected plant leaf in daylight or upload a saved picture from your smartphone or desktop.",
    },
    {
      step: "2",
      title: "AI CNN Analysis",
      description: "Our high-precision convolutional neural network scans patterns, discoloration, and structural lesions in seconds.",
    },
    {
      step: "3",
      title: "Action Plan & Remedies",
      description: "Receive exact disease diagnosis, confidence metrics, organic solutions, chemical controls, and preventive next-season steps.",
    },
  ];

  return (
    <div className="animate-fade-in">
      <Container maxWidth="lg">
        {/* HERO SECTION */}
        <div className={classes.heroSection}>
          <div className={classes.heroBadge}>
            <EcoIcon fontSize="small" /> AI-Powered Agricultural Diagnosis
          </div>
          <Typography variant="h1" className={classes.heroTitle}>
            Snap a leaf. Protect your harvest in seconds.
          </Typography>
          <Typography className={classes.heroSubtitle}>
            {appConfig.tagline}
          </Typography>
          <Button
            component={RouterLink}
            to="/scan"
            variant="contained"
            color="primary"
            size="large"
            className={classes.heroCtaBtn}
            startIcon={<CameraAltIcon />}
          >
            Scan a Leaf Now
          </Button>
        </div>

        {/* HOW IT WORKS SECTION */}
        <div style={{ padding: "40px 0" }}>
          <div className={classes.sectionHeading}>
            <Typography variant="h2" className={classes.sectionTitle}>
              How {appConfig.appName} Works
            </Typography>
            <Typography className={classes.sectionSubtitle}>
              Three simple steps designed for farmers in the field.
            </Typography>
          </div>

          <Grid container spacing={3}>
            {steps.map((item) => (
              <Grid item xs={12} md={4} key={item.step}>
                <div className={classes.stepCard}>
                  <div className={classes.stepNumber}>{item.step}</div>
                  <Typography className={classes.stepTitle}>{item.title}</Typography>
                  <Typography variant="body2" color="textSecondary" style={{ lineHeight: 1.6 }}>
                    {item.description}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>

        {/* CHOOSE YOUR CROP SECTION */}
        <div style={{ padding: "50px 0" }}>
          <div className={classes.sectionHeading}>
            <Typography variant="h2" className={classes.sectionTitle}>
              Choose Your Crop
            </Typography>
            <Typography className={classes.sectionSubtitle}>
              Select the plant you wish to diagnose for tailored model accuracy.
            </Typography>
          </div>

          <Grid container spacing={3}>
            {Object.values(CROPS).map((crop) => (
              <Grid item xs={12} sm={6} md={3} key={crop.id}>
                <Card className={classes.cropCard} elevation={0}>
                  <CardActionArea
                    className={classes.cropActionArea}
                    onClick={() => navigate(`/scan/${crop.id}`)}
                  >
                    <div
                      className={classes.cropIconWrapper}
                      style={{ backgroundColor: crop.bgTint }}
                    >
                      <img
                        src={CROP_ICONS[crop.id]}
                        alt={crop.name}
                        className={classes.cropImage}
                      />
                    </div>
                    <Typography className={classes.cropName}>{crop.name}</Typography>
                    <Typography className={classes.cropScientific}>
                      {crop.scientificName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      style={{ fontSize: "0.85rem", marginBottom: 14, minHeight: 40 }}
                    >
                      {crop.description}
                    </Typography>
                    <Chip
                      label={`${crop.diseaseCount} Conditions Identified`}
                      size="small"
                      className={classes.cropBadge}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 14,
                        color: "#4F6F52",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                      }}
                    >
                      Scan {crop.name} <ArrowForwardIcon fontSize="small" />
                    </div>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>

        {/* TRUST & TRANSPARENCY SECTION */}
        <div className={classes.trustBox}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <SecurityIcon color="primary" fontSize="large" />
                <Typography variant="h5" style={{ fontWeight: 700 }}>
                  Transparent & Responsible AI
                </Typography>
              </div>
              <Typography variant="body1" color="textSecondary" style={{ lineHeight: 1.6, marginBottom: 16 }}>
                LeafLens uses neural networks specifically trained on thousands of verified agricultural leaf images.
                To maintain high accuracy, remember:
              </Typography>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                  <Typography variant="body2">
                    Trained specifically on Tomato, Potato, Grape, and Corn leaves.
                  </Typography>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                  <Typography variant="body2">
                    Provides both organic low-cost interventions and conventional treatments.
                  </Typography>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                  <Typography variant="body2">
                    Guidance is assistive — always consult agricultural extension officers before applying heavy chemicals.
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} md={5} style={{ textAlign: "center" }}>
              <div
                style={{
                  backgroundColor: "rgba(79, 111, 82, 0.1)",
                  padding: 24,
                  borderRadius: 20,
                  border: "1px solid rgba(79, 111, 82, 0.2)",
                }}
              >
                <Typography variant="h6" style={{ fontWeight: 700, marginBottom: 8 }}>
                  Ready to diagnose a crop?
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
                  Take a photo or pick an existing image from your phone.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/scan"
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<CameraAltIcon />}
                >
                  Start Scanning
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
};

export default Home;
