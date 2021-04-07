const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config()

const userRouter = require('./back/routers/users');
const taskRouter = require('./back/routers/tasks');

const app = express();

app.use(express.static(path.join(__dirname, 'dist/todolistCalendar')));

app.use(cors());
app.use(express.json({limit: '25mb'}));
// app.use(express.urlencoded({limit: '25mb'}))
// // app.use(bodyParser.json());
app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);

mongoose.connect(process.env.PRO_BD_CONNECTION || process.env.DEV_BD_CONNECTION ,
  {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log('connection failed -> ', err);
  })

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



const PORT = process.env.PORT || 8080
app.listen(PORT , () => {
  console.log(` Server is running on port -> ${PORT}`)
})
