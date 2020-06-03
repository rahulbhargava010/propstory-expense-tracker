import React, { useEffect, Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";


const token = localStorage.getItem("LoginToken");

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
var assignProjects = [];


const AssignedProjects = ({ user }) => {
  const classes = useStyles();

  useEffect(() => {
      axios
        .post(
          "http://expenses.propstory.com/project/getProjects",
          {
            user_id: user._id,
            company_id: user.company,
          },
          options
        )
        .then(function (response) {
          console.log(response);
          var obj = { userId: user._id, companies: response.data.projects };
          assignProjects.push(obj);
        });
  }, []);

  return (
    <Paper component="ul" className={classes.rootarray}>
      {assignProjects &&
        assignProjects
          .filter((userhere) => userhere.userId == user._id)
          .map((data) => {
            return data.companies.map((company) => {
              return (
                <li key={company._id}>
                  <Chip
                    label={company.name}
                    className={classes.chip}
                    size="small"
                    color="primary"
                  />
                </li>
              );
            });
          })}
    </Paper>
  );
};

export default AssignedProjects;
