var express = require('express');
var router = express.Router({mergeParams: true});
const { body, param } = require('express-validator');
const logic = require('../logic')
const validate = require('./utils')

/// POST /projects/:projectId/tasks
router.post("/",
    [
        param("projectId").isInt().withMessage("projectId must be integer"),
        body("pjId").isInt().withMessage("pjId must be integer"),
        body("title").notEmpty().withMessage("title is required"),
        validate
    ],
    function(req, res, next) {
        logic.postTask(req, res);
    }
);

/// GET /projects/:projectId/tasks
router.get("/",
    [
        param("projectId").isInt().withMessage("projectId must be integer"),
        validate
    ],
    function(req, res, next) {
        logic.getTasks(req, res);
    }
);

/// PUT /projects/:projectId/tasks/:taskId
router.put("/:taskId",
    [
        param("projectId").isInt().withMessage("projectId must be integer"),
        param("taskId").isInt().withMessage("taskId must be integer"),
        validate
    ],
    function(req, res, next) {
        logic.putTask(req, res);
    }
);

/// DELETE /projects/:projectId/tasks/:taskId
router.delete("/:taskId",
    [
        param("projectId").isInt().withMessage("projectId must be integer"),
        param("taskId").isInt().withMessage("taskId must be integer"),
        validate
    ],
    function(req, res, next) {
        logic.deleteTask(req, res);
    }
);

module.exports = router;