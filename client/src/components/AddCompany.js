import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
// import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
// import InputLabel from "@material-ui/core/InputLabel";
import Dashboard from "./Dashboard";

const token = localStorage.getItem('LoginToken');

const options = {
  headers: {'Authorization': 'Bearer '+ token }
 
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    height: 50,
    fontSize: 24,
    fontWeight: "bold",
  },
}));

export default function AddCompany(props) {
  const classes = useStyles();
  if (token == null) {
    return <h1>YOU R NOT LOGGED IN</h1>;
  } else { 
  return (
    <>
      <Dashboard />
      <Container maxWidth="md">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LocationCityIcon />
          </Avatar>
          <Typography component="h1" variant="p">
            Add Your Company
          </Typography>

          <form
            className={classes.form}
            noValidate
            onSubmit={props.handleCompanySubmit}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="company"
                  name="company"
                  variant="outlined"
                  required
                  fullWidth
                  id="company"
                  label="Enter Company"
                  autoFocus
                  size="small"
                />
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Add Company
              </Button>
            </Grid>

            <Grid container justify="flex-end"></Grid>
          </form>
        </div>
      </Container>
    </>
  );}
}

// export default Login
