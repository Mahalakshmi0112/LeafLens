import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import Snackbar from "@material-ui/core/Snackbar";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import RefreshIcon from "@material-ui/icons/Refresh";
import ShareIcon from "@material-ui/icons/Share";
import PrintIcon from "@material-ui/icons/Print";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import WarningIcon from "@material-ui/icons/Warning";

import { CROPS, getDiseaseDetails } from "../data/diseases";
import { predictCropDisease, checkBackendHealth } from "../services/api";
import { saveScanToHistory, createThumbnail, getScanHistory } from "../services/historyStorage";
import ConfidenceGauge from "../components/ConfidenceGauge";
import LeafLoader from "../components/LeafLoader";
import PhotoTipsCard from "../components/PhotoTipsCard";
import RemediesPanel from "../components/RemediesPanel";

// Plant icons
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
  pageWrapper: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
    minHeight: "85vh",
  },
  header: {
    textAlign: "center",
    marginBottom: theme.spacing(3),
  },
  pageTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 700,
    fontSize: "2.2rem",
    marginBottom: theme.spacing(0.5),
    color: theme.palette.text.primary,
  },
  pageSubtitle: {
    fontSize: "1.05rem",
    color: theme.palette.text.secondary,
  },
  cropSwitcherContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(4),
  },
  cropChip: {
    padding: theme.spacing(1, 1.5),
    height: 44,
    borderRadius: 22,
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },
  cropChipActive: {
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    boxShadow: "0 4px 14px rgba(79, 111, 82, 0.3)",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  cropChipInactive: {
    backgroundColor: theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    "&:hover": {
      backgroundColor: theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.1)" : "#F0ECE1",
    },
  },
  dropZone: {
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: 24,
    backgroundColor: theme.palette.type === "dark" ? "rgba(134, 167, 137, 0.04)" : "rgba(79, 111, 82, 0.03)",
    padding: theme.spacing(5, 3),
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.25s ease",
    "&:hover": {
      backgroundColor: theme.palette.type === "dark" ? "rgba(134, 167, 137, 0.08)" : "rgba(79, 111, 82, 0.07)",
      borderColor: theme.palette.primary.dark,
    },
  },
  dropZoneActive: {
    backgroundColor: theme.palette.type === "dark" ? "rgba(134, 167, 137, 0.15)" : "rgba(79, 111, 82, 0.12)",
    borderColor: theme.palette.secondary.main,
  },
  uploadButtonRow: {
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(2),
    marginTop: theme.spacing(2.5),
    flexWrap: "wrap",
  },
  previewCard: {
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.palette.type === "dark" ? "0 4px 24px rgba(0,0,0,0.5)" : "0 4px 24px rgba(65,50,40,0.08)",
  },
  previewImg: {
    width: "100%",
    maxHeight: 380,
    objectFit: "contain",
    backgroundColor: theme.palette.type === "dark" ? "#151C17" : "#F4EFE6",
    display: "block",
  },
  resultCard: {
    borderRadius: 22,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3),
    border: `1px solid ${theme.palette.type === "dark" ? "rgba(255,255,255,0.08)" : "rgba(79,111,82,0.12)"}`,
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
  },
  diseaseTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 700,
    fontSize: "1.8rem",
    color: theme.palette.text.primary,
    lineHeight: 1.2,
  },
  healthyBanner: {
    backgroundColor: theme.palette.type === "dark" ? "rgba(134, 167, 137, 0.2)" : "#EAF4E8",
    color: theme.palette.type === "dark" ? "#A3C9A8" : "#2E7D32",
    borderRadius: 16,
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2.5),
    border: `1px solid ${theme.palette.type === "dark" ? "rgba(134, 167, 137, 0.3)" : "#C8E6C9"}`,
  },
  actionButtonRow: {
    display: "flex",
    gap: theme.spacing(1),
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
  },
  offlineAlert: {
    borderRadius: 16,
    marginBottom: theme.spacing(3),
  },
}));

