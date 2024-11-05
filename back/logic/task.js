const { findTask } = require('../repository/task')
var { tasks, taskId } = require('../repository/task')
const { findProject } = require('../repository/project')

const projectIdMismatchErr = {
	errors: 400,
	message: "path value projectId and pjId don't match",
}


// POST
function postTask(req, res) {
	const {project} = findProject(req, res);
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

    res.status(201).json({
		pjId: newTask.pjId,
		id: newTask.id,
		title: newTask.title,
    });
}


// GET ALL
function getTasks(req, res) {
  const {project} = findProject(req, res)
  if(!project) return ;
  res.status(200).json(tasks.filter(t => t.pjId == project.id));
}


// PUT
function putTask(req, res) {
	const {task} = findTask(req, res)
	if(!task) return ;

	if(req.body.title != null) {
		task.title = req.body.title;
	}

	if(req.body.priority != null) {
		priority = checkPriority(req.body.priority);
		if(priority != "") {
			task.priority = req.body.priority;
		}
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
	res.status(200).json({message: "task successfully updated"});
}


// DELETE
function deleteTask(req, res) {
	const {taskIdx} = findTask(req, res);
	if(taskIdx == -1) return ;

	tasks.splice(taskIdx, 1);
	res.status(200).json({message: "task successfully deleted"}); 
}

function checkPriority(priority) {
	if(priority == "high" || priority == "medium" || priority == "low") {
		return priority;
	}
	return "";
}



// util functions 
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

function checkStatus(status) {
	if(status == "not-started" ||
		status ==  "in-progress" ||
		status == "done" ||
		status == "completed") return true;

	return false;
}

module.exports = {postTask, getTasks, putTask, deleteTask};