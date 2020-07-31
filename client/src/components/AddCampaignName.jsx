import React, { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import axios from "axios";
import Dashboard from "./Dashboard";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import NotLoginView from "./NotLoginView";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const token = localStorage.getItem('LoginToken');

const options = {
    headers: { 'Authorization': 'Bearer ' + token }

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

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        height: 50,
        fontSize: 24,
        fontWeight: "bold"
    },
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function AddCampaignName(props) {
    const classes = useStyles();

    const [company, setCompany] = React.useState("");

    const handleChangeCompany = event => {
        setCompany(event.target.value);
        props.handleGetProjects();
    };


    const [project, setProject] = React.useState("");


    const [open, setOpen] = React.useState(false);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleChangeProject = (event) => {
        setProject(event.target.value);
    };


    const handleCampaignNameSubmit = (e) => {
        e.preventDefault();
        axios
            .post(
                "http://expenses.propstory.com/campaign/addCampaignName",
                {
                    project_id: e.target.project.value,
                    campaign_name: e.target.campaignName.value,
                    planned_leads: e.target.plannedLeads.value,
                    campaign_start_date: e.target.campaignStartDate.value,
                    total_budget: e.target.totalBudget.value
                },
                options
            )
            .then(function (response) {
                console.log(response);
                setOpen(true)
                setTimeout(() => {
                    window.location.reload(false);
                }, 2000);
            })
            .catch(function (error) {
                console.log(error);
            });


    }
    useEffect(() => {
        props.handleGetCompanies();

    }, [props.alert])


    if (token == null) {
        return <NotLoginView />;
    } else {
        return (
            <>
                <Dashboard />
                <Container maxWidth="md">
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <AddToPhotosIcon />
                        </Avatar>
                        <Typography style={{ paddingBottom: 16 }} component="h1" variant="p">
                            Add Your Campaign Name
        </Typography>
                        <form
                            className={classes.form}
                            noValidate
                            onSubmit={handleCampaignNameSubmit}
                        >
                            <Grid container  justify="center" spacing={4}>

                                <Grid item xs={12} sm={6}>
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
                                        {props.companies && props.companies.map(company => {
                                            return <option value={company._id}>{company.name}</option>;
                                        })}
                                    </select>
                                </Grid>
                                <Grid item xs={12} sm={6}>
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
                                            -- Select Project --
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
                                <Grid item lg={4} xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="campaignName"
                                        label="Choose your Campaign Name"
                                        id="campaignName"
                                        helperText="eg: ProjectName_Month "
                                        autoComplete="campaignName"
                                        size="small"
                                    />
                                </Grid>
                                
                                <Grid item lg={4} xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="plannedLeads"
                                        label="Assign Planned Leads"
                                        id="plannedLeads"
                                        autoComplete="plannedLeads"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item lg={4} xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="totalBudget"
                                        label="Assign Total Budget"
                                        id="totalBudget"
                                        autoComplete="totalBudget"
                                        size="small"
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
                                    Add Camapign Name
            </Button>
                            </Grid>

                            <Grid container justify="flex-end"></Grid>
                        </form>
                    </div>

                </Container>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        Added your campaign name successfully
        </Alert>
                </Snackbar>
            </>
        );
    }
}

// export default Login
