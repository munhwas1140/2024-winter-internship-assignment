
const {findProject } = require('../repository/project');
var { projects, projectId } = require('../repository/project');
const { tasks } = require('../repository/task')

const projectDeleteErr = {
	errors: 400,
	message: "Cannot delete. because tasks are associated with this project."
};

// POST
function postProject(req, res) {
	projectId += 1;

	const newProject = {
		id: projectId,
		title: req.body.title,
		description: req.body.description,
		tasks: []
	};
	projects.push(newProject);

	res.status(201).json({
		id: newProject.id, 
		title: newProject.title,
	});
}

// GET ALL
function getProjects(req, res) {
	res.status(200).json(projects);
}

// GET DETAIL
function getProjectDetail(req, res) {
	const {project} = findProject(req, res);
	if(!project) {
		return ;
	}

	const projectWithTasks = {
		...project,
		tasks: tasks.filter(task => task.pjId == project.id)
	};
	res.status(200).json(projectWithTasks);
}

// DELETE
function deleteProject(req, res) {
	const {projectIdx} = findProject(req, res)
	if(projectIdx == -1) {
		return ;
	}

	const project = projects[projectIdx];

	if(project.tasks.length > 0) {
		res.status(400).json(projectDeleteErr);
		return ;
	}

	projects.splice(projectIdx, 1);
	res.status(200).json({message: "project successfully deleted"});
}

module.exports = {postProject, getProjects, getProjectDetail, deleteProject};

