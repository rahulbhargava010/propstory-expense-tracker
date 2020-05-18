import React, { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Dashboard from "../Dashboard";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import NotLoginView from "../NotLoginView";
import FacebookIcon from "@material-ui/icons/Facebook";
import { makeStyles } from "@material-ui/core/styles";
import { Table } from "@material-ui/core";
import FbExpenseTable from "../FbExpenseTable";

let totalSpending = 0;

const token = localStorage.getItem("LoginToken");
const role = localStorage.getItem("userRole");

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
export default function FbExpense(props) {
  const classes = useStyles();
  const [result, setResult] = React.useState([]);
  useEffect(() => {
    handleViewExpenseSubmit();
  }, []);

  const handleViewExpenseSubmit = () => {
    axios
      .get("http://expenses.propstory.com/expenses/getAutomateExpenses")
      .then(function (response) {
        console.log(response);
        let result = response.data.spendings;
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
          </Container>
          <Container maxWidth="xl">
            <FbExpenseTable data={result} />
          </Container>
        </div>
      </>
    );
  }
}
