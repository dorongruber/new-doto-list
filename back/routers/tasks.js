const express = require('express');
const router = express.Router();
const mongoose =require('mongoose');
const Task = require('../models/Task');

router.post('/newtask', (req,res) => {
  console.log('new task!!!!!');
  try {
    const { title, content, taskDate,color,id,userid} = req.body;
    console.log('new task -> ', req.body);
    const dt = new Date(taskDate);
    console.log('dt -> ', dt);
    const checkIdRef = mongoose.Types.ObjectId(userid);
    Task.find({date: dt, title: title,content: content, userRef: checkIdRef})
    .exec(task => {
      console.log('task -> ', task);
      if (task) {
        res.status(404).json('task all ready exists');
      }
      const newTask = new Task({
        id,
        userRef: checkIdRef,
        title,
        content,
        date: dt,
        color
      });
      newTask.save()
      .then(savedTask => {
        console.log('saved event -> ', savedTask);
        res.status(201)
        .json({title, content, date:dt,color,id,userid});
      }).catch(err => {
        console.log('new task error -> ', err);
      })
      // res.status(201)
      // .json({ title, content, date:dt,color,id,userid});
    });
    // res.status(201).json()
  }catch(err) {
    res.status(401).json('newtask error -> ', err);
  }
})

router.get('/todaystasks/:dayId/:uid', async (req,res) => {
  try{
    const {dayId,uid} = req.params;
    console.log(' req.params -> ',  req.params);
    const uidRef = mongoose.Types.ObjectId(uid);
    // Task.find({id:parseInt(did),userRef:uidRef})
    // .exec(tasks => {
    //   if (!tasks) {
    //     res.status(404).json('no task in current day');
    //   }
    //   res.status(201).json(tasks);
    // })
    const tasks = await Task.find({id:parseInt(dayId),userRef:uidRef});
    let tasksList = [];
    tasks.forEach(task => {

      tasksList.push({
        title: task.title,
        content: task.content,
        date: task.date,
        color: task.color,
        id: task.id
      });
    });
    // console.log('ret task -> ', tasksList);
    res.status(201).json({tasksList});
  }catch(err) {
    console.log('err -> ', err);
  }
})

router.get('/monthtasks/:month/:userId', async (req,res) => {
 try{
  const {month,userId} = req.params;
  console.log('monthId,uid -> ', month,userId);
  const uidRef = mongoose.Types.ObjectId(userId);
  const tasks = await Task.find({userRef:uidRef});
  let monthTaskList = [];
  tasks.forEach(task => {
    // console.log('tasck date -> ', task.date.getMonth());
    const taskMonth = JSON.stringify(task.date.getMonth());
    if (taskMonth === month && task.color !== '') {
      monthTaskList.push(task);
    }
  });
  console.log('monthtasks -> ', monthTaskList);
  res.status(201).json({monthTaskList});
 }catch(err) {
   console.log('month err -> ', err);
 }
})

module.exports = router;
