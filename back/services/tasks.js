const Task = require('../models/Task');
const fs = require('fs');
const path = require('path');
const mongoose =require('mongoose');
class TaskService {

  constructor() {}

  addTask = async function(title, content, taskDate,color,id,userid,img) {
    try {
      let imageFile;
      const dt = new Date(taskDate);
      const checkIdRef = mongoose.Types.ObjectId(userid);
      const task = await Task.findOne({date: dt, title: title,content: content, userRef: checkIdRef});
      if (task) {
        return new Error('task all ready exists')
      }
      if (img.filename !== 'emptyfile') {
        imageFile = fs.readFileSync(path.join('./public/uploads/' + img.file.filename));
      } else {
        imageFile = fs.readFileSync(path.join('./public/uploads/default.jpg'));
      }
      const newTask = new Task({
        id,
        userRef: checkIdRef,
        title,
        content,
        date: dt,
        color,
        img: {
          data: imageFile,
          contentType: 'image/*',
        }
      });

      const svaed = newTask.save();

      return {title,
        content,
        date:dt,
        color,
        id,
        userid,
        img: {
        file: imageFile.toString('base64')
      }};
    }catch(err) {
      throw err
    }
  }

  getSingleDateTasks = async function(dayId,uid) {
    try{
      const uidRef = mongoose.Types.ObjectId(uid);
      const tasks = await Task.find({id:parseInt(dayId),userRef:uidRef});
      let tasksList = [];
      tasks.forEach(task => {
        const imageFile = task.img.data.toString('base64');
        tasksList.push({
          title: task.title,
          content: task.content,
          date: task.date,
          color: task.color,
          id: task.id,
          img: {
            file: imageFile
          }
        });
      });
      return tasksList
    }catch(err) {
      throw err;
    }
  }

  getSingleMonthTasks = async function(month,userId) {
    try{
      const uidRef = mongoose.Types.ObjectId(userId);
      const tasks = await Task.find({userRef:uidRef});
      let monthTaskList = [];
      for (const task of tasks) {
        const taskMonth = JSON.stringify(task.date.getMonth());
        if (taskMonth === month) {
          monthTaskList.push(task);
        }
      }
      return monthTaskList
     }catch(err) {
       throw err;
     }
  }
}

module.exports = {
  taskService: new TaskService()
}
