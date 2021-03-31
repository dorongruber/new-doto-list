const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/Users');
const { ObjectId } = require('mongodb');


router.post('/loguser', async (req,res) => {
  const {email,password} = req.body;
  console.log('email, password => ', email,password);
  User.findOne({email: email})
  .then(user => {
    if(!user) {
      console.log('no user -> ', user);
      res.status(401).json({message: 'invalide email/password'});
    } else {
      // console.log('user -> ', user);
      bcrypt.compare(password, user.password)
      .then(response => {
        if (response) {
          const currentuser = {
            monid: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email
          };
          const accessToken = jwt.sign(currentuser,
            process.env.ACCESS_TOKEN_SECRET, {
              expiresIn: '1h'
            })
          // console.log('access token -> ', accessToken);
          expirationTime = 60*60;
          res.status(200).json({email: user.email, userId: user._id, token: accessToken, expiresIn: expirationTime});
        } else {
          res.status(401).json({userid: 'error'});
        }
      }).catch(err => {
        rs.status(201).json({message: err});
      })
    }
  })

})

router.post('/register', async (req,res) => {
  const { name, phone,email, password} = req.body;
  console.log('rquest body  -> ', req.body);
  const by_username = await User.findOne({email: email});
  bcrypt.hash(password, 10).then(hash => {
    const by_password = User.findOne({password: hash});
    if (!by_username || !by_password) {
      const newuser =  new User ({
        _id: new ObjectId(),
        name: name,
        phone: phone,
        email: email,
        password: hash
      });
      try {
        console.log('before save -> ', newuser);
        const usaved =  newuser.save();
        res.json({message: true});
      } catch(err) {
        // console.log('registration error -> ', err);
      }
  } else {
    res.json({message: 'Requested User Not Found'});
  }
  })
})

router.get('/currentUser/:id', AuthenticateToken, (req,res) => {
  try {
    const {id} = req.params;
    // console.log('current user function -> ', id);
    User.findById(id)
    .then(user => {
      // console.log('find by id user -> ', user);
      if (!user) {
        res.status(401).json({message: 'cant find user '});
      } else {
        res.status(200).json({username: user.name, phone: user.phone, email: user.email});
      }
    })
  }catch(err) {
    res.status(404).json({error: err, location: 'user.get.currentUser'});
  }
})


module.exports = router;

function AuthenticateToken(req, res, next) {
  const authHeader = req.header['authorization'];
  const token = authHeader && authHeader.splice(' ')[1];

  if ( token == null) res.sendStatus(401);

  jwt.verify(token, process,env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  })
}
