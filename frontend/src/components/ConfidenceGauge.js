import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1.5),
  },
  svgWrapper: {
    position: "relative",
    width: (props) => props.size || 130,
    height: (props) => props.size || 130,
  },
  innerContent: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  percentText: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 700,
    fontSize: (props) => (props.size ? `${props.size * 0.22}px` : "1.7rem"),
    lineHeight: 1,
    color: theme.palette.text.primary,
  },
  labelText: {
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontWeight: 700,
    color: theme.palette.text.secondary,
    marginTop: 2,
  },
  statusChip: {
    marginTop: theme.spacing(1),
    fontWeight: 700,
    fontSize: "0.78rem",
    borderRadius: 12,
  },
}));

const ConfidenceGauge = ({ confidence = 0, size = 130, showLabel = true }) => {
  const classes = useStyles({ size });
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Normalize confidence (0 to 1 or 0 to 100)
  const score = confidence > 1 ? confidence : confidence * 100;
  const clamped = Math.max(0, Math.min(100, score));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(clamped);
    }, 100);
    return () => clearTimeout(timer);
  }, [clamped]);

  // Determine Level and Color
  let level = "Low Confidence";
  let gaugeColor = "#C8694A"; // Terracotta (<60%)
  let bgColor = "rgba(200, 105, 74, 0.12)";

  if (clamped >= 85) {
    level = "High Confidence";
    gaugeColor = "#4F6F52"; // Soft Green
    bgColor = "rgba(79, 111, 82, 0.12)";
  } else if (clamped >= 60) {
    level = "Moderate Confidence";
    gaugeColor = "#D9822B"; // Amber
    bgColor = "rgba(217, 130, 43, 0.12)";
  }

  // SVG circular calculations
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div className={classes.container}>
      <div className={classes.svgWrapper}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={bgColor}
            strokeWidth={strokeWidth}
          />
          {/* Animated progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={gaugeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease",
            }}
          />
        </svg>

        <div className={classes.innerContent}>
          <Typography className={classes.percentText}>
            {clamped.toFixed(0)}%
          </Typography>
          <span className={classes.labelText}>Match</span>
        </div>
      </div>

      {showLabel && (
        <Chip
          label={level}
          size="small"
          className={classes.statusChip}
          style={{
            backgroundColor: bgColor,
            color: gaugeColor,
            border: `1px solid ${gaugeColor}40`,
          }}
        />
      )}
    </div>
  );
};

export default ConfidenceGauge;
