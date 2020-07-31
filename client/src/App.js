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
import FbExpense from "./components/AutomateExpense/FbExpense";
import ManageUsers from './components/ManageUsers'
import AddCampaignName from "./components/AddCampaignName.jsx";
const token = localStorage.getItem("LoginToken");
const userin = localStorage.getItem("LoggedinUser");
const userCompany = localStorage.getItem("userCompany");

const options = {
  headers: { Authorization: "Bearer " + token },
};

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      cities: [],
      companies: [],
      campaignData: [],
      show: false,
      projects: [],
      alert: false,
      campaignName: []
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

  handleGetCompanies = () => {
    axios
      .get("http://expenses.propstory.com/api/getCompanies", options)
      .then((response) => {
        console.log(response);

        let companies = response.data.companies;
        console.log(companies);
        this.setState({ companies });
      })
      .catch((err) => console.log(err));
  };

  handleGetProjects = () => {
    var data = {
      user_id: userin,
      company_id: userCompany,
    };

    axios
      .post("http://expenses.propstory.com/project/getProjects", data, options)
      .then((response) => {
        console.log(response);

        let projects = response.data.projects;
        
        this.setState({ projects });
        console.log(this.state.projects);

      })
      .catch((err) => console.log(err));
  };

  handleLoginSubmit = async (e) => {
    const _this = this;
    e.preventDefault();
    axios
      .post("http://expenses.propstory.com/users/login", {
        email: e.target.email.value,
        password: e.target.password.value,
      })
      .then(function (response) {
        console.log(response);
        localStorage.setItem("LoginToken", response.data.token);
        localStorage.setItem("LoggedinUser", response.data.user._id);
        localStorage.setItem("userCompany", response.data.user.company);
        localStorage.setItem("userRole", response.data.user.role);
      })
      .then(() => {
        window.location.href = "http://expenses.propstory.com/viewexpense";
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleCitySubmit = async (e) => {
    e.preventDefault();
    const _this = this;

    axios
      .post(
        "http://expenses.propstory.com/api/addCity",
        {
          city: e.target.city.value,
          region: e.target.region.value,
        },
        options
      )
      .then(function (response) {
        console.log(response);
        _this.setState({ alert: true });
        setTimeout(() => {
          window.location.reload(false);
        }, 2000);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleCompanySubmit = async (e) => {
    e.preventDefault();
    const _this = this;

    axios
      .post(
        "http://expenses.propstory.com/api/addCompany",
        {
          company: e.target.company.value,
        },
        options
      )
      .then(function (response) {
        console.log(response);
        _this.setState({ alert: true });
        setTimeout(() => {
          window.location.reload(false);
        }, 2000);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleProjectSubmit = async (e) => {
    e.preventDefault();
    let _this = this;

    axios
      .post(
        "http://expenses.propstory.com/project/addProject",
        {
          project: e.target.project.value,
          city: e.target.city.value,
          company: e.target.company.value,
        },
        options
      )
      .then(function (response) {
        console.log(response);
        _this.setState({ alert: true });
        setTimeout(() => {
          window.location.reload(false);
        }, 2000);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleRegisterSubmit = async (e) => {
    console.log(e);
    let _this = this;
    e.preventDefault();
    await axios
      .post(
        "http://expenses.propstory.com/users/register",
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
        _this.setState({ alert: true });
      })
      .catch(function (error) {
        console.log(error);
      });
  };



  handleExpenseSubmit = async (e) => {
    e.preventDefault();
    const _this = this;

    await axios
      .post(
        "http://expenses.propstory.com/expenses",
        {
          user: userin,
          project: e.target.project.value,
          campaignType: e.target.campaignType.value,
          campaignName: e.target.campaignName.value,
          actualLeads: e.target.actualLeads.value,
          plannedLeads: e.target.plannedLeads.value,
          allocation: e.target.allocation.value,
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
        _this.setState({ alert: true });
        setTimeout(() => {
          window.location.reload(false);
        }, 2000);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleUpdateExpense = async (e) => {

    e.preventDefault();
    await axios
      .post(
        "http://expenses.propstory.com/expenses",
        {
          _id: e.target.expenseid.value,
          user: userin,
          project: e.target.project.value,
          campaignType: e.target.campaignType.value,
          actualLeads: e.target.actualLeads.value,
          plannedLeads: e.target.plannedLeads.value,
          totalBudget: e.target.totalBudget.value,
          cpl: e.target.totalSpending.value/e.target.actualLeads.value,
          clicks: e.target.clicks.value,
          impressions: e.target.impressions.value,
          totalSpending: e.target.totalSpending.value,
          spendingDate: e.target.spendingDate.value,
          campaignStartDate: e.target.campaignStartDate.value,
          campaignName: e.target.campaignName.value
        },
        options
      )
      .then(function (response) {
        console.log(response);

        alert("UPDATED YOUR EXPENSE SUCCESSFULLY");
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
      .then(function (response) {
        console.log("comin inside then");

        console.log(response);
        const campaignData = response.data.spendings;
        _this.setState({ campaignData });
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
                  <Register
                    alert={this.state.alert}
                    handleRegisterSubmit={this.handleRegisterSubmit}
                  />
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
                    handleExpenseSubmit={this.handleExpenseSubmit}
                    handleGetProjects={this.handleGetProjects}
                    handleGetCompanies={this.handleGetCompanies}
                    companies={this.state.companies}
                    projects={this.state.projects}
                    alert={this.state.alert}
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
                    alert={this.state.alert}
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
                    handleGetCompanies={this.handleGetCompanies}
                    companies={this.state.companies}
                    alert={this.state.alert}
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
                    alert={this.state.alert}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/add_campaign_name"
                render={() => (
                  <AddCampaignName
                    user={this.state.user}
                    handleGetProjects={this.handleGetProjects}
                    projects={this.state.projects}
                    handleGetCompanies={this.handleGetCompanies}
                    companies={this.state.companies}
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
                    handleGetProjects={this.handleGetProjects}
                    projects={this.state.projects}
                  />
                )}
              ></Route>
                  <Route
                exact
                path="/manageusers"
                render={() => (
                  <ManageUsers
                    user={this.state.user}
                    handleGetCompanies={this.handleGetCompanies}
                    companies={this.state.companies}
                  />
                )}
              ></Route>
              <Route
                exact
                path="/automated_expense/facebook"
                projects={this.state.projects}
                render={() => <FbExpense />}
              ></Route>
            </Switch>
          </div>
        </Router>
      </>
    );
  }
}

export default App;
