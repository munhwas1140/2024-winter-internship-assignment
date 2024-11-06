const fs = require("fs-extra");
const path = require("path");

const projectsFile = path.join(__dirname, "./data/projects.json");

const projectNotFoundErr = {
  errors: 404,
  message: "project not found"
};


async function getProjects() {
    return await fs.readJson(projectsFile);
};
  
async function saveProjects(projects) {
    await fs.writeJson(projectsFile, projects, { spaces: 2 });
};

module.exports = {
    projectNotFoundErr,
    getProjects,
    saveProjects,
};