import React, { useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import EditIcon from "@material-ui/icons/Edit";
import Chip from "@material-ui/core/Chip";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import { IconButton, MenuItem } from "@material-ui/core";
import AssignedProjects from './AssignedProjects'

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

// const AssignedProjects = ({ user }) => {
//   const classes = useStyles();

//   let [projects, setProjects] = React.useState([]);
//   useEffect(() => {
//     axios
//       .post(
//         "http://localhost:3050/project/getProjects",
//         {
//           user_id: user._id,
//           company_id: user.company,
//         },
//         options
//       )
//       .then(function (response) {
//         console.log(response);
//         setProjects(response.data.projects);
//       });
//   }, []);

//   return (
//     <Paper component="ul" className={classes.rootarray}>
//       {projects &&
//         projects.map((data) => {
//           return (
//             <li key={data._id}>
//               <Chip
//                 label={data.name}
//                 className={classes.chip}
//                 size="small"
//                 color="primary"
//               />
//             </li>
//           );
//         })}
//     </Paper>
//   );
// };

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
                  {user.enable ? (
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
