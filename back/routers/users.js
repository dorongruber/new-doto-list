const express = require('express');
const router = express.Router();
const { userService } = require('../services/users');
const { AuthenticateToken } = require('../middlewares/auth');

router.post('/loguser', Login)

router.post('/register', Register)

router.get('/currentUser/:id', AuthenticateToken, getUser)

module.exports = router;

function Login(req,res,next) {
  const {email,password} = req.body;
  userService.login(email,password)
  .then(user => {
    res.status(200).send(user);
  })
  .catch(err => {
    res.status(401).send({message: err});
  })
}

function Register(req,res,next) {
  const { name, phone,email, password} = req.body;
  userService.Register(name, phone,email, password)
  .then(processStatus => {
    res.status(200).send(processStatus);
  })
  .catch(err => {
    res.status(401).send({message: err});
  })
}

function getUser(req,res,next) {
  const {id} = req.params;
  userService.getUser(id)
  .then(user => {
    res.status(200).send(user);
  })
  .catch(err => {
    res.status(401).send({message: err});
  })
}
