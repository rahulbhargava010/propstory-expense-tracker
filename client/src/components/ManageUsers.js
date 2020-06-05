import React, { useEffect, Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Dashboard from "./Dashboard";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import GroupIcon from "@material-ui/icons/Group";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import ManageUsersTable from "./ManageUsersTable";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import NotLoginView from "./NotLoginView";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import MuiAlert from "@material-ui/lab/Alert";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Snackbar from "@material-ui/core/Snackbar";
import AssignedProjects from './AssignedProjects'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const token = localStorage.getItem("LoginToken");
const userId = localStorage.getItem("LoggedinUser");

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
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  papermodal: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[10],
    padding: theme.spacing(2, 4, 3),
    maxWidth: 800,
    borderRadius: 8,
  },
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  rootarray: {
    display: "flex",
    justifyContent: "start",
    flexWrap: "wrap",
    listStyle: "none",
    margin: 0,
    boxShadow: "none",
  },
}));



export default function ManageUsers(props) {
  const classes = useStyles();
  const [company, setCompany] = React.useState("");
  const [result, setResult] = React.useState([]);
  const [companyUsers, setCompanyUsers] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [assignProjectId, setAssignProjectId] = React.useState(null);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const handleChangeCompany = (event) => {
    setCompany(event.target.value);
  };

  const handleChangeAssignProject = (event) => {
    setAssignProjectId(event.target.value);
  };
  useEffect(() => {
    props.handleGetCompanies();
  }, []);

  const handleEdit = (data) => {
    setData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBar(false);
  };

  const handleAssignProject = () => {
    axios
      .post(
        "http://expenses.propstory.com/project/assignProject",
        {
          user_id: data._id,
          project_id: assignProjectId,
        },
        options
      )
      .then(function (response) {
        console.log(response);
        setOpenSnackBar(true);
        setOpen(false);
      });
  };

  const handleViewUserSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://expenses.propstory.com/api/getCompanyProjects", {
        company_id: company,
      })
      .then(function (response) {
        console.log(response);
        let result = response.data.companies;
        setResult(result);
      });

    axios
      .post(
        "http://expenses.propstory.com/users/getCompanyUsers",
        {
          company_id: company,
          user_id: userId,
        },
        options
      )
      .then(function (response) {
        console.log(response);
        setCompanyUsers(response.data.user);
      });
  };

  if (token == null) {
    return <NotLoginView />;
  } else {
    return (
      <>
        <Dashboard />
        <div>
          <Container maxWidth="lg">
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <GroupIcon />
              </Avatar>
              <Typography
                style={{ paddingBottom: 16 }}
                component="h1"
                variant="subtitle"
              >
                Manage Users
              </Typography>
              <form
                className={classes.form}
                noValidate
                onSubmit={handleViewUserSubmit}
              >
                <Grid container justify="center" spacing={2}>
                  <Grid item sm={6} xs={12}>
                    <InputLabel id="demo-simple-select-label">
                      Select Company
                    </InputLabel>

                    <select
                      class="custom-select"
                      id="projectSelect"
                      name="assignProject"
                      value={company}
                      onChange={handleChangeCompany}
                      style={{ width: "100%" }}
                    >
                      <option key={0} value={0}>
                        -- SELECT COMPANY --
                      </option>
                      {props.companies &&
                        props.companies.map((company) => {
                          return (
                            <option key={company._id} value={company._id}>
                              {company.name}
                            </option>
                          );
                        })}
                    </select>
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  View Users
                </Button>
              </form>
            </div>
          </Container>
          <Container maxWidth="lg">
            {companyUsers.length > 0 ? (
              <ManageUsersTable
                handleEdit={handleEdit}
                users={companyUsers}
                result={result}
                AssignedProjects={AssignedProjects}
              />
            ) : null}
          </Container>
        </div>
        <Modal
          aria-labelledby="Manage-user-modal"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.papermodal}>
              <form
                className={classes.form}
                noValidate
                onSubmit={handleAssignProject}
              >
                <TextField name="userid" hidden value={data._id} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <InputLabel id="demo-simple-select-label">
                      User Name
                    </InputLabel>

                    <h4 style={{ textTransform: "uppercase" }}>{data.name}</h4>
                  </Grid>
                    <Grid item xs={12} sm={4}>
                      <InputLabel id="demo-simple-select-label">
                        Assigned Projects
                      </InputLabel>
                      <AssignedProjects user={data} />
                    </Grid>
                  <Grid item xs={12} sm={4}>
                    <InputLabel id="demo-simple-select-label">
                      Account Status
                    </InputLabel>
                    {data.enable ? (
                      <div className="d-flex">
                        <FiberManualRecordIcon style={{ color: "#94fc13" }} />
                        <p> ACTIVED</p>
                      </div>
                    ) : (
                      <div className="d-flex">
                        <FiberManualRecordIcon style={{ color: "#fa163f" }} />
                        <p> NOT ACTIVATED</p>
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel id="demo-simple-select-label">
                      Assign New Project
                    </InputLabel>

                    <select
                      class="custom-select"
                      id="companySelect"
                      name="company"
                      value={assignProjectId}
                      onChange={handleChangeAssignProject}
                      style={{ width: "100%" }}
                    >
                      <option key={0} value={0}>
                        -- SELECT PROJECT --
                      </option>
                      {result &&
                        result.map((project) => {
                          return (
                            <option key={project._id} value={project._id}>
                              {project.name}
                            </option>
                          );
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
                    Update User
                  </Button>
                </Grid>

                <Grid container justify="flex-end"></Grid>
              </form>
            </div>
          </Fade>
        </Modal>
        <Snackbar
          open={openSnackBar}
          autoHideDuration={6000}
          onClose={handleCloseSnackBar}
        >
          <Alert onClose={handleCloseSnackBar} severity="success">
            Assigned Project Successfully!
          </Alert>
        </Snackbar>
      </>
    );
  }
}
