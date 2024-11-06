const project = require('./project');
const task = require('./task');

const logic = {
  ...project,
  ...task
};

module.exports = logic;
