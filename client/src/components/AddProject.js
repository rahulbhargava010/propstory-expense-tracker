import React, {useEffect} from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import ReceiptIcon from "@material-ui/icons/Receipt";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import axios from "axios";
import Dashboard from "./Dashboard";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import NotLoginView from "./NotLoginView";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
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

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    height: 50,
    fontSize: 24,
    fontWeight: "bold"
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function AddProject(props) {
  const classes = useStyles();

  const [city, setCity] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [cities, setCities] = React.useState([]);

  const handleChangeCity = event => {
    setCity(event.target.value);
  };
  const handleChangeCompany = event => {
    setCompany(event.target.value);
  };

  useEffect(() => {
      props.handleGetCompanies();

      axios
      .get("https://expenses.propstory.com/api/getCities")
      .then(response => {
        console.log(response);

        let cities = response.data.cities;
        console.log(cities);
        setCities( cities );
      }, options)
      .catch(err => console.log(err));
  }, []);


  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    setOpen(props.alert);

  }, [props.alert])


  if (token == null) {
    return <NotLoginView />;
  } else { 
  return (
    <>
    <Dashboard />
    <Container maxWidth="md">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ReceiptIcon />
        </Avatar>
        <Typography style={{paddingBottom: 16}} component="h1" variant="p">
          Add Your Project
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={props.handleProjectSubmit}
        >
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="project"
                label="Name of the project"
                id="totalBudget"
                autoComplete="totalBudget"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="demo-simple-select-label">
                Select Company
              </InputLabel>

              <select
                class="custom-select"
                name="company"
                id="company"
                onChange={handleChangeCompany}
                style={{ width: "100%" }}
              >
                 {props.companies && props.companies.map(company => {
                  return <option value={company._id}>{company.name}</option>;
                })}
              </select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="demo-simple-select-label">Select City</InputLabel>

              <select
                class="custom-select"
                name="city"
                id="city"
                onChange={handleChangeCity}
                style={{ width: "100%" }}
              >
                   {cities.map(city => {
                  return <option value={city._id}>{city.name}</option>;
                })}
              </select>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Add Project
            </Button>
          </Grid>

          <Grid container justify="flex-end"></Grid>
        </form>
      </div>
    
    </Container>
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Added your project successfully
        </Alert>
      </Snackbar>
  </>
  );}
}

// export default Login
