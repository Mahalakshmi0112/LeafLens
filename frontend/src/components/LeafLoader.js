import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(4, 2),
    textAlign: "center",
  },
  leafIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: "50%",
    backgroundColor: theme.palette.type === "dark" ? "rgba(134, 167, 137, 0.15)" : "#E8F0E4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(2.5),
    boxShadow: "0 8px 24px rgba(79, 111, 82, 0.15)",
  },
  leafSvg: {
    width: 50,
    height: 50,
    color: theme.palette.primary.main,
    animation: "$sway 2.4s ease-in-out infinite",
    transformOrigin: "bottom center",
  },
  "@keyframes sway": {
    "0%": { transform: "rotate(0deg) scale(1)" },
    "25%": { transform: "rotate(-12deg) scale(1.05)" },
    "50%": { transform: "rotate(0deg) scale(1)" },
    "75%": { transform: "rotate(12deg) scale(1.05)" },
    "100%": { transform: "rotate(0deg) scale(1)" },
  },
  title: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 600,
    fontSize: "1.25rem",
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  message: {
    fontSize: "0.95rem",
    color: theme.palette.text.secondary,
    minHeight: 28,
    transition: "opacity 0.3s ease",
  },
  progressBar: {
    width: "100%",
    maxWidth: 260,
    height: 6,
    borderRadius: 3,
    marginTop: theme.spacing(2.5),
    backgroundColor: theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(79, 111, 82, 0.15)",
    "& .MuiLinearProgress-bar": {
      backgroundColor: theme.palette.primary.main,
      borderRadius: 3,
    },
  },
}));

const MESSAGES = [
  "Analyzing leaf structure & color pigments...",
  "Searching for lesion and chlorosis patterns...",
  "Evaluating features with deep neural network...",
  "Cross-referencing disease remedy database...",
  "Formulating customized agronomic action plan...",
];

const LeafLoader = ({ customTitle = "Diagnosing Leaf..." }) => {
  const classes = useStyles();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.leafIconWrapper}>
        <svg
          className={classes.leafSvg}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
        </svg>
      </div>

      <Typography className={classes.title}>{customTitle}</Typography>
      <Typography className={classes.message}>{MESSAGES[messageIndex]}</Typography>
      <LinearProgress className={classes.progressBar} />
    </div>
  );
};

export default LeafLoader;
