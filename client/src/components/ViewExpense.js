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
import NotLoginView from "./NotLoginView";
import CalcDrawer from "./CalcDrawer";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays } from "date-fns";
import { DateRangePicker } from "react-date-range";
import moment from 'moment';
import Loader from 'react-loader-spinner'
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import exportFromJSON from 'export-from-json'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
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
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));
export default function ViewExpense(props) {
  const classes = useStyles();
  const [project, setProject] = React.useState("");
  const [result, setResult] = React.useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState([]);
  const [city, setCity] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState("");
  const [alocModal, setAlocModal] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = React.useState(false);
  const [loading, setLoading] = React.useState(false)
  const [campaign, setCampaign] = React.useState("");
  const [viewDate, setViewDate] = React.useState(false);
  const [campaignNames, setCampaignNames] = React.useState([]);
  const [campaignName, setCampaignName] = React.useState("");
  const [state, setState] = React.useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date, 7),
      key: "selection",
    },
  ]);

  const handleChangeCampaign = (event) => {
    setCampaign(event.target.value);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleCloseDeleteAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenDeleteAlert(false);
  };

  const handleChangeCampaignName = event => {
    setCampaignName(event.target.value);
  }


  useEffect(() => {
    props.handleGetProjects();
  }, []);
  const handleChangeProject = (event) => {
    setProject(event.target.value);
  };

  const _Edit = (data) => {
    setModalShow(true);
    console.log(data);
    setSelectedData(data);
  };

  const _EditAllocation = (data) => {
    setAlocModal(true);
    console.log(data);
    setSelectedData(data);
  };
  const downloadCsv = () => {
    const start = moment(state[0].startDate).format("YYYY-MM-DD")
    const end = moment(state[0].endDate).format("YYYY-MM-DD")
    const parsedData = [];
    result.map((resData) => { return parsedData.push({ "Campaign Type": resData.campaignType, "Actual Leads": resData.actualLeads, "Allocation": resData.allocation, "Total Budget": resData.totalBudget, "Total Spending": resData.totalSpending, "CPL": resData.cpl, "Clicks": resData.clicks, "Impressions": resData.impressions, "Spending Date": resData.spendingDate, "Campaign Start Date": resData.campaignStartDate }) });
    const data = parsedData;

    const fileName = campaign + ' ' + 'Expense' + ' ' + start + ' ' + end
    const exportType = 'csv'
    exportFromJSON({ data, fileName, exportType })
  }
  const handleViewExpenseSubmit = (e) => {

    e.preventDefault();

    const start = moment(state[0].startDate).format("YYYY-MM-DD")
    const end = moment(state[0].endDate).format("YYYY-MM-DD")
    setLoading(true)
    setViewDate(false)


    axios
      .post("http://localhost:3050/project/projectData", {
        project: e.target.project.value,
        startDate: start,
        endDate: end,
        campaignType: e.target.campaignType.value,
        campaign: e.target.campaignName.value
      })
      .then(function (response) {
        console.log(response);
        let result = response.data.spendings;
        setResult(result);
        setLoading(false)

      })
      .catch(function (error) {
        console.log(error);
      });
  };


  useEffect(() => {
    
    const _this = this;

    axios
      .post(
        "http://expenses.propstory.com/campaign/getCampaignNames",
        {
          project_id: project,
        }
      )
      .then(function (response) {
        console.log(response.data);
        setCampaignNames(response.data.campaigns)
      })
      .catch(function (error) {
        console.log(error);
      });
 
}, [project])



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
        setOpenDeleteAlert(true);
        const start = moment(state[0].startDate).format("YYYY-MM-DD")
        const end = moment(state[0].endDate).format("YYYY-MM-DD")
        setLoading(true)
        setViewDate(false)
        setShow(false);
    
        axios
          .post("http://expenses.propstory.com/project/projectData", {
            project: project,
            startDate: start,
            endDate: end,
            campaignType: campaign,
            campaign: campaignName
          })
          .then(function (response) {
            console.log(response);
            let result = response.data.spendings;
            setResult(result);
            setLoading(false)
    
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function handleUpdateAllocation(e) {
    e.preventDefault();
    await axios
      .post("http://expenses.propstory.com/expenses/updateAllocation", {
        expense_id: e.target.expenseid.value,
        allocation: e.target.allocation.value,
      })
      .then(setOpen(true), setAlocModal(false));
  }
  const handleClose = () => setShow(false);
  if (token == null) {
    return <NotLoginView />;
  } else {
    return (
      <>
        <Dashboard />

        <div>
          <CalcDrawer />
          <Button onClick={() => downloadCsv()} variant="contained" color="secondary" startIcon={<AssignmentOutlinedIcon />} style={{ position: "fixed", right: 20, bottom: 20, fontWeight: 600 }}> <Typography
            component="h6"
            variant="subtitle"
            style={{ textTransform: "none", color: "#fff" }}
          >
            Download as csv
              </Typography></Button>
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
                <Grid container justify="center" spacing={2} className="mb-5">

                  <Grid item xs={12} sm={4}>
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
                </Grid>
                <Grid container justify="center" spacing={2}>

                  <Grid item xs={10} sm={3}>
                    <InputLabel id="demo-simple-select-label">
                      Select Campaign Type
                    </InputLabel>

                    <select
                      className="custom-select"
                      id="projectSelect"
                      name="campaignType"
                      value={campaign}
                      onChange={handleChangeCampaign}
                      style={{ width: "100%" }}
                    >
                      <option value="">All</option>
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
                  <Grid item xs={10} sm={3}>
                    <InputLabel id="demo-simple-select-label">
                      Select Date
                    </InputLabel>
                    <input placeholder="Date" style={{ width: "100%", height: 35, border: "1px solid #ced4da", borderRadius: "0.25rem", padding: ".375rem 1.75rem .375rem .75rem" }} onClick={() => setViewDate(true)} />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography
                      style={{ textAlign: "center", marginTop: 20 }}
                      component="h4"
                      variant="subtitle"
                    >
                      OR
              </Typography>
                  </Grid>

                  <Grid item xs={10} sm={3}>
                    <InputLabel id="demo-simple-select-label">
                      Select Campaign Name
                    </InputLabel>

                    <select
                    className="custom-select"
                    id="campaignName"
                    name="campaignName"
                    required
                    value={campaignName}
                    onChange={handleChangeCampaignName}
                    style={{ width: "100%" }}
                  >
                     <option key="" value="">
                          Select Campaign Name
                          </option>
                    {campaignNames &&
                      campaignNames.map((campaignName) => {
                        return (
                          <option key={campaignName._id} value={campaignName._id}>
                            {campaignName.name}
                          </option>
                        );
                      })}
                  </select>
                  </Grid>

                  {viewDate && <Grid container direction="row" justify="center" xs={12}>
                    <DateRangePicker
                      onChange={(item) => (setState([item.selection]))}
                      // showSelectionPreview={true}
                      moveRangeOnFirstSelection={false}
                      months={2}
                      ranges={state}
                      direction="horizontal"
                    />
                  </Grid>}
                  {/* <Grid item lg={6} xs={12}>
                  <InputLabel shrink htmlFor="bootstrap-input">
                    Start Date
                  </InputLabel>
                  <TextField
                    required
                    fullWidth
                    name="startDate"
                    id="outlined-startDate"
                    type="date"
                    autoComplete="startDate"
                  />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <InputLabel shrink htmlFor="bootstrap-input">
                    End Date
                  </InputLabel>
                  <TextField
                    required
                    fullWidth
                    name="endDate"
                    id="outlined-endDate"
                    type="date"
                    autoComplete="endDate"
                  />
                </Grid>*/}
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
          </Container>
          <Container maxWidth="lg">
            {loading ? <Loader
              type="TailSpin"
              color="rgb(245, 0, 87)"
              height={50}
              width={50}
            /> : result.length > 0 ? (
              <Table
                onPressEdit={_Edit}
                onPressDelete={_Delete}
                onEditAllocation={_EditAllocation}
                result={result}
              />
            ) : null}
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
                <TextField name="expenseid" hidden value={selectedData.ID} />
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
                      value={campaign}
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
                      label={"Actual Leads " + selectedData.ACTUAL_LEADS}
                      autoFocus
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="plannedLeads"
                      label={"Planned Leads " + selectedData.PLANNED_LEADS}
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
                      label={"Total Spending " + selectedData.TOTAL_SPENDING}
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
                      label={"Total Budget " + selectedData.TOTAL_BUDGET}
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
                      label={"CPL " + selectedData.CPL}
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
                      label={"Clicks " + selectedData.CLICK}
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
                      label={"Impressions " + selectedData.IMPRESSIONS}
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

          <Modal
            show={alocModal}
            onHide={() => setAlocModal(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                UPDATE ALLOCATION
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form
                className={classes.form}
                noValidate
                onSubmit={handleUpdateAllocation}
              >
                <TextField name="expenseid" hidden value={selectedData.ID} />
                <Grid item xs={12}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      variant="standard"
                      fullWidth
                      id="allocation"
                      label={"Allocation " + selectedData.ALLOCATIONS}
                      name="allocation"
                      autoComplete="allocation"
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
                    Update Allocation
                  </Button>
                </Grid>
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

          <Snackbar
            open={open}
            autoHideDuration={2000}
            onClose={handleCloseAlert}
          >
            <Alert onClose={handleCloseAlert} severity="info">
              Allocation has been updated!
            </Alert>
          </Snackbar>
          <Snackbar
            open={openDeleteAlert}
            autoHideDuration={2000}
            onClose={handleCloseDeleteAlert}
          >
            <Alert onClose={handleCloseAlert} severity="success">
              Selected expense has been deleted successfully!
            </Alert>
          </Snackbar>
        </div>
      </>
    );
  }
}
