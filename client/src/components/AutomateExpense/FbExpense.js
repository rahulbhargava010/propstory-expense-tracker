import React, { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Dashboard from "../Dashboard";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import NotLoginView from "../NotLoginView";
import FacebookIcon from "@material-ui/icons/Facebook";
import { makeStyles } from "@material-ui/core/styles";
import FbExpenseTable from "../FbExpenseTable";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";

const token = localStorage.getItem("LoginToken");
const role = localStorage.getItem("userRole");
const options = {
  headers: { Authorization: "Bearer " + token },
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
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
export default function FbExpense(props) {
  const classes = useStyles();
  const [result, setResult] = React.useState([]);
  const [project, setProject] = React.useState(null);
  const [campaigns, setCampaigns] = React.useState([]);

  useEffect(() => {
    getCampaigns();
  }, []);

  const handleChangeProject = (event) => {
    setProject(event.target.value);
  };

  const getCampaigns = () => {
    axios
      .get("https://expenses.propstory.com/campaign/facebook", options)
      .then(function (response) {
        // console.log(response);
        setCampaigns(response.data.campaign);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleViewFbExpenseSubmit = (e) => {
    e.preventDefault();
     axios
      .post("https://expenses.propstory.com/expenses/getAutomateExpenses", {
        campaign_id: project,
        start_date: e.target.start_date.value,
        end_date: e.target.end_date.value,
        source: "facebook"
      })
      .then(function (response) {
        console.log(response);
        let result = response.data;
        setResult(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  if (token == null) {
    return <NotLoginView />;
  } else {
    return (
      <>
        <Dashboard />
      {console.log(project)
      }
        <div>
          <Container maxWidth="lg">
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <FacebookIcon />
              </Avatar>
              <Typography
                style={{ paddingBottom: 16 }}
                component="h1"
                variant="subtitle"
              >
                Facebook Automated Expenses
              </Typography>
            </div>

            <form
              className={classes.form}
              noValidate
              onSubmit={handleViewFbExpenseSubmit}
            >
              <Grid container spacing={2}>
                <Grid item lg={4} xs={12}>
                  <InputLabel id="demo-simple-select-label">
                    Select Campaign
                  </InputLabel>

                  <select
                    class="custom-select"
                    id="campaign"
                    name="campaign"
                    value={project}
                    onChange={handleChangeProject}
                    style={{ width: "100%" }}
                  >
                    {campaigns &&
                      campaigns.map((campaign) => {
                        return (
                          <option key={campaign.campaign_id} value={campaign.campaign_id}>
                            {campaign.campaign_name}
                          </option>
                        );
                      })}
                  </select>
                </Grid>
                <Grid item lg={4} xs={12}>
                  <InputLabel shrink htmlFor="bootstrap-input">
                    Enter Start Date
                  </InputLabel>
                  <TextField
                    fullWidth
                    name="start_date"
                    id="outlined-spendingDate"
                    type="date"
                    autoComplete="spendingDate"
                  />
                </Grid>
                <Grid item lg={4} xs={12}>
                  <InputLabel shrink htmlFor="bootstrap-input">
                    Enter End Date
                  </InputLabel>
                  <TextField
                    fullWidth
                    name="end_date"
                    id="outlined-campaignStartDate"
                    type="date"
                    autoComplete="campaignStartDate"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                View Facebook Expense
              </Button>
            
            </form>
          </Container>
          <Container maxWidth="lg">
            <FbExpenseTable data={result} />
          </Container>
        </div>
      </>
    );
  }
}
