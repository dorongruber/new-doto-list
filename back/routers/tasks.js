const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/multer');
const { taskService } = require('../services/tasks');

// const upload = multer({dest: __dirname + '/uploads/'});

router.post('/newtask', upload.single('img') , addTask)

router.get('/todaystasks/:dayId/:uid', getSingleDateTasks)

router.get('/monthtasks/:month/:userId', getSingleMonthTasks)

module.exports = router;

function addTask(req,res,next) {
  const { title, content, taskDate,color,id,userid} = req.body;
  const img = req.file;
  taskService.addTask(title, content, taskDate,color,id,userid,img)
  .then(newTask => {
    res.status(200).send(newTask);
  })
  .catch(err => {
    res.status(401).send({meassage: err});
  })
}

function getSingleDateTasks(req,res,next) {
  const {dayId,uid} = req.params;
  taskService.getSingleDateTasks(dayId,uid)
  .then(singleDateTasks => {
    res.status(200).send({tasksList: singleDateTasks});
  })
  .catch(err => {
    res.status(401).send({message: err});
  })
}

function getSingleMonthTasks(req,res,next) {
  const {month,userId} = req.params;
  taskService.getSingleMonthTasks(month,userId)
  .then(singleMonthTasks => {
    res.status(200).send({monthTaskList: singleMonthTasks});
  })
  .catch(err => {
    res.status(401).send({message: err});
  })
}
