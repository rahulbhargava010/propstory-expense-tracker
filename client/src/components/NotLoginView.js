import React from "react";
import Alert from "../assets/alert.png";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 60,
    lineHeight: 2,
  },
});

export default function Types() {
  const classes = useStyles();

  return (
    <div
      className="d-flex align-items-center justify-content-center pt-5"
      style={{ height: 600, flexDirection: "column" }}
    >
      <img src={Alert} style={{ width: 200 }} />
      <h1 className="linknotlogin">
        Your haven't logged in yet. Please Sign in from
        
      </h1>
      <a
          href="http://expenses.propstory.com/users/login"
          style={{ color: "#15eda3", fontSize: 60 }}
        >
          Here
        </a>
    </div>
  );
}
