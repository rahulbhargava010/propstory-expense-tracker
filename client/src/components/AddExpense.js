import React, { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import { Modal } from "react-bootstrap";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import axios from "axios";
import Dashboard from "./Dashboard";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import NotLoginView from "./NotLoginView";

const token = localStorage.getItem("LoginToken");
const userin = localStorage.getItem("LoggedinUser");
const userCompany = localStorage.getItem("userCompany");

const options = {
  headers: { Authorization: "Bearer " + token },
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
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
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function AddExpense(props) {
  const classes = useStyles();
  const [show, setShow] = React.useState(props.show);
  const [company, setCompany] = React.useState("");
  const [campaignNames, setCampaignNames] = React.useState([]);
  const [campaignName, setCampaignName] = React.useState("");
  const [city, setCity] = React.useState("");
  const [project, setProject] = React.useState("");
  const [actualLeads, setActualLeads] = React.useState("");
  const [totalSpending, setTotalSpending] = React.useState("");
  const [cpl, setCpl] = React.useState(0);
  const handleChangeCampaign = (event) => {
    setCity(event.target.value);
  };
  const handleChangeProject = (event) => {
    setProject(event.target.value);
  };

  const handleChangeCompany = event => {
    setCompany(event.target.value);
  };
  
  const handleChangeCampaignName = event => {
    setCampaignName(event.target.value);
  }

  const checkCPL = () => {
    if(!actualLeads == "" && !totalSpending == ""){
      setCpl(Number(totalSpending / actualLeads).toFixed(2))
    }
    else {
      setCpl(0)
    }
  }

  useEffect(() => {
    props.handleGetCompanies();
    props.handleGetProjects();
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

  if (token == null) {
    return <NotLoginView />;
  } else {
    return (
      <>
        <Dashboard />
        <Container maxWidth="md">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography style={{ paddingBottom: 16 }} component="h1">
              Add Your Daily Expense
            </Typography>
            <form
              className={classes.form}
              noValidate
              onSubmit={props.handleExpenseSubmit}
            >
              <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
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
                 <option key="" value="">
                            Select Company
                          </option>
                 {props.companies && props.companies.map(company => {
                  return <option value={company._id}>{company.name}</option>;
                })}
              </select>
            </Grid>
                <Grid item xs={12} sm={3}>
                  <InputLabel id="demo-simple-select-label">
                    Select Project
                  </InputLabel>

                  <select
                    className="custom-select"
                    id="projectSelect"
                    name="project"
                    required
                    value={project}
                    onChange={handleChangeProject}
                    style={{ width: "100%" }}
                  >
                     <option key="" value="">
                            Select Project
                          </option>
                    {props.projects &&
                      props.projects.filter(proj => proj.company == company).map((project) => {
                        return (
                          <option key={project._id} value={project._id}>
                            {project.name}
                          </option>
                        );
                      })}
                  </select>
                </Grid>
                <Grid item xs={12} sm={3}>
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
                    <option key="" value="">
                            Select Campaign Type
                          </option>
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
                <Grid item xs={12} sm={3}>
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
                <Grid item xs={12} sm={4}>
                  <TextField
                    autoComplete="actualLeads"
                    name="actualLeads"
                    variant="outlined"
                    required
                    fullWidth
                    value={actualLeads}
                    onChange={e => setActualLeads(e.target.value)}
                    onBlur={() => checkCPL()}
                    id="actualLeads"
                    label="Actual Leads"
                    autoFocus
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    autoComplete="allocation"
                    name="allocation"
                    variant="outlined"
                    required
                    fullWidth
                    id="allocation"
                    label="Allocation"
                    autoFocus
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="plannedLeads"
                    label="Planned Leads"
                    name="plannedLeads"
                    autoComplete="plannedLeads"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    value={totalSpending}
                    onChange={e => setTotalSpending(e.target.value)}
                    onBlur={() => checkCPL()}
                    id="totalSpending"
                    label="Total Spending"
                    name="totalSpending"
                    autoComplete="totalSpending"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="totalBudget"
                    label="Total Budget"
                    id="totalBudget"
                    autoComplete="totalBudget"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="cpl"
                    label="CPL"
                    id="cpl"
                    disabled
                    value={cpl}
                    autoComplete="cpl"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="clicks"
                    label="Clicks"
                    id="clicks"
                    autoComplete="clicks"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="impressions"
                    label="Impressions"
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
                    required
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
                    required
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
                  Add Expense
                </Button>
              </Grid>

              <Grid container justify="flex-end"></Grid>
            </form>
          </div>
          <Modal
            show={show}
            onHide={() => setShow(false)}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-custom-modal-styling-title">
                Custom Modal Styling
              </Modal.Title>
            </Modal.Header>
            <Modal.Body></Modal.Body>
          </Modal>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Added your expense successfully
        </Alert>
      </Snackbar>
        </Container>
      </>
    );
  }
}

// export default Login