const Scan = () => {
  const classes = useStyles();
  const { crop: cropParam } = useParams();
  const navigate = useNavigate();

  // Selected crop ID (defaults to tomato or param)
  const initialCrop = cropParam && CROPS[cropParam.toLowerCase()]
    ? cropParam.toLowerCase()
    : "tomato";

  const [selectedCrop, setSelectedCrop] = useState(initialCrop);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [savedScanId, setSavedScanId] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Sync route param with state
  useEffect(() => {
    if (cropParam && CROPS[cropParam.toLowerCase()]) {
      setSelectedCrop(cropParam.toLowerCase());
    }
  }, [cropParam]);

  // Check Express, MongoDB, and the downstream FastAPI inference service.
  const refreshBackendHealth = useCallback(async () => {
    setIsCheckingBackend(true);
    try {
      setIsBackendOnline(await checkBackendHealth());
    } finally {
      setIsCheckingBackend(false);
    }
  }, []);

  useEffect(() => {
    refreshBackendHealth();
  }, [refreshBackendHealth]);

  // Update crop and URL
  const handleCropChange = (cropId) => {
    setSelectedCrop(cropId);
    navigate(`/scan/${cropId}`, { replace: true });
    // Reset prediction on crop switch
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  // Image selection handler & client-side validation
  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMessage("Please upload a valid image (JPEG, PNG, or WebP format).");
      return;
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage("Image file is too large (over 8MB). Please choose a smaller photo.");
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
    setAnalysisResult(null);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setErrorMessage(null);
    setSavedScanId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  // Run AI Analysis
  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setErrorMessage(null);
    setAnalysisResult(null);

    try {
      const response = await predictCropDisease(selectedCrop, selectedFile);
      const details = getDiseaseDetails(response.class);
      const resultObj = {
        class: response.class,
        confidence: response.confidence,
        details: details,
      };

      setAnalysisResult(resultObj);

      const thumbnailData = await createThumbnail(selectedFile);
      const record = {
        cropId: selectedCrop,
        cropName: CROPS[selectedCrop].name,
        rawLabel: response.class,
        friendlyName: details.friendlyName,
        confidence: response.confidence,
        isHealthy: details.isHealthy,
        thumbnail: thumbnailData,
        severity: details.severity || "",
      };

      // Authenticated predictions are already persisted by Express; guests retain local history.
      let savedRecord = null;
      if (localStorage.getItem("leaflens_token")) {
        const records = await getScanHistory();
        savedRecord = records.find((item) => item.rawLabel === response.class && item.cropId === selectedCrop) || records[0] || null;
      } else {
        savedRecord = await saveScanToHistory(record);
      }

      if (savedRecord) {
        setSavedScanId(savedRecord.id);
      }

      setToastMessage("Diagnosis complete! Action plan formulated.");
    } catch (err) {
      setErrorMessage(err.message || "Failed to analyze leaf image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Share Result (Web Share API with Clipboard Fallback)
  const handleShare = async () => {
    if (!analysisResult) return;
    const diseaseName = analysisResult.details.friendlyName;
    const shareText = `LeafLens diagnosed my ${CROPS[selectedCrop].name} leaf as "${diseaseName}" with ${(analysisResult.confidence * 100).toFixed(0)}% confidence. Check out the remedy plan!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `LeafLens - ${diseaseName}`,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch (e) {}
    }

    // Fallback: copy to clipboard
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setToastMessage("Diagnosis summary copied to clipboard!");
    }
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  const currentCropObj = CROPS[selectedCrop] || CROPS.tomato;

  return (
    <div className={`${classes.pageWrapper} animate-fade-in`}>
      <Container maxWidth="lg">
        {/* Header */}
        <div className={`${classes.header} no-print`}>
          <Typography variant="h1" className={classes.pageTitle}>
            Crop Disease Scanner
          </Typography>
          <Typography className={classes.pageSubtitle}>
            Select your plant, snap a high-resolution leaf photo, and receive instant remedies.
          </Typography>
        </div>

        {/* Backend Offline Banner */}
        {!isBackendOnline && (
          <div
            className={`${classes.offlineAlert} no-print`}
            style={{
              backgroundColor: "#FDF0D5",
              border: "1px solid #FFE082",
              color: "#8D4E10",
              padding: "12px 18px",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <WarningIcon style={{ color: "#D9822B" }} />
              <Typography variant="body2" style={{ color: "inherit", lineHeight: 1.4 }}>
                <strong>Diagnosis services unavailable:</strong> The scan page checks Express and MongoDB on port 5001 and the FastAPI inference service on port 8000. Start any service that is offline, then check again.
              </Typography>
            </div>
            <Button
              size="small"
              variant="outlined"
              onClick={refreshBackendHealth}
              disabled={isCheckingBackend}
              style={{ flexShrink: 0, fontWeight: 700 }}
            >
              {isCheckingBackend ? "Checking…" : "Check Again"}
            </Button>
          </div>
        )}

        {/* Crop Switcher Chips */}
        <div className={`${classes.cropSwitcherContainer} no-print`}>
          {Object.values(CROPS).map((crop) => {
            const isActive = selectedCrop === crop.id;
            return (
              <Chip
                key={crop.id}
                avatar={<img src={CROP_ICONS[crop.id]} alt={crop.name} style={{ width: 24, height: 24, borderRadius: "50%" }} />}
                label={crop.name}
                onClick={() => handleCropChange(crop.id)}
                className={`${classes.cropChip} ${isActive ? classes.cropChipActive : classes.cropChipInactive}`}
              />
            );
          })}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            className={`${classes.offlineAlert} no-print`}
            style={{
              backgroundColor: "#FCE8E2",
              border: "1px solid #F5C6BA",
              color: "#A34027",
              padding: "12px 18px",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <WarningIcon style={{ color: "#C8694A" }} />
              <Typography variant="body2" style={{ color: "inherit", fontWeight: 600 }}>
                {errorMessage}
              </Typography>
            </div>
            <IconButton size="small" onClick={() => setErrorMessage(null)} style={{ color: "inherit" }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </div>
        )}

        {/* MAIN SCAN & DIAGNOSIS AREA */}
        <Grid container spacing={4}>
          {/* Left Column: Upload / Preview / Photo Tips */}
          <Grid item xs={12} md={5}>
            {!previewUrl ? (
              <div className="no-print">
                {/* Drag and Drop Box */}
                <div
                  className={`${classes.dropZone} ${isDragOver ? classes.dropZoneActive : ""}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current.click()}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload leaf image"
                >
                  <CloudUploadIcon style={{ fontSize: 56, color: "#4F6F52", marginBottom: 12 }} />
                  <Typography variant="h6" style={{ fontWeight: 700, marginBottom: 4 }}>
                    Drag & Drop leaf photo here
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    or click to browse from device files (JPG, PNG, WebP)
                  </Typography>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />

                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />
                </div>

                {/* Quick Action Buttons: Camera & Gallery */}
                <div className={classes.uploadButtonRow}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CameraAltIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      cameraInputRef.current.click();
                    }}
                  >
                    Take Photo
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<PhotoLibraryIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current.click();
                    }}
                  >
                    Choose from Gallery
                  </Button>
                </div>

                <div style={{ marginTop: 24 }}>
                  <PhotoTipsCard />
                </div>
              </div>
            ) : (
              /* Image Preview Card */
              <Card className={classes.previewCard}>
                <img
                  src={previewUrl}
                  alt="Leaf to analyze"
                  className={classes.previewImg}
                />
                <CardContent style={{ padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <Typography variant="subtitle2" style={{ fontWeight: 700 }}>
                        {selectedFile?.name || "Leaf Photograph"}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Crop: {currentCropObj.name} (
                        {selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : ""})
                      </Typography>
                    </div>

                    <div className="no-print">
                      <Tooltip title="Remove photo and retake">
                        <IconButton
                          onClick={handleClearImage}
                          color="secondary"
                          size="small"
                          aria-label="remove photo"
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>

                  {!analysisResult && !isLoading && (
                    <div style={{ marginTop: 16 }} className="no-print">
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        onClick={handleAnalyze}
                        startIcon={<CameraAltIcon />}
                        style={{ padding: "12px 0", fontSize: "1rem" }}
                      >
                        Analyse {currentCropObj.name} Leaf
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Right Column: Loading State / Diagnosis Result / Empty Prompt */}
          <Grid item xs={12} md={7}>
            {isLoading && (
              <Card className={classes.resultCard}>
                <LeafLoader customTitle={`Diagnosing ${currentCropObj.name} leaf...`} />
              </Card>
            )}

            {!isLoading && analysisResult && (
              <div>
                {/* Result Diagnosis Card */}
                <div className={`${classes.resultCard} print-card`} style={{ marginBottom: 24 }}>
                  {/* Low confidence advisory banner */}
                  {analysisResult.confidence < 0.6 && (
                    <div
                      style={{
                        backgroundColor: "#FDF0D5",
                        border: "1px solid #FFE082",
                        color: "#8D4E10",
                        padding: "12px 16px",
                        borderRadius: 14,
                        marginBottom: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <WarningIcon style={{ color: "#D9822B" }} fontSize="small" />
                      <Typography variant="body2" style={{ color: "inherit", lineHeight: 1.4 }}>
                        <strong>Low Confidence Match ({(analysisResult.confidence * 100).toFixed(0)}%):</strong> The leaf features were difficult to resolve. For higher accuracy, ensure good daylight and hold camera steady.
                      </Typography>
                    </div>
                  )}

                  {/* Healthy Celebration Banner */}
                  {analysisResult.details.isHealthy && (
                    <div className={classes.healthyBanner}>
                      <CheckCircleOutlineIcon style={{ fontSize: 32 }} />
                      <div>
                        <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
                          Good News! Your {currentCropObj.name} leaf appears healthy.
                        </Typography>
                        <Typography variant="body2" style={{ opacity: 0.9 }}>
                          No known fungal, bacterial, or viral symptoms detected.
                        </Typography>
                      </div>
                    </div>
                  )}

                  {/* Diagnosis Details & Confidence Gauge */}
                  <div className={classes.resultHeader}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <Chip
                          label={currentCropObj.name}
                          size="small"
                          style={{
                            backgroundColor: currentCropObj.bgTint,
                            color: currentCropObj.color,
                            fontWeight: 700,
                          }}
                        />
                        <Chip
                          label={analysisResult.details.isHealthy ? "Healthy" : `Severity: ${analysisResult.details.severity}`}
                          size="small"
                          style={{
                            backgroundColor: `${analysisResult.details.urgencyColor}20`,
                            color: analysisResult.details.urgencyColor,
                            fontWeight: 700,
                          }}
                        />
                      </div>
                      <Typography className={classes.diseaseTitle}>
                        {analysisResult.details.friendlyName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" style={{ marginTop: 4 }}>
                        {analysisResult.details.summary}
                      </Typography>
                    </div>

                    <ConfidenceGauge confidence={analysisResult.confidence} size={110} />
                  </div>

                  {/* Action Bar: Retake, Share, Print */}
                  <div className={`${classes.actionButtonRow} no-print`}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={handleClearImage}
                    >
                      Scan Another Leaf
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ShareIcon />}
                      onClick={handleShare}
                    >
                      Share Diagnosis
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PrintIcon />}
                      onClick={handlePrint}
                    >
                      Print Report
                    </Button>
                  </div>
                </div>

                {/* Comprehensive Recommendations Panel */}
                <RemediesPanel
                  details={analysisResult.details}
                  resultId={savedScanId}
                />
              </div>
            )}

            {!isLoading && !analysisResult && (
              <Card className={`${classes.resultCard} no-print`} style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>🌿</div>
                <Typography variant="h5" style={{ fontWeight: 700, marginBottom: 8 }}>
                  Ready to diagnose {currentCropObj.name}
                </Typography>
                <Typography variant="body1" color="textSecondary" style={{ maxWidth: 440, margin: "0 auto 20px auto" }}>
                  Upload a photo of a single leaf to identify symptoms, disease severity, and step-by-step remedy plans.
                </Typography>
                <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CameraAltIcon />}
                    onClick={() => cameraInputRef.current && cameraInputRef.current.click()}
                  >
                    Take Photo
                  </Button>
                </div>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar notification */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        message={toastMessage}
      />
    </div>
  );
};

export default Scan;
