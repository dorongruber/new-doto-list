const express = require('express');
const router = express.Router();
const mongoose =require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Task = require('../models/Task');

// const upload = multer({dest: __dirname + '/uploads/'});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if ( file.filename !== 'emptyfile') {
      cb(null, './public/uploads/');
    }
  },
  filename: (req, file, cb) => {
    const date = new Date().toISOString();
    cb(null, `${file.originalname}`);
    // console.log('????????????????');
  }
});

const upload = multer({storage: storage, limits: {
  fileSize: 1024 * 1024 * 10
}});

router.post('/newtask', upload.single('img') , (req,res) => {
  // console.log('new task!!!!! -> ', __dirname + '/uploads/' + req.file.filename);
  try {
    let imageFile;
    const { title, content, taskDate,color,id,userid,img} = req.body;
    console.log('new task -> ', req.file);
    const dt = new Date(taskDate);
    console.log('dt -> ', dt);
    const checkIdRef = mongoose.Types.ObjectId(userid);
    Task.find({date: dt, title: title,content: content, userRef: checkIdRef})
    .exec(task => {
      // console.log('task -> ', task);
      if (task) {
        res.status(404).json('task all ready exists');
      }
      if (req.file !== undefined) {
        console.log('!undefined => ', req.file.filename);
        imageFile = fs.readFileSync(path.join('./public/uploads/' + req.file.filename));
      } else {
        console.log('undefined');
        imageFile = fs.readFileSync(path.join('./public/uploads/default.jpg'));
      }
      console.log('file => ', imageFile);
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
      console.log('before save');
      newTask.save()
      .then(savedTask => {
        // console.log('saved event -> ', savedTask);
        res.status(201)
        .json({title,
          content,
          date:dt,
          color,
          id,
          userid,
          img: {
          file: imageFile.toString('base64')
        }});
      }).catch(err => {
        res.status(401).json(err);
      })
      // res.status(201)
      // .json({ title, content, date:dt,color,id,userid});
    });
    // res.status(201).json()
  }catch(err) {
    res.status(401).json(err);
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

      // var myBuffer = new Buffer(task.img.data, 'base64');
      imageFile = task.img.data.toString('base64');
      // console.log('myBuffer => ', imageFile);
    //   var res = new Uint8Array(myBuffer);
    //   for (var i = 0; i < task.img.data.length; ++i) {
    //      res[i] = task.img.data[i];
    //   }

    //   for (var i = 0; i < task.img.data.length; ++i) {
    //     res[i] = new Uint8Array(task.img.data[i]);
    //  }

      // console.log('day task => ', task);
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


