const project = require('./project');
const task = require('./task');

const repository = {
  ...project,
  ...task
};

module.exports = repository;
