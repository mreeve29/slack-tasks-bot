const { Task } = require('../models');

module.exports = async (taskID, body, client) => {
  // Find all the tasks provided where we have a scheduled message ID
  try{
    let task = await Task.findOne({ where: { id: taskID } })
    task.assignedTo = body.user.id
    await task.save()
    // delete message?
    await client.chat.delete({channel: "C058WL28V8D", ts: task.msg})


  } catch (error) {
    console.log(error)
  }
};
