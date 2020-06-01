import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import CloudCircleIcon from "@material-ui/icons/CloudCircle";
import UpdateIcon from "@material-ui/icons/Update";
import Collapse from "@material-ui/core/Collapse";
import FacebookIcon from "@material-ui/icons/Facebook";
import GroupIcon from "@material-ui/icons/Group";
import {
  Dashboard,
  Receipt,
  MonetizationOn,
  LocationCity,
  ViewList,
  Business,
} from "@material-ui/icons";
import { ListItemIcon, ListItemText } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import "../assets/style.css";
import axios from "axios";

const role = localStorage.getItem("userRole");

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

export default function TemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
  });
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const _Logout = () => {
    localStorage.removeItem("LoginToken");
    window.location.href = "http://expenses.propstory.com/";
  };
  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Divider />

      <List>
        {role == "PSADMIN" ? (
          <>
            <a href="/addexpense">
              <ListItem button key="AddExpense">
                <ListItemIcon>
                  <MonetizationOn />
                </ListItemIcon>
                <ListItemText primary="Add Expense" />
              </ListItem>
            </a>
            <a href="/addproject">
              <ListItem button key="AddProject">
                <ListItemIcon>
                  <Receipt />
                </ListItemIcon>
                <ListItemText primary="Add Project" />
              </ListItem>
            </a>
            <a href="/addcity">
              <ListItem button key="AddCity">
                <ListItemIcon>
                  <LocationCity />
                </ListItemIcon>
                <ListItemText primary="Add City" />
              </ListItem>
            </a>
            <a href="/addcompany">
              <ListItem button key="AddCompany">
                <ListItemIcon>
                  <Business />
                </ListItemIcon>
                <ListItemText primary="Add Company" />
              </ListItem>
            </a>
            <Divider />
            <a href="/manageusers">
              <ListItem button key="ManageUsers">
                <ListItemIcon>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Users" />
              </ListItem>
            </a>

            <ListItem button onClick={handleClick} key="ViewAutomatedExpense">
              <ListItemIcon>
                <UpdateIcon />
              </ListItemIcon>
              <ListItemText primary="View Automated Expense" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <a href="/automated_expense/facebook">
                  <ListItem button className={classes.nested}>
                    <ListItemIcon>
                      <FacebookIcon />
                    </ListItemIcon>
                    <ListItemText primary="Facebook" />
                  </ListItem>
                </a>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <CloudCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Taboola" />
                </ListItem>
              </List>
            </Collapse>
          </>
        ) : null}
        <a href="/viewexpense">
          <ListItem button key="ViewExpense">
            <ListItemIcon>
              <ViewList />
            </ListItemIcon>
            <ListItemText primary="View Expense" />
          </ListItem>
        </a>
      </List>
      <div className="logoutButton" onClick={_Logout}>
        <h4 style={{ color: "#fff" }}>Logout</h4>
      </div>
    </div>
  );

  return (
    <div>
      <React.Fragment key="left">
        <Navbar bg="light" expand="lg">
          {}
          <Button className="Button" onClick={toggleDrawer("left", true)}>
            <MenuIcon fontSize="large" />
          </Button>
          <Navbar.Brand href="#home">
            <Typography component="h2" variant="p">
              Propstory
            </Typography>
          </Navbar.Brand>
          {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse> */}
        </Navbar>
        <Drawer
          anchor="left"
          open={state["left"]}
          onClose={toggleDrawer("left", false)}
        >
          {list("left")}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
