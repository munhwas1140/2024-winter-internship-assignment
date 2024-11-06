var express = require('express');
var router = express.Router();
const { body, param } = require('express-validator');
const logic = require('../logic')
const validate = require('./utils')

/// POST /projects
router.post("/", 
    [
        body("title").notEmpty().withMessage("title is required."),
        body("description").notEmpty().withMessage("description is required."),
        validate
    ],
    function(req, res, next) {
        logic.postProject(req, res);
    }
);

/// GET /projects
router.get("/", 
    function(req, res, next) {
        logic.getProjects(req, res);
    }
);

/// GET /projects/:projectId
router.get("/:projectId", 
    [
        param("projectId").isInt().withMessage("projectId must be integer"),
        validate
    ],
    function(req, res, next) { 
        logic.getProjectDetail(req, res);
    }
);

/// DELETE /projects/:projectId
router.delete("/:projectId", 
    [
        param("projectId").isInt().withMessage("projectId must be integer"),
        validate
    ],
    function(req, res, next) {
        logic.deleteProject(req, res);
    }
);

module.exports = router;