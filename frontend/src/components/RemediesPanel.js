import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import StopIcon from "@material-ui/icons/Stop";
import EcoIcon from "@material-ui/icons/EcoOutlined";
import ScienceIcon from "@material-ui/icons/OpacityOutlined";
import WarningIcon from "@material-ui/icons/WarningOutlined";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import EventRepeatIcon from "@material-ui/icons/AutorenewOutlined";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { getChecklistProgress, saveChecklistProgress } from "../services/historyStorage";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 20,
    padding: theme.spacing(3),
    boxShadow: theme.palette.type === "dark"
      ? "0 4px 20px rgba(0, 0, 0, 0.4)"
      : "0 4px 24px rgba(65, 50, 40, 0.07)",
    border: `1px solid ${theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(79, 111, 82, 0.12)"}`,
  },
  header: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2.5),
  },
  title: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 700,
    fontSize: "1.4rem",
    color: theme.palette.text.primary,
  },
  ttsButton: {
    borderRadius: 12,
    fontWeight: 700,
  },
  sectionTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 600,
    fontSize: "1.1rem",
    color: theme.palette.text.primary,
    marginTop: theme.spacing(2.5),
    marginBottom: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  sectionSubtitle: {
    fontSize: "0.92rem",
    color: theme.palette.text.secondary,
    lineHeight: 1.6,
    marginBottom: theme.spacing(1.5),
  },
  bulletList: {
    listStyleType: "none",
    paddingLeft: 0,
    margin: theme.spacing(1, 0),
  },
  bulletItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(0.9),
    fontSize: "0.93rem",
    lineHeight: 1.5,
    color: theme.palette.text.primary,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
    marginTop: 8,
    flexShrink: 0,
  },
  actionItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(1),
    padding: theme.spacing(1.2),
    borderRadius: 12,
    backgroundColor: theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(79, 111, 82, 0.04)",
    marginBottom: theme.spacing(1),
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.06)" : "rgba(79, 111, 82, 0.08)",
    },
  },
  actionCompleted: {
    textDecoration: "line-through",
    opacity: 0.65,
  },
  tabRoot: {
    minHeight: 42,
    borderRadius: 12,
    backgroundColor: theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(79, 111, 82, 0.08)",
    padding: 3,
    marginBottom: theme.spacing(2),
  },
  tabItem: {
    minHeight: 36,
    borderRadius: 10,
    fontWeight: 700,
    fontSize: "0.88rem",
    textTransform: "none",
  },
  expertBox: {
    backgroundColor: theme.palette.type === "dark" ? "rgba(200, 105, 74, 0.15)" : "#FDF4F0",
    border: `1px solid ${theme.palette.type === "dark" ? "rgba(200, 105, 74, 0.3)" : "rgba(200, 105, 74, 0.25)"}`,
    borderRadius: 14,
    padding: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  disclaimerBox: {
    backgroundColor: theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.02)" : "#F8F7F4",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 14,
    padding: theme.spacing(2),
    marginTop: theme.spacing(2.5),
  },
}));

