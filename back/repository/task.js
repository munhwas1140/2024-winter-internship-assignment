const fs = require("fs-extra");
const path = require("path");

const tasksFile = path.join(__dirname, "./data/tasks.json");

const taskNotFoundErr = {
  errors: 404,
  message: "task not found"
};


async function getTasks() {
    return await fs.readJson(tasksFile);
};
  
async function saveTasks(tasks) {
    fs.writeJson(tasksFile, tasks, { spaces: 2});
};


module.exports = {
    taskNotFoundErr,
    getTasks,
    saveTasks,
};