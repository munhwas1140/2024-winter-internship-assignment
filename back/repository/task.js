const taskNotFoundErr = {
  errors: 404,
  message: "project not found"
};

// let dummyTasks = [
// 	{
// 		"pjId": 1, // project id
// 		"id": "1",
// 		"title": "태스크 제목",
// 		"description": "태스크 설명",
// 		"priority": "high", // high | medium | low
// 		"dueDate": "2024-11-10",
// 		"status": "in-progress" // not-started | in-progress | done
// 	},{
// 		"pjId": 1, // project id
// 		"id": "2",
// 		"title": "태스크 제목",
// 		"description": "태스크 설명",
// 		"priority": "high", // high | medium | low
// 		"dueDate": "2024-11-10",
// 		"status": "in-progress" // not-started | in-progress | done
// 	}
// ];

let tasks = [];
let taskId = tasks.length;


// util functions
function findTask(req, res) {
	const taskId = req.params.taskId;
	const taskIdx = tasks.findIndex(t => t.id == taskId);

	if(taskIdx == -1) {
		res.status(404).json(taskNotFoundErr);
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

module.exports = {tasks, taskId, findTask};