const RemediesPanel = ({ details, resultId }) => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Load saved checklist for this scan result
  useEffect(() => {
    if (resultId) {
      const saved = getChecklistProgress(resultId);
      setCheckedItems(saved || {});
    }
  }, [resultId]);

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!details) return null;

  const handleToggleCheck = (index) => {
    const updated = {
      ...checkedItems,
      [index]: !checkedItems[index],
    };
    setCheckedItems(updated);
    if (resultId) {
      saveChecklistProgress(resultId, updated);
    }
  };

  const handleSpeak = () => {
    if (!speechSupported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = [
      `Diagnosis: ${details.friendlyName}.`,
      details.whatIsIt,
      "What to do now:",
      ...(details.actionPlan || []),
      "Prevent next season:",
      ...(details.preventionNextSeason || []),
    ].join(" ");

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const totalActions = details.actionPlan ? details.actionPlan.length : 0;
  const completedActions = Object.values(checkedItems).filter(Boolean).length;

  return (
    <Paper elevation={0} className={`${classes.root} print-card`}>
      {/* Header with Title, Severity and Listen Button */}
      <div className={classes.header}>
        <div>
          <Typography className={classes.title}>Treatment & Agronomic Guide</Typography>
          <Typography variant="body2" color="textSecondary">
            {details.isHealthy
              ? "Preventive plant health management recommendations"
              : `Severity: ${details.severity} • Action checklist progress: ${completedActions}/${totalActions}`}
          </Typography>
        </div>

        {speechSupported && (
          <Button
            variant="outlined"
            size="small"
            color={isSpeaking ? "secondary" : "primary"}
            onClick={handleSpeak}
            startIcon={isSpeaking ? <StopIcon /> : <VolumeUpIcon />}
            className={`${classes.ttsButton} no-print`}
          >
            {isSpeaking ? "Stop Audio" : "Listen (Speech)"}
          </Button>
        )}
      </div>

      <Divider style={{ margin: "12px 0 20px 0" }} />

      {/* 1. What is it? */}
      <div>
        <Typography className={classes.sectionTitle}>
          <HelpOutlineIcon color="primary" fontSize="small" /> What is it?
        </Typography>
        <Typography className={classes.sectionSubtitle}>{details.whatIsIt}</Typography>
      </div>

      {/* 2. Symptoms to confirm */}
      {details.symptoms && details.symptoms.length > 0 && (
        <div>
          <Typography className={classes.sectionTitle}>
            <CheckCircleOutlineIcon color="primary" fontSize="small" /> Symptoms to Confirm
          </Typography>
          <ul className={classes.bulletList}>
            {details.symptoms.map((symptom, idx) => (
              <li key={idx} className={classes.bulletItem}>
                <span className={classes.bulletDot} />
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 3. Action Plan (Interactive Checklist) */}
      {details.actionPlan && details.actionPlan.length > 0 && (
        <div>
          <Typography className={classes.sectionTitle}>
            <EcoIcon color="primary" fontSize="small" />
            {details.isHealthy ? "Recommended Maintenance Routine" : "What to Do Now (Action Plan)"}
          </Typography>
          <div>
            {details.actionPlan.map((step, idx) => {
              const isChecked = Boolean(checkedItems[idx]);
              return (
                <div key={idx} className={classes.actionItem}>
                  <Checkbox
                    checked={isChecked}
                    onChange={() => handleToggleCheck(idx)}
                    color="primary"
                    size="small"
                    style={{ padding: 4 }}
                    inputProps={{ "aria-label": `Step ${idx + 1}: ${step}` }}
                  />
                  <div style={{ marginTop: 2 }}>
                    <Typography
                      variant="body2"
                      style={{
                        fontWeight: 600,
                        lineHeight: 1.45,
                      }}
                      className={isChecked ? classes.actionCompleted : ""}
                    >
                      <strong>Step {idx + 1}:</strong> {step}
                    </Typography>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Treatment Tabs (Organic vs Chemical) */}
      {!details.isHealthy && (
        <div style={{ marginTop: 24 }}>
          <Typography className={classes.sectionTitle}>
            <ScienceIcon color="primary" fontSize="small" /> Remedies & Treatments
          </Typography>

          <Tabs
            value={tabIndex}
            onChange={(e, val) => setTabIndex(val)}
            indicatorColor="primary"
            textColor="primary"
            className={`${classes.tabRoot} no-print`}
            variant="fullWidth"
          >
            <Tab label="🌱 Organic & Low-Cost Options" className={classes.tabItem} />
            <Tab label="🧪 Conventional & Chemical Options" className={classes.tabItem} />
          </Tabs>

          {/* Organic Tab */}
          <div style={{ display: tabIndex === 0 ? "block" : "none" }}>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 8, fontStyle: "italic" }}>
              Safe for organic growers, small gardens, and beneficial pollinators:
            </Typography>
            <ul className={classes.bulletList}>
              {details.organicRemedies?.map((rem, idx) => (
                <li key={idx} className={classes.bulletItem}>
                  <span className={classes.bulletDot} style={{ backgroundColor: "#4F6F52" }} />
                  <span>{rem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Chemical Tab */}
          <div style={{ display: tabIndex === 1 ? "block" : "none" }}>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: 8, fontStyle: "italic" }}>
              For severe field outbreaks; follow product label and safety PPE:
            </Typography>
            <ul className={classes.bulletList}>
              {details.chemicalRemedies?.map((rem, idx) => (
                <li key={idx} className={classes.bulletItem}>
                  <span className={classes.bulletDot} style={{ backgroundColor: "#C8694A" }} />
                  <span>{rem}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 5. Prevent Next Season */}
      {details.preventionNextSeason && details.preventionNextSeason.length > 0 && (
        <div>
          <Typography className={classes.sectionTitle}>
            <EventRepeatIcon color="primary" fontSize="small" /> Prevent it Next Season
          </Typography>
          <ul className={classes.bulletList}>
            {details.preventionNextSeason.map((prev, idx) => (
              <li key={idx} className={classes.bulletItem}>
                <span className={classes.bulletDot} />
                <span>{prev}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. When to call an expert */}
      {details.whenToCallExpert && (
        <div className={classes.expertBox}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <WarningIcon style={{ color: "#C8694A" }} fontSize="small" />
            <Typography variant="subtitle2" style={{ fontWeight: 700, color: "#C8694A" }}>
              When to Consult an Agricultural Extension Officer
            </Typography>
          </div>
          <Typography variant="body2" style={{ fontSize: "0.88rem", lineHeight: 1.5 }}>
            {details.whenToCallExpert}
          </Typography>
        </div>
      )}

      {/* Disclaimer */}
      <div className={classes.disclaimerBox}>
        <Typography variant="caption" color="textSecondary" style={{ display: "block", lineHeight: 1.45 }}>
          <strong>Agronomic Disclaimer:</strong> LeafLens provides AI-driven preliminary guidance based on visual leaf characteristics. Confirm critical disease diagnoses with certified agronomists or local extension agents before applying regulated chemical treatments.
        </Typography>
      </div>
    </Paper>
  );
};

export default RemediesPanel;
