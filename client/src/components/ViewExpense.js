import React, { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { Modal } from "react-bootstrap";
import Dashboard from "./Dashboard";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import ReceiptIcon from "@material-ui/icons/Receipt";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Table from "./Table";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import CalcDrawer from "./CalcDrawer";
let totalSpending = 0;

const token = localStorage.getItem("LoginToken");
const role = localStorage.getItem("userRole");

const options = {
  headers: { Authorization: "Bearer " + token },
};

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
export default function ViewExpense(props) {
  const classes = useStyles();
  const [project, setProject] = React.useState("");
  const [result, setResult] = React.useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [city, setCity] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState("");

  const handleChangeCampaign = (event) => {
    setCity(event.target.value);
  };

  useEffect(() => {
    props.handleGetProjects();
  }, []);
  const handleChangeProject = (event) => {
    setProject(event.target.value);
  };

  const _Edit = (data) => {
    setModalShow(true);
    console.log(data);
    setData(data);
  };

  const handleViewExpenseSubmit = (e) => {
    // console.log(e.target.project.value);
    // console.log(e.target.startDate.value);
    // console.log(e.target.endDate.value);
    totalSpending = 0;
    // alert(e.target.project.value)
    console.log(e);
    e.preventDefault();

    axios
      .post("http://expenses.propstory.com/project/projectData", {
        project: e.target.project.value,
        startDate: e.target.startDate.value,
        endDate: e.target.endDate.value,
      })
      .then(function (response) {
        console.log(response);
        let result = response.data.spendings;
        setResult(result);
        console.log(result.cpl);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  async function _Delete(id) {
    console.log(id);
    setDeleteId(id);
    setShow(true);
  }
  async function handleDelete() {
    await axios
      .post(
        "http://expenses.propstory.com/expenses/delete",
        {
          _id: deleteId,
        },
        options
      )
      .then(async function (response) {
        console.log("DELETED SUCCESSFULLY");
        console.log(response);
        alert("DELETED SELECTED EXPENSE SUCCESSFULLY");
        window.location.reload(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const handleClose = () => setShow(false);
  if (token == null) {
    return <h1>YOU R NOT LOGGED IN</h1>;
  } else {
    return (
      <>
        <Dashboard />

        <div>
          <CalcDrawer />

          <Container maxWidth="lg">
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <ReceiptIcon />
              </Avatar>
              <Typography
                style={{ paddingBottom: 16 }}
                component="h1"
                variant="subtitle"
              >
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
                      value={project}
                      onChange={handleChangeProject}
                      style={{ width: "100%" }}
                    >
                      {props.projects &&
                        props.projects.map((project) => {
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
              <Typography component="h3" variant="subtitle">
                TOTAL SPENDING IS {totalSpending}
              </Typography>
            }
          </Container>
          <Container maxWidth="xl">
            <Table onPressEdit={_Edit} onPressDelete={_Delete} result={result} />
          </Container>

          <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                EDIT SPENDINGS
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form
                className={classes.form}
                noValidate
                onSubmit={props.handleUpdateExpense}
              >
                <TextField name="expenseid" hidden value={data.ID} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <InputLabel id="demo-simple-select-label">
                      Select Project
                    </InputLabel>

                    <select
                      className="custom-select"
                      id="projectSelect"
                      name="project"
                      value={project}
                      onChange={handleChangeProject}
                      style={{ width: "100%" }}
                    >
                      {props.projects &&
                        props.projects.map((project) => {
                          return (
                            <option key={project._id} value={project._id}>
                              {project.name}
                            </option>
                          );
                        })}
                    </select>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputLabel id="demo-simple-select-label">
                      Select Campaign Type
                    </InputLabel>

                    <select
                      className="custom-select"
                      id="projectSelect"
                      name="campaignType"
                      value={city}
                      onChange={handleChangeCampaign}
                      style={{ width: "100%" }}
                    >
                      <option value="GDN">Google - GDN</option>
                      <option value="GSN">Google - GSN</option>
                      <option value="Google">Google</option>
                      <option value="Facebook Lead Form">
                        Facebook Lead Form
                      </option>
                      <option value="Facebook LP">Facebook LP</option>
                      <option value="Taboola">Taboola</option>
                      <option value="Calls/Chats">Calls/Chats</option>
                    </select>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      autoComplete="actualLeads"
                      name="actualLeads"
                      variant="outlined"
                      fullWidth
                      id="actualLeads"
                      label={"Actual Leads " + data.ACTUAL_LEADS}
                      autoFocus
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="plannedLeads"
                      label={"Planned Leads " + data.PLANNED_LEADS}
                      name="plannedLeads"
                      autoComplete="plannedLeads"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="totalSpending"
                      label={"Total Spending " + data.TOTAL_SPENDING}
                      name="totalSpending"
                      autoComplete="totalSpending"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      name="totalBudget"
                      label={"Total Budget " + data.TOTAL_BUDGET}
                      id="totalBudget"
                      autoComplete="totalBudget"
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      name="cpl"
                      label={"CPL " + data.CPL}
                      id="cpl"
                      autoComplete="cpl"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      name="clicks"
                      label={"Clicks " + data.CLICK}
                      id="clicks"
                      autoComplete="clicks"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      name="impressions"
                      label={"Impressions " + data.IMPRESSIONS}
                      id="impressions"
                      autoComplete="impressions"
                      size="small"
                    />
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <InputLabel shrink htmlFor="bootstrap-input">
                      Spending Date
                    </InputLabel>
                    <TextField
                      fullWidth
                      name="spendingDate"
                      id="outlined-spendingDate"
                      type="date"
                      autoComplete="spendingDate"
                    />
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <InputLabel shrink htmlFor="bootstrap-input">
                      Campaign Start Date
                    </InputLabel>
                    <TextField
                      fullWidth
                      name="campaignStartDate"
                      id="outlined-campaignStartDate"
                      type="date"
                      autoComplete="campaignStartDate"
                    />
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Update Expense
                  </Button>
                </Grid>

                <Grid container justify="flex-end"></Grid>
              </form>
            </Modal.Body>
          </Modal>
          <Modal show={show} centered animation={false}>
            <Modal.Header>
              <Modal.Title>Are you sure you want to delete?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                CANCEL
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDelete}
              >
                YES! DELETE
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </>
    );
  }
}
