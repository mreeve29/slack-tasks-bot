const { newTaskModalCallback } = require('./new-task-modal');
const { editTaskModalCallback } = require('./edit-task-modal');
const { deleteTaskModalCallback } = require('./delete-task-modal');

module.exports.register = (app) => {
  app.view('new-task-modal', newTaskModalCallback);
  app.view('edit-task-modal', editTaskModalCallback);
  app.view('delete-task-modal', deleteTaskModalCallback);
};
