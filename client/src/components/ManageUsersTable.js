import React, { useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import EditIcon from "@material-ui/icons/Edit";
import Chip from "@material-ui/core/Chip";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import { IconButton, MenuItem } from "@material-ui/core";
import { red, green } from "@material-ui/core/colors";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import axios from "axios";

const token = localStorage.getItem("LoginToken");
const userId = localStorage.getItem("LoggedinUser");

const options = {
  headers: { Authorization: "Bearer " + token },
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 580,
  },
  chip: {
    margin: theme.spacing(0.5),
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

const handleDelete = () => {
  console.info("You clicked the delete icon.");
};

const AssignedProjects = ({ user }) => {
  const classes = useStyles();

  let [projects, setProjects] = React.useState([]);
  useEffect(() => {
    axios
      .post(
        "https://expenses.propstory.com/project/getProjects",
        {
          user_id: user._id,
          company_id: user.company,
        },
        options
      )
      .then(function (response) {
        console.log(response);
        setProjects(response.data.projects);
      });
  }, []);

  return (
    <Paper component="ul" className={classes.rootarray}>
      {projects &&
        projects.map((data) => {
          return (
            <li key={data._id}>
              <Chip
                label={data.name}
                className={classes.chip}
                size="small"
                color="primary"
              />
            </li>
          );
        })}
    </Paper>
  );
};

const StatusSwitch = withStyles({
  switchBase: {
    color: red[600],
    "&$checked": {
      color: green[700],
    },
    "&$checked + $track": {
      backgroundColor: green[700],
    },
  },
  checked: {},
  track: {},
})(Switch);

export default function ManageUsersTable(props) {
  const classes = useStyles();
  const [age, setAge] = React.useState("");
  const [status, setStatus] = React.useState();

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const handleChangeStatus = (event) => {};
  const allProjects =
    props.result &&
    props.result.map((project) => {
      // console.log(totalLead)
      return (
        <Chip
          label={project.name}
          size="small"
          color="primary"
          style={{ marginRight: 5 }}
        />
      );
    });

  const handleChangeSwitch = (user) => {
    axios
      .post("https://expenses.propstory.com/users/changeUserStatus", {
        user_id: user._id,
        status: user.enable ? false : true,
      })
      .then(function (response) {
       props.callUserSubmit()
      });
  };

  return (
    <>
      <Paper className={classes.root}>
        {props.users &&
          props.users.map((user) => {
            return (
              <div className="d-flex justify-content-between p-2 border-bottom">
                <Grid item xs={2}>
                  <h5 style={{ textTransform: "uppercase" }}>{user.name}</h5>
                </Grid>
                <Grid item xs={1}>
                  <Chip label={user.role} size="small" variant="outlined" />
                </Grid>

                <Grid item xs={4}>
                  {user.role == "TEAM_MEMBER" ? (
                    <AssignedProjects user={user} />
                  ) : (
                    <div className="d-flex justify-content-start">
                      {allProjects}
                    </div>
                  )}
                </Grid>

                <Grid item>
                  <FormControlLabel
                    control={
                      <StatusSwitch
                        checked={user.enable}
                        onChange={() => handleChangeSwitch(user)}
                        name="checkedA"
                      />
                    }
                    label={user.enable ? "Activated" : "Disabled"}
                  />
                </Grid>
                <Grid item xs={1}>
                  {user.role == "TEAM_MEMBER" ? (
                    <IconButton
                      color="secondary"
                      size="small"
                      onClick={() => props.handleEdit(user)}
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                  ) : null}
                </Grid>
              </div>
            );
          })}
      </Paper>
    </>
  );
}
