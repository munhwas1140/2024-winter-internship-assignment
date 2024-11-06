const repository = require('../repository')
const Mutex = require('async-mutex').Mutex;
const { findProjectById } = require('./project')

const projectIdMismatchErr = {
    errors: 400,
    message: "path value projectId and pjId don't match",
}

const mutex = new Mutex();

// POST
async function postTask(req, res) {
    try {
        await mutex.acquire();
        let { taskPk, tasks } = await repository.getTasks();
        let { projectPk, projects } = await repository.getProjects();

        const { project } = findProjectById(projects, req.params.projectId, res);
        if(!project) return ; 
        
        if(req.params.projectId != req.body.pjId) {
            res.status(400).json(projectIdMismatchErr);
            return ;
        }
        
        taskPk += 1;
        const newTask = {
            pjId: req.body.pjId,
            id: taskPk,
            title: req.body.title,
            description: req.body.description,
            priority: "",
            dueDate: "",
            status: "not-started"
        };

        if(checkPriority(req.body.priority)) {
            newTask.priority = req.body.priority;
        }

        if(isDate(req.body.dueDate)) {
            newTask.dueDate = formatDueDate(req.body.dueDate);
        }

        tasks.push(newTask);
        project.tasks.push(newTask.id);

        await repository.saveProjects({ projectPk, projects });
        await repository.saveTasks({ taskPk, tasks });

        res.status(201).json({
            pjId: newTask.pjId,
            id: newTask.id,
            title: newTask.title,
        });
    } finally {
        mutex.release();
    }
}

// GET ALL
async function getTasks(req, res) {
    const { tasks } = await repository.getTasks();
    const { projects } = await repository.getProjects();

    const { project } = findProjectById(projects, req.params.projectId, res);
    if(!project) return ;

    res.status(200).json(tasks.filter(t => t.pjId == project.id));
}

// PUT
async function putTask(req, res) {
    try {
        await mutex.acquire();

        let { taskPk, tasks } = await repository.getTasks();

        const { task } = findTaskById(tasks, req.params.taskId, res);
        if(!task) return ;

        if(!req.body.title) {
            task.title = req.body.title;
        }

        if(checkPriority(req.body.priority)) {
            task.priority = req.body.priority;
        }
        
        if(isDate(req.body.dueDate)) {
            task.dueDate = formatDueDate(req.body.dueDate);
        }
        
        if(checkStatus(req.body.status)) {
            task.status = req.body.status;
        }

        await repository.saveTasks({ taskPk, tasks });

        res.status(200).json({message: "task successfully updated"});
    } finally {
        mutex.release();
    }
}

// DELETE
async function deleteTask(req, res) {
    try {
        await mutex.acquire();
        let { projectPk, projects } = await repository.getProjects();
        let { taskPk, tasks } = await repository.getTasks();

        const { taskIdx, task } = findTaskById(tasks, req.params.taskId, res);
        if(!task) return ;

        const { project } = findProjectById(projects, req.params.projectId, res);
        if(!project) return ;

        const projectTaskIdx = project.tasks.findIndex(ti => ti == task.id);
        if (projectTaskIdx == -1) {
            res.status(404).json(repository.taskNotFoundErr);
            return ;
        }

        project.tasks.splice(projectTaskIdx, 1);
        tasks.splice(taskIdx, 1);

        await repository.saveProjects({ projectPk, projects });
        await repository.saveTasks({ taskPk, tasks });

        res.status(200).json({message: "task successfully deleted"}); 
    } finally {
        mutex.release();
    }
}


// util functions 
const priorityList = ["high", "medium", "low"];
function checkPriority(priority) {
    if(!priority && priorityList.includes(priority)) {
        return true
    }
    return false;
}

function isDate(dueDate) {
    if(!dueDate) return false;
    date = new Date(dueDate);
    if(isNaN(date)) return false;
    return true;
}

function formatDueDate(dueDate) {
    date = new Date(dueDate);

    let day = date.getDate();
    let month = date.getMonth() + 1;
    const year = date.getFullYear();

    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;

    return `${year}-${month}-${day}`;
}

const statusList = ["not-started", "in-progress", "done", "completed"];
function checkStatus(status) {
    if(!status && statusList.includes(status)) return true;
    return false;
}

function findTaskById(tasks, taskId , res) {
    const taskIdx = tasks.findIndex(t => t.id == taskId);
    if(taskIdx == -1) {
        res.status(404).json(repository.taskNotFoundErr);
        return {
            taskIdx : -1,
            task: null
        };
    }

    return {
        taskIdx: taskIdx,
        task: tasks[taskIdx]
    };
}

module.exports = {
    postTask,
    getTasks,
    putTask,
    deleteTask
};