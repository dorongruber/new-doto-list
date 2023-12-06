const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const userRouter = require('./back/routers/users');
const taskRouter = require('./back/routers/tasks');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist','todo')));

app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, 'dist','todo','index.html'))
})

module.exports = app;
