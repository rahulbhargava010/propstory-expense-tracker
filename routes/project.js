const express = require("express");
const Expense = require("../models/Expense");
const Project = require("../models/Project");
const UserProjects = require("../models/UserProjects");
const User = require("../models/User");
const router = express.Router();
const { ObjectId } = require("mongodb");

// const { ensureAuthenticated } = require('../config/auth')
let middleware = require("../config/middleware");

//Adding a new Project
router.post("/addProject", middleware.checkToken, (req, res) => {
  const projectInfo = new Project({
    name: req.body.project,
    city: ObjectId(req.body.city),
    company: ObjectId(req.body.company),
  });
  const project = projectInfo.save();

  res.status(201).json({ project });
});

router.post("/getProjects", middleware.checkToken, (req, res) => {
    console.log("++++++++++++++++++++++++++");
    
  console.log(req.body);

  const user_id = req.body.user_id;
  const company_id = req.body.company_id;

  User.findById(user_id, async (err, user) => {
    if (err) {
      res.status(400).json({ err });
    }
    console.log(user.role);
    
    if (user.role === "PSADMIN") {
      Project.find({}, (err, result) => {
        res.status(200).json({ projects: result });
      });
    } else if (user.role === "ADMIN") {
      const filter = { company: company_id };
      Project.find(filter, (err, result) => {
        res.status(200).json({ projects: result });
      });
    } else if (user.role === "TEAM_MEMBER") {

      const filter = { user: user_id };
      let userProjects;

      await UserProjects.find(filter, async (err, result) => {
          console.log("Inside Team Member");
          
          console.log(err);
          console.log(result);
          
          
        if (err) {

          res.status(400).json({ err });
        }
        userProjects = result;
      });

      if (userProjects) {
        const projectsIds = await userProjects.map((key) => {
          return ObjectId(key.project);
        });

        await Project.find(
          { _id: { $in: projectsIds } },
          (err, projectResult) => {
            if (err) {
              res.status(400).json({ err });
            }

            res.status(200).json({ projects: projectResult });
          }
        );
      }

      // console.log('projects')
      // console.log(projects)
      // await new Promise((resolve) => {
      //     userprojects.map( (key) => {

      //         Project.findById(key.project, (err, projresult) => {
      //             console.log(projresult)
      //             console.log(projresult.name)
      //             projects.push( {id: key.project, name: projresult.name} )
      //             resolve()
      //         })

      //     })

      // })

      // console.log(projects)
      // res.status(200).json({ projects })
      // })
    } else {
      res.status(200).json({
        msg: "there are no project assigned to you plz contect your admin",
      });
    }
  });
});

// Getting campaign data b/w Dates
router.post("/projectData", (req, res) => {
  let errors = [],
    expenses;
  const { startDate, endDate, project } = req.body;
  // res.json({'body': req.body})
  if (!startDate || !endDate || !project) {
    errors.push({ msg: "Please fill all the fields" });
  }

  Expense.find(
    {
      spendingDate: {
        $gte: startDate,
        $lte: endDate,
      },
      project: ObjectId(project),
    },
    (err, result) => {
      res.status(200).json({ spendings: result });
    }
  );
});

router.post("/assignProject", middleware.checkToken, (req, res) => {
  const userProject = new UserProjects({
    user: ObjectId(req.body.user_id),
    project: ObjectId(req.body.project_id),
  });

  const userProjects = userProject.save();
  res.status(201).json({ userProjects });
});

module.exports = router;
