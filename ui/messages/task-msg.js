const { Message, Section, Button, Header, Actions } = require('slack-block-builder');

module.exports = (taskTitle, dueDate, taskID) => Message({
  channel: "C058WL28V8D",
  text: `A todo needs a do-er!`,
}).blocks(
  Header({ text: `A todo needs a do-er:` }),
  Section({ type: "mrkdwn", text: `*${taskTitle}*\nDue Date: ${dueDate}` }),
  Actions({ blockId: 'button-assign-task' }).elements(Button({ text: 'Take on Task', value: `assign-task-${taskID}`, actionId: 'button-assign-task'}).primary(true)),
).buildToObject();
