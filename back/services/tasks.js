const fs = require('fs');
const path = require('path');
const sharp = require("sharp");

const Task = require('../models/Task');

class TaskService {

  constructor() {}

  addTask = async function(title, content, taskDate,color,id,userid,img) {
    try {
      const dt = new Date(taskDate);
      const task = await Task.findOne({date: dt, title: title,content: content, userRef: userid});
      if (task) {
        return new Error('task all ready exists')
      }
      const imageFile = await this.processImage(img);
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
      const tasks = await Task.find({id:parseInt(dayId),userRef:uid});
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
      const tasks = await Task.find({userRef:userId});
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

  async processImage(img) {
    const { buffer, originalname } = img;
    if(originalname == "emptyFile") {
      return Buffer.from('');
    }
    const imagesPath = path.join(".","public","images");
    fs.access(imagesPath, (error) => {
      if (error) {
        fs.mkdirSync(imagesPath);
      }
    });
    
    await sharp(buffer).resize({width: 150, height: 150}).jpeg({ quality: 85 })
    .toFile(path.join(imagesPath, originalname));
    return await sharp(path.join(imagesPath, originalname)).toBuffer();
    
  }
}

module.exports = {
  taskService: new TaskService()
}
