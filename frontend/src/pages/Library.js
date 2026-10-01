import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SearchIcon from "@material-ui/icons/Search";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import CloseIcon from "@material-ui/icons/Close";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

import { CROPS, DISEASE_DATA } from "../data/diseases";
import RemediesPanel from "../components/RemediesPanel";

const useStyles = makeStyles((theme) => ({
  pageWrapper: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
    minHeight: "85vh",
  },
  header: {
    textAlign: "center",
    marginBottom: theme.spacing(4),
  },
  pageTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 700,
    fontSize: "2.2rem",
    marginBottom: theme.spacing(0.5),
  },
  pageSubtitle: {
    fontSize: "1.05rem",
    color: theme.palette.text.secondary,
    maxWidth: 600,
    margin: "0 auto",
  },
  filterSection: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 20,
    padding: theme.spacing(2.5),
    border: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(4),
  },
  tabRoot: {
    minHeight: 44,
    marginBottom: theme.spacing(2),
  },
  tabItem: {
    fontWeight: 700,
    fontSize: "0.95rem",
    textTransform: "none",
    borderRadius: 12,
    minHeight: 40,
    marginRight: 6,
  },
  diseaseCard: {
    height: "100%",
    borderRadius: 20,
    border: `1px solid ${theme.palette.type === "dark" ? "rgba(255,255,255,0.08)" : "rgba(79,111,82,0.12)"}`,
    backgroundColor: theme.palette.background.paper,
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: theme.palette.type === "dark"
        ? "0 10px 28px rgba(0,0,0,0.5)"
        : "0 10px 28px rgba(60,45,30,0.1)",
    },
  },
  cardAction: {
    padding: theme.spacing(2.5),
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
  },
  diseaseTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 700,
    fontSize: "1.25rem",
    marginBottom: 8,
    marginTop: 10,
    color: theme.palette.text.primary,
  },
  dialogPaper: {
    borderRadius: 22,
    backgroundColor: theme.palette.background.paper,
  },
}));

const Library = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [activeCropTab, setActiveCropTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDisease, setSelectedDisease] = useState(null);

  const diseaseList = Object.values(DISEASE_DATA);

  // Filter conditions
  const filteredDiseases = diseaseList.filter((item) => {
    // Tab filter
    if (activeCropTab !== "all" && item.cropId !== activeCropTab) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.friendlyName.toLowerCase().includes(q);
      const matchCrop = item.cropName.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      const matchSymptoms = item.symptoms?.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchCrop && !matchSummary && !matchSymptoms) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className={`${classes.pageWrapper} animate-fade-in`}>
      <Container maxWidth="lg">
        {/* Header */}
        <div className={classes.header}>
          <Typography variant="h1" className={classes.pageTitle}>
            Crop Disease Library
          </Typography>
          <Typography className={classes.pageSubtitle}>
            Explore diagnoses, visual symptoms, organic treatments, and preventative agronomic advice for all supported crops.
          </Typography>
        </div>

        {/* Filter & Search Box */}
        <div className={classes.filterSection}>
          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search disease, crop, or symptom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon style={{ color: "#86A789", marginRight: 8 }} />,
                }}
              />
            </Grid>

            {/* Crop Tabs */}
            <Grid item xs={12} md={7}>
              <Tabs
                value={activeCropTab}
                onChange={(e, val) => setActiveCropTab(val)}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                className={classes.tabRoot}
              >
                <Tab label="All Crops" value="all" className={classes.tabItem} />
                <Tab label="🍅 Tomato" value="tomato" className={classes.tabItem} />
                <Tab label="🥔 Potato" value="potato" className={classes.tabItem} />
                <Tab label="🍇 Grape" value="grape" className={classes.tabItem} />
                <Tab label="🌽 Corn" value="corn" className={classes.tabItem} />
              </Tabs>
            </Grid>
          </Grid>
        </div>

        {/* Disease Cards Grid */}
        <Grid container spacing={3}>
          {filteredDiseases.map((item) => {
            const cropObj = CROPS[item.cropId] || CROPS.tomato;
            return (
              <Grid item xs={12} sm={6} md={4} key={item.rawLabel}>
                <Card className={classes.diseaseCard} elevation={0}>
                  <CardActionArea
                    className={classes.cardAction}
                    onClick={() => setSelectedDisease(item)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                      <Chip
                        label={item.cropName}
                        size="small"
                        style={{
                          backgroundColor: cropObj.bgTint,
                          color: cropObj.color,
                          fontWeight: 700,
                        }}
                      />
                      <Chip
                        label={item.isHealthy ? "Healthy" : `Severity: ${item.severity}`}
                        size="small"
                        style={{
                          backgroundColor: `${item.urgencyColor}18`,
                          color: item.urgencyColor,
                          fontWeight: 700,
                        }}
                      />
                    </div>

                    <Typography className={classes.diseaseTitle}>
                      {item.friendlyName}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="textSecondary"
                      style={{
                        lineHeight: 1.5,
                        fontSize: "0.88rem",
                        flexGrow: 1,
                        marginBottom: 16,
                      }}
                    >
                      {item.summary}
                    </Typography>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#4F6F52",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        marginTop: "auto",
                      }}
                    >
                      View Treatment Plan <ArrowForwardIcon fontSize="small" />
                    </div>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {filteredDiseases.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>🔍</div>
            <Typography variant="h6" style={{ fontWeight: 700, marginBottom: 6 }}>
              No matching diseases found
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
              Try searching with different symptoms or select another crop tab.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setSearchQuery("");
                setActiveCropTab("all");
              }}
            >
              Reset Search
            </Button>
          </div>
        )}

        {/* FULL REMEDY MODAL DIALOG */}
        {selectedDisease && (
          <Dialog
            open={Boolean(selectedDisease)}
            onClose={() => setSelectedDisease(null)}
            maxWidth="md"
            fullWidth
            classes={{ paper: classes.dialogPaper }}
          >
            <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "1.4rem" }}>🌿</span>
                <Typography variant="h6" style={{ fontWeight: 700 }}>
                  {selectedDisease.cropName} — {selectedDisease.friendlyName}
                </Typography>
              </div>
              <IconButton size="small" onClick={() => setSelectedDisease(null)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers style={{ padding: 24 }}>
              <RemediesPanel details={selectedDisease} />
            </DialogContent>
            <DialogActions style={{ padding: 16 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CameraAltIcon />}
                onClick={() => {
                  const cropId = selectedDisease.cropId;
                  setSelectedDisease(null);
                  navigate(`/scan/${cropId}`);
                }}
              >
                Scan This Crop Now
              </Button>
              <Button variant="outlined" onClick={() => setSelectedDisease(null)}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Container>
    </div>
  );
};

export default Library;
