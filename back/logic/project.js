
const repository = require('../repository')
const Mutex = require('async-mutex').Mutex;


const projectDeleteErr = {
    errors: 400,
    message: "Cannot delete. because tasks are associated with this project."
};

const mutex = new Mutex();

// POST
async function postProject(req, res) {
    try {
        await mutex.acquire();
        let { projectId, projects } = await repository.getProjects();

        projectId += 1;
        const newProject = {
            id: projectId,
            title: req.body.title,
            description: req.body.description,
            tasks: []
        };
        projects.push(newProject);

        await repository.saveProjects({ projectId, projects })
        res.status(201).json({
            id: newProject.id, 
            title: newProject.title,
        });
    } finally {
        mutex.release();
    }

}

// GET ALL
async function getProjects(req, res) {
    const { projects } = await repository.getProjects();
    res.status(200).json(projects);
}

// GET DETAIL
async function getProjectDetail(req, res) {
    const { projects } = await repository.getProjects();
    const { project } = findProjectById(projects, req.params.projectId, res);
    if(!project) {
        return ;
    }
    
    let { tasks } = await repository.getTasks();
    const projectWithTasks = {
        ...project,
        tasks: tasks.filter(task => task.pjId == project.id)
    };
    res.status(200).json(projectWithTasks);
}

// DELETE
async function deleteProject(req, res) {
    try {
        await mutex.acquire();
        let { projectId, projects } = await repository.getProjects();
        const { projectIdx } = findProjectById(projects, req.params.projectId, res);
        if(projectIdx == -1) {
            return ;
        }

        const project = projects[projectIdx];
        if(project.tasks.length > 0) {
            res.status(400).json(projectDeleteErr);
            return ;
        }

        projects.splice(projectIdx, 1);
        await repository.saveProjects({ projectId, projects })
        res.status(200).json({message: "project successfully deleted"});
    } finally {
        mutex.release();
    }
}

// util functions
function findProjectById(projects, projectId, res) {
    const projectIdx = projects.findIndex(p => p.id == projectId);
    if(projectIdx == -1) {
        res.status(404).json(repository.projectNotFoundErr);
        return {
            projectIdx: -1,
            project: null
        };
    }
  
    return {
        projectIdx: projectIdx,
        project: projects[projectIdx]
    };
}

module.exports = {
    postProject,
    getProjects,
    getProjectDetail,
    deleteProject,
    findProjectById,
};

