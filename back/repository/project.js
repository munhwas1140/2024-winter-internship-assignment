const projectNotFoundErr = {
  errors: 404,
  message: "project not found"
};

// let dummyProjects = [
//     {
//       "id": "1",
//       "title": "프로젝트 제목",
//       "description": "프로젝트 설명",
//       "tasks": [1, 2]
//     },{
//       "id": "2",
//       "title": "프로젝트 제목",
//       "description": "프로젝트 설명",
//       "tasks": []
//     },{
//       "id": "3",
//       "title": "프로젝트 제목",
//       "description": "프로젝트 설명",
//       "tasks": []
//     },{
//       "id": "4",
//       "title": "프로젝트 제목",
//       "description": "프로젝트 설명",
//       "tasks": []
//     }
// ];

let projects = [];
let projectId = projects.length;


// util functions
function findProject(req, res) {
    const projectId = req.params.projectId;
    const projectIdx = projects.findIndex(p => p.id == projectId);
    if(projectIdx == -1) {
        res.status(404).json(projectNotFoundErr);
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

module.exports = {projects, projectId, findProject};