import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import apiClient from "../services/http";

const useStyles = makeStyles((theme) => ({
  wrap: { paddingTop: theme.spacing(5), paddingBottom: theme.spacing(8), minHeight: "70vh" },
  card: { padding: theme.spacing(3), borderRadius: 20, height: "100%" },
  title: { fontFamily: "'Lora', Georgia, serif", fontWeight: 700, marginBottom: theme.spacing(3) },
  metric: { fontSize: "2rem", fontWeight: 800, color: theme.palette.primary.main },
  row: { display: "grid", gridTemplateColumns: "minmax(90px, 1fr) 3fr 42px", alignItems: "center", gap: 12, margin: "16px 0" },
  track: { height: 12, borderRadius: 8, background: theme.palette.type === "dark" ? "#334236" : "#E8EFE5", overflow: "hidden" },
  bar: { height: "100%", borderRadius: 8, background: theme.palette.primary.main },
}));

const BarList = ({ items, labelKey, title, classes }) => {
  const max = Math.max(1, ...items.map((item) => item.count));
  return <Paper className={classes.card} elevation={0}>
    <Typography variant="h6" style={{ fontWeight: 700 }}>{title}</Typography>
    {items.length ? items.map((item) => <div className={classes.row} key={item[labelKey]}>
      <Typography variant="body2">{item[labelKey]}</Typography>
      <div className={classes.track}><div className={classes.bar} style={{ width: `${(item.count / max) * 100}%` }} /></div>
      <Typography variant="body2" align="right">{item.count}</Typography>
    </div>) : <Typography color="textSecondary" style={{ marginTop: 18 }}>No data yet.</Typography>}
  </Paper>;
};

const Stats = () => {
  const classes = useStyles();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    apiClient.get("/stats").then(({ data }) => setStats(data)).catch((err) => setError(err.response?.data?.message || "Could not load statistics."));
  }, []);
  if (error) return <Container className={classes.wrap}><Typography color="error">{error}</Typography></Container>;
  if (!stats) return <Container className={classes.wrap} style={{ textAlign: "center" }}><CircularProgress /></Container>;
  const healthItems = [{ label: "Healthy", count: stats.healthy }, { label: "Diseased", count: stats.diseased }];
  return <Container maxWidth="lg" className={classes.wrap}>
    <Typography variant="h1" className={classes.title}>Crop Health Statistics</Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}><Paper className={classes.card} elevation={0}><Typography color="textSecondary">Total scans</Typography><Typography className={classes.metric}>{stats.total}</Typography></Paper></Grid>
      <Grid item xs={12} sm={4}><Paper className={classes.card} elevation={0}><Typography color="textSecondary">Healthy</Typography><Typography className={classes.metric}>{stats.healthy}</Typography></Paper></Grid>
      <Grid item xs={12} sm={4}><Paper className={classes.card} elevation={0}><Typography color="textSecondary">Diseased</Typography><Typography className={classes.metric}>{stats.diseased}</Typography></Paper></Grid>
      <Grid item xs={12} md={6}><BarList items={stats.scansPerCrop} labelKey="cropName" title="Scans per crop" classes={classes} /></Grid>
      <Grid item xs={12} md={6}><BarList items={healthItems} labelKey="label" title="Healthy vs diseased" classes={classes} /></Grid>
      <Grid item xs={12}><BarList items={stats.topDiseases} labelKey="disease" title="Most common diseases" classes={classes} /></Grid>
    </Grid>
  </Container>;
};

export default Stats;
