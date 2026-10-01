import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import WbSunnyIcon from "@material-ui/icons/WbSunnyOutlined";
import CenterFocusStrongIcon from "@material-ui/icons/CenterFocusStrong";
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";
import NatureIcon from "@material-ui/icons/NatureOutlined";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(2.5),
    backgroundColor: theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.04)" : "#F9F6F0",
    border: `1px dashed ${theme.palette.type === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(79, 111, 82, 0.25)"}`,
    borderRadius: 18,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
  },
  title: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 600,
    fontSize: "1.05rem",
    color: theme.palette.text.primary,
  },
  tipItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(1.2),
    marginBottom: theme.spacing(1),
  },
  tipIcon: {
    color: theme.palette.primary.main,
    fontSize: 20,
    marginTop: 2,
    flexShrink: 0,
  },
  tipText: {
    fontSize: "0.86rem",
    color: theme.palette.text.secondary,
    lineHeight: 1.4,
  },
}));

const PhotoTipsCard = () => {
  const classes = useStyles();

  const tips = [
    {
      icon: <CenterFocusStrongIcon className={classes.tipIcon} />,
      title: "Focus on a single leaf",
      desc: "Place one symptomatic leaf in clear focus rather than a whole bush.",
    },
    {
      icon: <WbSunnyIcon className={classes.tipIcon} />,
      title: "Natural, even lighting",
      desc: "Shoot in bright daylight or open shade. Avoid strong direct glare and dark shadows.",
    },
    {
      icon: <FilterCenterFocusIcon className={classes.tipIcon} />,
      title: "Fill 70%+ of the frame",
      desc: "Ensure the leaf blade covers most of the image with minimal background clutter.",
    },
    {
      icon: <NatureIcon className={classes.tipIcon} />,
      title: "Hold steady against blur",
      desc: "Hold camera 15–20 cm away and wait for sharp autofocus before capturing.",
    },
  ];

  return (
    <Paper elevation={0} className={classes.card}>
      <div className={classes.header}>
        <span style={{ fontSize: "1.2rem" }}>🌱</span>
        <Typography className={classes.title}>Photo Tips for Best Accuracy</Typography>
      </div>
      <Grid container spacing={1.5}>
        {tips.map((tip, idx) => (
          <Grid item xs={12} sm={6} key={idx} className={classes.tipItem}>
            {tip.icon}
            <div>
              <Typography variant="body2" style={{ fontWeight: 700, fontSize: "0.88rem" }}>
                {tip.title}
              </Typography>
              <Typography className={classes.tipText}>{tip.desc}</Typography>
            </div>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default PhotoTipsCard;
