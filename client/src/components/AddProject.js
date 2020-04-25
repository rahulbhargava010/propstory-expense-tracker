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
  }
}));

export default function AddProject(props) {
  const classes = useStyles();

  const [city, setCity] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [companies, setCompanies] = React.useState([]);
  const [cities, setCities] = React.useState([]);

  const handleChangeCity = event => {
    setCity(event.target.value);
  };
  const handleChangeCompany = event => {
    setCompany(event.target.value);
  };

  useEffect(() => {
    axios
      .get("http://expenses.propstory.com/api/getCompanies")
      .then(response => {
        console.log(response);

        let companies = response.data.companies;
        console.log(companies);
        setCompanies( companies );
      })
      .catch(err => console.log(err));

      axios
      .get("http://expenses.propstory.com/api/getCities")
      .then(response => {
        console.log(response);

        let cities = response.data.cities;
        console.log(cities);
        setCities( cities );
      })
      .catch(err => console.log(err));
  }, []);

  return (
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
          onSubmit={props.hanldeExpenseSubmit}
        >
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="totalBudget"
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
                id="projectSelect"
                value={company}
                onChange={handleChangeCompany}
                style={{ width: "100%" }}
              >
                 {companies.map(company => {
                  return <option>{company.name}</option>;
                })}
              </select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="demo-simple-select-label">Select City</InputLabel>

              <select
                class="custom-select"
                id="projectSelect"
                value={city}
                onChange={handleChangeCity}
                style={{ width: "100%" }}
              >
                   {cities.map(city => {
                  return <option>{city.name}</option>;
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
  );
}

// export default Login
