import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import PrintIcon from "@material-ui/icons/Print";

import {
  getScanHistory,
  deleteScanById,
  clearAllHistory,
  getHistoryMetrics,
} from "../services/historyStorage";
import { CROPS, getDiseaseDetails } from "../data/diseases";
import RemediesPanel from "../components/RemediesPanel";
import ConfidenceGauge from "../components/ConfidenceGauge";

const useStyles = makeStyles((theme) => ({
  pageWrapper: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
    minHeight: "85vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  pageTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 700,
    fontSize: "2.2rem",
    color: theme.palette.text.primary,
  },
  metricsCard: {
    borderRadius: 20,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.type === "dark" ? "rgba(255,255,255,0.08)" : "rgba(79,111,82,0.12)"}`,
    marginBottom: theme.spacing(4),
  },
  metricValue: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 700,
    fontSize: "1.8rem",
    color: theme.palette.text.primary,
  },
  metricLabel: {
    fontSize: "0.85rem",
    color: theme.palette.text.secondary,
    fontWeight: 600,
  },
  filterBar: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 16,
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(3),
  },
  scanCard: {
    borderRadius: 18,
    border: `1px solid ${theme.palette.type === "dark" ? "rgba(255,255,255,0.08)" : "rgba(79,111,82,0.12)"}`,
    backgroundColor: theme.palette.background.paper,
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: theme.palette.type === "dark"
        ? "0 8px 24px rgba(0,0,0,0.5)"
        : "0 8px 24px rgba(60,45,30,0.1)",
    },
  },
  thumbnailWrapper: {
    height: 160,
    backgroundColor: theme.palette.type === "dark" ? "#18221B" : "#F4EFE6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  thumbnailImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  emptyState: {
    textAlign: "center",
    padding: theme.spacing(8, 2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: 22,
    border: `1px dashed ${theme.palette.divider}`,
  },
  dialogPaper: {
    borderRadius: 22,
    backgroundColor: theme.palette.background.paper,
  },
}));

const History = () => {
  const classes = useStyles();

  const [historyList, setHistoryList] = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    healthyCount: 0,
    diseasedCount: 0,
    healthyPercent: 0,
    mostCommonDisease: "None",
    topCrop: "None",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [cropFilter, setCropFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Selected scan for full modal view
  const [selectedScan, setSelectedScan] = useState(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const refreshHistory = async () => {
    try {
      const data = await getScanHistory();
      setHistoryList(data);
      setMetrics(getHistoryMetrics(data));
    } catch (error) {
      setHistoryList([]);
      setMetrics(getHistoryMetrics([]));
    }
  };

  useEffect(() => {
    refreshHistory();
  }, []);

  const handleDeleteScan = async (e, id) => {
    e.stopPropagation();
    await deleteScanById(id);
    await refreshHistory();
    if (selectedScan && selectedScan.id === id) {
      setSelectedScan(null);
    }
  };

  const handleClearAll = async () => {
    await clearAllHistory();
    await refreshHistory();
    setConfirmClearOpen(false);
    setSelectedScan(null);
  };

  // Filter and Sort logic
  const filteredList = historyList
    .filter((item) => {
      // Search disease name
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.friendlyName?.toLowerCase().includes(query);
        const matchesCrop = item.cropName?.toLowerCase().includes(query);
        if (!matchesName && !matchesCrop) return false;
      }
      // Filter Crop
      if (cropFilter !== "all" && item.cropId !== cropFilter) {
        return false;
      }
      // Filter Status
      if (statusFilter === "healthy" && !item.isHealthy) return false;
      if (statusFilter === "diseased" && item.isHealthy) return false;

      return true;
    })
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

  return (
    <div className={`${classes.pageWrapper} animate-fade-in`}>
      <Container maxWidth="lg">
        {/* Header */}
        <div className={classes.header}>
          <div>
            <Typography variant="h1" className={classes.pageTitle}>
              Diagnostic History
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Review and track your saved leaf scans, remedy checklists, and crop health metrics.
            </Typography>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {historyList.length > 0 && (
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => setConfirmClearOpen(true)}
              >
                Clear History
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<CameraAltIcon />}
              component={RouterLink}
              to="/scan"
            >
              New Scan
            </Button>
          </div>
        </div>

        {/* METRICS SUMMARY STRIP */}
        {historyList.length > 0 && (
          <div className={classes.metricsCard}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={6} sm={3}>
                <Typography className={classes.metricValue}>{metrics.total}</Typography>
                <Typography className={classes.metricLabel}>Total Scans</Typography>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography className={classes.metricValue} style={{ color: "#4F6F52" }}>
                  {metrics.healthyPercent}%
                </Typography>
                <Typography className={classes.metricLabel}>Healthy Crop Ratio</Typography>
                {/* Visual Ratio SVG Bar */}
                <svg width="100%" height="8" style={{ marginTop: 4, borderRadius: 4, overflow: "hidden" }}>
                  <rect width="100%" height="8" fill="#C8694A" />
                  <rect width={`${metrics.healthyPercent}%`} height="8" fill="#4F6F52" />
                </svg>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography className={classes.metricValue} style={{ fontSize: "1.2rem" }}>
                  {metrics.mostCommonDisease}
                </Typography>
                <Typography className={classes.metricLabel}>Most Common Condition</Typography>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography className={classes.metricValue} style={{ fontSize: "1.2rem" }}>
                  {metrics.topCrop}
                </Typography>
                <Typography className={classes.metricLabel}>Most Scanned Crop</Typography>
              </Grid>
            </Grid>
          </div>
        )}

        {/* FILTER & SEARCH BAR */}
        {historyList.length > 0 && (
          <div className={classes.filterBar}>
            <Grid container spacing={2} alignItems="center">
              {/* Search input */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search disease or crop..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon style={{ color: "#86A789", marginRight: 8 }} />,
                  }}
                />
              </Grid>

              {/* Crop Filter */}
              <Grid item xs={6} sm={3}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Filter Crop"
                  value={cropFilter}
                  onChange={(e) => setCropFilter(e.target.value)}
                >
                  <MenuItem value="all">All Crops</MenuItem>
                  {Object.values(CROPS).map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Status Filter */}
              <Grid item xs={6} sm={3}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Health Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="healthy">Healthy Only</MenuItem>
                  <MenuItem value="diseased">Diseased Only</MenuItem>
                </TextField>
              </Grid>

              {/* Sort Order */}
              <Grid item xs={12} sm={2}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Sort Date"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </div>
        )}

        {/* SCANS LIST / GRID */}
        {filteredList.length > 0 ? (
          <Grid container spacing={3}>
            {filteredList.map((item) => {
              const dateStr = new Date(item.timestamp).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card className={classes.scanCard} elevation={0}>
                    <CardActionArea onClick={() => setSelectedScan(item)}>
                      {/* Thumbnail or Leaf Icon */}
                      <div className={classes.thumbnailWrapper}>
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.friendlyName}
                            className={classes.thumbnailImg}
                          />
                        ) : (
                          <span style={{ fontSize: "3.5rem" }}>🌿</span>
                        )}
                      </div>

                      <CardContent style={{ padding: 18 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <Chip
                            label={item.cropName}
                            size="small"
                            style={{ fontWeight: 700, fontSize: "0.75rem" }}
                          />
                          <Chip
                            label={item.isHealthy ? "Healthy" : `${(item.confidence * 100).toFixed(0)}% Match`}
                            size="small"
                            style={{
                              backgroundColor: item.isHealthy ? "rgba(79, 111, 82, 0.15)" : "rgba(200, 105, 74, 0.15)",
                              color: item.isHealthy ? "#4F6F52" : "#C8694A",
                              fontWeight: 700,
                              fontSize: "0.75rem",
                            }}
                          />
                        </div>

                        <Typography
                          variant="h6"
                          style={{
                            fontFamily: "'Lora', Georgia, serif",
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            marginBottom: 4,
                          }}
                        >
                          {item.friendlyName}
                        </Typography>

                        <Typography variant="caption" color="textSecondary" style={{ display: "block" }}>
                          {dateStr}
                        </Typography>
                      </CardContent>
                    </CardActionArea>

                    {/* Delete item button */}
                    <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 12px 12px 12px" }}>
                      <Tooltip title="Delete scan record">
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={(e) => handleDeleteScan(e, item.id)}
                          aria-label="delete scan"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          /* Empty state */
          <div className={classes.emptyState}>
            <div style={{ fontSize: "4rem", marginBottom: 16 }}>🌱</div>
            <Typography variant="h5" style={{ fontWeight: 700, marginBottom: 8 }}>
              {historyList.length === 0 ? "No Scans Saved Yet" : "No Results Matching Filter"}
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              style={{ maxWidth: 460, margin: "0 auto 24px auto" }}
            >
              {historyList.length === 0
                ? "Every crop photo you diagnose will be automatically preserved here along with treatment action checklists."
                : "Try clearing your search query or switching crop and status filters."}
            </Typography>
            {historyList.length === 0 ? (
              <Button
                component={RouterLink}
                to="/scan"
                variant="contained"
                color="primary"
                startIcon={<CameraAltIcon />}
              >
                Scan Your First Leaf
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setSearchQuery("");
                  setCropFilter("all");
                  setStatusFilter("all");
                }}
              >
                Reset Filters
              </Button>
            )}
          </div>
        )}

        {/* FULL SCAN DETAIL MODAL */}
        {selectedScan && (
          <Dialog
            open={Boolean(selectedScan)}
            onClose={() => setSelectedScan(null)}
            maxWidth="md"
            fullWidth
            classes={{ paper: classes.dialogPaper }}
          >
            <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "1.4rem" }}>🌿</span>
                <Typography variant="h6" style={{ fontWeight: 700 }}>
                  {selectedScan.cropName} — {selectedScan.friendlyName}
                </Typography>
              </div>
              <IconButton size="small" onClick={() => setSelectedScan(null)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers style={{ padding: 24 }}>
              <Grid container spacing={3} style={{ marginBottom: 20 }}>
                {selectedScan.thumbnail && (
                  <Grid item xs={12} sm={5}>
                    <img
                      src={selectedScan.thumbnail}
                      alt={selectedScan.friendlyName}
                      style={{
                        width: "100%",
                        borderRadius: 16,
                        maxHeight: 250,
                        objectFit: "cover",
                      }}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={selectedScan.thumbnail ? 7 : 12}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <Typography variant="caption" color="textSecondary">
                        Scanned on: {new Date(selectedScan.timestamp).toLocaleString()}
                      </Typography>
                      <Typography variant="h5" style={{ fontFamily: "'Lora', Georgia, serif", fontWeight: 700, margin: "6px 0" }}>
                        {selectedScan.friendlyName}
                      </Typography>
                    </div>
                    <ConfidenceGauge confidence={selectedScan.confidence} size={90} />
                  </div>
                </Grid>
              </Grid>

              {/* Remedies & Checklist for this saved item */}
              <RemediesPanel
                details={getDiseaseDetails(selectedScan.rawLabel)}
                resultId={selectedScan.id}
              />
            </DialogContent>
            <DialogActions style={{ padding: 16 }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={(e) => handleDeleteScan(e, selectedScan.id)}
              >
                Delete Record
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<PrintIcon />}
                onClick={() => window.print()}
              >
                Print Report
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSelectedScan(null)}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* CONFIRM CLEAR ALL DIALOG */}
        <Dialog
          open={confirmClearOpen}
          onClose={() => setConfirmClearOpen(false)}
          classes={{ paper: classes.dialogPaper }}
        >
          <DialogTitle>Clear All Diagnostic History?</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              This will permanently delete all saved leaf scans and checklist progress from your account. This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions style={{ padding: 16 }}>
            <Button onClick={() => setConfirmClearOpen(false)}>Cancel</Button>
            <Button onClick={handleClearAll} variant="contained" color="secondary">
              Yes, Clear Everything
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default History;
