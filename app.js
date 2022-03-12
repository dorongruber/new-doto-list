const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config()

const userRouter = require('./back/routers/users');
const taskRouter = require('./back/routers/tasks');

const app = express();

app.use(express.static(path.join(__dirname, 'dist/todolistCalendar')));

app.use(cors());
app.use(express.json({limit: '25mb'}));

app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept,Authorization, Content-Length"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, 'dist/todolistCalendar/index.html'))
})

module.exports = app;
