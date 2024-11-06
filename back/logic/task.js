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
		let { taskId, tasks } = await repository.getTasks();
		let { projectId, projects } = await repository.getProjects();
		const { project } = findProjectById(projects, req.params.projectId, res);
		if(!project) return ; 
		
		if(req.params.projectId != req.body.pjId) {
			res.status(400).json(projectIdMismatchErr);
			return ;
		}
		
		taskId += 1;
		const newTask = {
			pjId: req.body.pjId,
			id: taskId,
			title: req.body.title,
			description: req.body.description,
			priority: checkPriority(req.body.priority),
			dueDate: checkDueDate(req.body.dueDate),
			status: "not-started"
		};
		tasks.push(newTask);
		project.tasks.push(taskId);

		await repository.saveProjects({ projectId, projects });
		await repository.saveTasks({ taskId, tasks });
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
		let { taskId, tasks } = await repository.getTasks();
		const { task } = findTaskById(tasks, req.params.taskId, res);

		if(!task) return ;

		if(req.body.title != null) {
			task.title = req.body.title;
		}

		if(checkPriority(req.body.priority)) {
			task.priority = req.body.priority;
		}
		
		if(req.body.dueDate != null) {
			date = checkDueDate(req.body.dueDate);
			if(date != "") {
				task.dueDate = date;
			}
		}
		
		if(req.body.status != null && checkStatus(req.body.status)) {
			task.status = req.body.status;
		}
		await repository.saveTasks({ taskId, tasks });
		res.status(200).json({message: "task successfully updated"});
	} finally {
		mutex.release();
	}
}

// DELETE
async function deleteTask(req, res) {
	try {
		await mutex.acquire();
		let { projectId, projects } = await repository.getProjects();
		let { taskId, tasks } = await repository.getTasks();
		const { taskIdx, task } = findTaskById(tasks, req.params.taskId, res);
		if(taskIdx == -1) return ;
		const { project } = findProjectById(projects, req.params.projectId, res);
		if(!project) return ;

		const projectTaskIdx = project.tasks.findIndex(ti => ti == task.id);
		if (projectTaskIdx == -1) {
			res.status(404).json(repository.taskNotFoundErr);
			return ;
		}

		project.tasks.splice(projectTaskIdx, 1);
		tasks.splice(taskIdx, 1);
		await repository.saveProjects({ projectId, projects });
		await repository.saveTasks({ taskId, tasks });
		res.status(200).json({message: "task successfully deleted"}); 
	} finally {
		mutex.release();
	}
}


// util functions 
const priorityList = ["high", "medium", "low"];
function checkPriority(priority) {
	if(priorityList.includes(priority)) {
		return priority;
	}
	return "";
}

function checkDueDate(dueDate) {
	date = new Date(dueDate);
	if(isNaN(date)) return "";

	let day = date.getDate();
	day = day < 10 ? "0" + day : day;

	let month = date.getMonth() + 1;
	month = month < 10 ? "0" + month : month;

	const year = date.getFullYear();
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