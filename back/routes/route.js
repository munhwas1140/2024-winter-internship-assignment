var express = require('express');
var router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { postProject, getProjects, getProjectDetail, deleteProject } = require('../logic/project')
const { postTask, getTasks, putTask, deleteTask } = require('../logic/task')

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json(errors);
}


/// POST /projects
router.post("/projects", 
    [
        body("title").notEmpty().withMessage("title is required."),
        body("description").notEmpty().withMessage("description is required."),
        validate
    ],
    function(req, res, next) {
        postProject(req, res);
    }
);


/// GET /projects
router.get("/projects", 
    function(req, res, next) {
        getProjects(req, res);
    }
);


/// GET /projects/:projectId
router.get("/projects/:projectId", 
    [
        param("projectId").isInt().withMessage("projectId must be integer"),
        validate
    ],
    function(req, res, next) { 
        getProjectDetail(req, res);
    }
);


/// DELETE /projects/:projectId
router.delete("/projects/:projectId", 
    [
        param("projectId").isInt().withMessage("projectId must be integer"),
        validate
    ],
    function(req, res, next) {
        deleteProject(req, res);
    }
);


/// POST /projects/:projectId/tasks
router.post("/projects/:projectId/tasks",
    [
        param("projectId").isInt().withMessage("projectId must be integer"),
        body("pjId").isInt().withMessage("pjId must be integer"),
        body("title").notEmpty().withMessage("title is required"),
        validate
    ],
    function(req, res, next) {
        postTask(req, res);
    }
);


/// GET /projects/:projectId/tasks
router.get("/projects/:projectId/tasks",
    [
        param("projectId").isInt().withMessage("projectId must be integer"),
        validate
    ],
    function(req, res, next) {
        getTasks(req, res);
    }
);


/// PUT /projects/:projectId/tasks/:taskId
router.put("/projects/:projectId/tasks/:taskId",
    [
        param("projectId").isInt().withMessage("projectId must be integer"),
        param("taskId").isInt().withMessage("taskId must be integer"),
        validate
    ],
    function(req, res, next) {
        putTask(req, res);
    }
);


/// DELETE /projects/:projectId/tasks/:taskId
router.delete("/projects/:projectId/tasks/:taskId",
    [
        param("projectId").isInt().withMessage("projectId must be integer"),
        param("taskId").isInt().withMessage("taskId must be integer"),
        validate
    ],
    function(req, res, next) {
        deleteTask(req, res);
    }
);


router.use("*", 
    function (req, res) {
        res.status(402);
    }
);

module.exports = router;