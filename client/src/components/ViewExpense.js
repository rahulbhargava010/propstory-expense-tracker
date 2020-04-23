import React, { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import ReceiptIcon from "@material-ui/icons/Receipt";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import { Table } from "react-bootstrap";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
let totalSpending = 0;
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
export default function ViewExpense(props) {
  const classes = useStyles();
  const [project, setProject] = React.useState("");
  const [projects, setProjects] = React.useState([]);
  const [result, setResult] = React.useState([]);
  const handleChangeProject = event => {
    setProject(event.target.value);
  };
  useEffect(() => {
    axios
      .get("http://localhost:3050/project/getProjects")
      .then(response => {
        console.log(response);
        let projects = response.data.projects;
        setProjects(projects);
      })
      .catch(err => console.log(err));
  }, []);

  async function handleViewExpenseSubmit(e) {
    totalSpending = 0;
    console.log(e);
    console.log("VIEWING");
    e.preventDefault();
    await axios
      .post("http://localhost:3050/project/projectData", {
        project: e.target.project.value,
        startDate: e.target.startDate.value,
        endDate: e.target.endDate.value
      })
      .then(async function(response) {
        console.log("comin inside then");

        console.log(response);
        let result = response.data.spendings;
        setResult(result);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  console.log(result);

  return (
    <div>
      <Container maxWidth="md">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <ReceiptIcon />
          </Avatar>
          <Typography style={{ paddingBottom: 16 }} component="h1" variant="subtitle">
            View Your Project Expenses
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={handleViewExpenseSubmit}
          >
            <Grid container spacing={2}>
              <Grid item lg={4} xs={12}>
                <InputLabel id="demo-simple-select-label">
                  Select Project
                </InputLabel>

                <select
                  class="custom-select"
                  id="projectSelect"
                  name="project"
                  required
                  value={project}
                  onChange={handleChangeProject}
                  style={{ width: "100%" }}
                >
                  {projects &&
                    projects.map(project => {
                      return (
                        <option key={project._id} value={project._id}>
                          {project.name}
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
                  required
                  fullWidth
                  name="startDate"
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
                  required
                  fullWidth
                  name="endDate"
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
              View Expense
            </Button>
          </form>
        </div>
        {
      <Typography component="h3" variant="subtitle" >TOTAL SPENDING IS {totalSpending } </Typography>}
        <Table style={{ alignSelf: "center" }} striped bordered hover>
        <thead>
          <tr>
            <th>ACTUAL LEADS</th>
            <th>PLANNED LEADS</th>
            <th>CPL</th>
            <th>CLICK</th>
            <th>IMPRESSIONS</th>
            <th>TOTAL SPENDING</th>

            <th>TOTAL BUDGET</th>

            <th>SPENT ON</th>
            <th>CAMPAIGN START DATE</th>
          </tr>
        </thead>
        <tbody>
         
          {result &&
            result.map(spending => {
              let totalSpendings = parseInt(spending.totalSpending);
              totalSpending = totalSpending + totalSpendings;
              console.log(totalSpending);

              return (
                <tr key={spending._id}>
                  <td>{spending.actualLeads}</td>
                  <td>{spending.plannedLeads}</td>
                  <td>{spending.cpl}</td>
                  <td>{spending.clicks}</td>
                  <td>{spending.impressions}</td>
                  <td>{spending.totalSpending}</td>

                  <td>{spending.totalBudget}</td>
                  <td>{spending.spendingDate}</td>
                  <td>{spending.campaignStartDate}</td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      
      </Container>


    </div>
  );
}
