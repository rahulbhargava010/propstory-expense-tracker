import React, { PureComponent } from "react";
import "./App.css";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  withRouter,
} from "react-router-dom";
import AddExpense from "./components/AddExpense";
import AddCity from "./components/AddCity";
import AddProject from "./components/AddProject";
import AddCompany from "./components/AddCompany";
import { Home, Login, Register, Header, Footer } from "./components";
import ViewExpense from "./components/ViewExpense";

const token = localStorage.getItem("LoginToken");

const options = {
  headers: { Authorization: "Bearer " + token },
};

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      cities: [],
      compnies: [],
      campaignData: [],
      show: false,
      user: false,
    };
  }

  componentWillMount = () => {
    var Lastclear = localStorage.getItem("Lastclear"),
      Time_now = new Date().getTime();
    //.getTime() returns milliseconds so 1000 * 60 * 60 * 24 = 24 Hours
    if (Time_now - Lastclear > 1000 * 60 * 60 * 24) {
      localStorage.removeItem("LoginToken");
      localStorage.setItem("Lastclear", Time_now);
    }
  };
  handleLoginSubmit = async (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3050/users/login", {
        email: e.target.email.value,
        password: e.target.password.value,
      })
      .then(function (response) {
        console.log(response);
        localStorage.setItem("LoginToken", response.data.token);
      })
      .then(() => {
        window.location.href = "http://localhost:3000/addexpense";
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleCitySubmit = async (e) => {
    e.preventDefault();

    axios
      .post(
        "http://localhost:3050/api/addCity",
        {
          city: e.target.city.value,
          region: e.target.region.value,
        },
        options
      )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleCompanySubmit = async (e) => {
    e.preventDefault();

    axios
      .post(
        "http://localhost:3050/api/addCompany",
        {
          company: e.target.company.value,
        },
        options
      )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleProjectSubmit = async (e) => {
    e.preventDefault();

    axios
      .post(
        "http://localhost:3050/project/addProject",
        {
          project: e.target.project.value,
          city: e.target.city.value,
          company: e.target.company.value,
        },
        options
      )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleRegisterSubmit = async (e) => {
    console.log(e);

    e.preventDefault();
    await axios
      .post(
        "http://localhost:3050/users/register",
        {
          name: e.target.name.value,
          email: e.target.email.value,
          company: e.target.company.value,
          password: e.target.password.value,
          password2: e.target.password2.value,
        },
        options
      )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleExpenseSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(
        "http://expenses.propstory.com/expenses",
        {
          project: e.target.project.value,
          campaignType: e.target.campaignType.value,
          actualLeads: e.target.actualLeads.value,
          plannedLeads: e.target.plannedLeads.value,
          totalBudget: e.target.totalBudget.value,
          cpl: e.target.cpl.value,
          clicks: e.target.clicks.value,
          impressions: e.target.impressions.value,
          totalSpending: e.target.totalSpending.value,
          spendingDate: e.target.spendingDate.value,
          campaignStartDate: e.target.campaignStartDate.value,
        },
        options
      )
      .then(function (response) {
        console.log(response);
        alert("ADDED YOUR EXPENSE SUCCESSFULLY");
        window.location.reload(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleUpdateExpense = async (e) => {
    console.log(e.target);

    e.preventDefault();
    await axios
      .post(
        "http://localhost:3050/expenses",
        {
          _id: e.target.expenseid.value,
          project: e.target.project.value,
          campaignType: e.target.campaignType.value,
          actualLeads: e.target.actualLeads.value,
          plannedLeads: e.target.plannedLeads.value,
          totalBudget: e.target.totalBudget.value,
          cpl: e.target.cpl.value,
          clicks: e.target.clicks.value,
          impressions: e.target.impressions.value,
          totalSpending: e.target.totalSpending.value,
          spendingDate: e.target.spendingDate.value,
          campaignStartDate: e.target.campaignStartDate.value,
        },
        options
      )
      .then(function (response) {
        console.log(response);
        alert("UPDATED- YOUR EXPENSE SUCCESSFULLY");
        window.location.reload(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleViewExpenseSubmit = async (e) => {
    console.log(e);
    console.log("VIEWING");
    const _this = this;
    e.preventDefault();
    await axios
      .post(
        "http://expenses.propstory.com/project/projectData",
        {
          project: e.target.project.value,
          startDate: e.target.startDate.value,
          endDate: e.target.endDate.value,
        },
        options
      )
      .then(async function (response) {
        console.log("comin inside then");

        console.log(response);

        await _this.setState({ campaignData: response.data.spendings });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  render() {
    return (
      <>
        <Router>
          <div>
            <Switch>
              <Route exact path="/" component={Home}></Route>

              <Route
                exact
                path="/users/login"
                render={() => (
                  <Login handleLoginSubmit={this.handleLoginSubmit} />
                )}
              ></Route>

              <Route
                exact
                path="/users/register"
                render={() => (
                  <Register handleRegisterSubmit={this.handleRegisterSubmit} />
                )}
              ></Route>

              <Route exact path="/footer" component={Footer}></Route>
              {/* <Route  path='/dashboard' component = { Dashboard }></Route>  */}
              {/* <Route exact path="/addexpense" component={AddExpense} hanldeRegisterSubmit={this.hanldeRegisterSubmit}></Route> */}
                  
              <Route
                exact
                path="/addexpense"
                render={() => (
                  <AddExpense
                    show={this.state.show}
                    user={this.state.user}
                    handleExpenseSubmit={this.handleExpenseSubmit}
                  />
                )}
              ></Route>

              <Route
                exact
                path="/addcity"
                render={() => (
                  <AddCity
                    user={this.state.user}
                    show={this.state.show}
                    handleCitySubmit={this.handleCitySubmit}
                  />
                )}
              ></Route>

              <Route
                exact
                path="/addproject"
                render={() => (
                  <AddProject
                    user={this.state.user}
                    show={this.state.show}
                    handleProjectSubmit={this.handleProjectSubmit}
                  />
                )}
              ></Route>

              <Route
                exact
                path="/addcompany"
                render={() => (
                  <AddCompany
                    user={this.state.user}
                    show={this.state.show}
                    handleCompanySubmit={this.handleCompanySubmit}
                  />
                )}
              ></Route>

              {/* <Route exact path="/viewexpense" component={ViewExpense}></Route> */}
              <Route
                exact
                path="/viewexpense"
                render={() => (
                  <ViewExpense
                    user={this.state.user}
                    result={this.state.campaignData}
                    handleUpdateExpense={this.handleUpdateExpense}
                    handleViewExpenseSubmit={this.handleViewExpenseSubmit}
                  />
                )}
              ></Route>
            </Switch>
          </div>
        </Router>
      </>
    );
  }
}

export default App;
