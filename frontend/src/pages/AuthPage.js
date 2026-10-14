import React, { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import { useAuth } from "../context/AuthContext";
import apiClient from "../services/http";
import { getGuestScanHistory, clearGuestHistory } from "../services/historyStorage";

const useStyles = makeStyles((theme) => ({
  wrap: { minHeight: "70vh", display: "flex", alignItems: "center", paddingTop: theme.spacing(5), paddingBottom: theme.spacing(5) },
  card: { width: "100%", maxWidth: 480, margin: "0 auto", padding: theme.spacing(4), borderRadius: 22 },
  title: { fontFamily: "'Lora', Georgia, serif", fontWeight: 700, marginBottom: theme.spacing(1) },
  form: { display: "grid", gap: theme.spacing(2), marginTop: theme.spacing(3) },
}));

const AuthPage = ({ mode }) => {
  const classes = useStyles();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const registering = mode === "register";

  const importGuestHistory = async () => {
    const guestScans = getGuestScanHistory();
    if (!guestScans.length || !window.confirm(`Import ${guestScans.length} guest scan(s) into this account?`)) return;
    try {
      await apiClient.post("/scans/import", { scans: guestScans });
      clearGuestHistory();
      window.alert("Guest scan history imported successfully.");
    } catch (importError) {
      window.alert(importError.response?.data?.message || "Could not import guest history. Your local history was kept.");
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (registering) await register(form.name, form.email, form.password);
      else await login(form.email, form.password);
      await importGuestHistory();
      navigate(location.state?.from?.pathname || "/history", { replace: true });
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Unable to connect to the API. Check that the Express server is running on port 5001.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container maxWidth="sm" className={classes.wrap}>
      <Paper className={classes.card} elevation={0}>
        <Typography variant="h4" className={classes.title}>{registering ? "Create your LeafLens account" : "Welcome back"}</Typography>
        <Typography color="textSecondary">{registering ? "Save scans and track crop health across sessions." : "Sign in to view your saved scans and statistics."}</Typography>
        <form className={classes.form} onSubmit={submit}>
          {registering && <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required inputProps={{ minLength: 2, maxLength: 80 }} autoComplete="name" />}
          <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
          <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required inputProps={{ minLength: 8, maxLength: 128 }} autoComplete={registering ? "new-password" : "current-password"} />
          {error && <Typography color="error" role="alert">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" disabled={busy}>{busy ? "Please wait…" : registering ? "Register" : "Log in"}</Button>
        </form>
        <Typography style={{ marginTop: 24 }} color="textSecondary">
          {registering ? "Already have an account? " : "New to LeafLens? "}
          <Link component={RouterLink} to={registering ? "/login" : "/register"}>{registering ? "Log in" : "Create an account"}</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default AuthPage;
