const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const { ObjectId } = require('mongodb');

class UserService {

  constructor() {}

  login = async function(email,password) {
    try{
      const user = await User.findOne({email: email});
      if(!user) return new new Error('invalide email/password');
      const response = await bcrypt.compare(password, user.password);
      if (!response) return new Error("login Information Not Valide");
      const currentuser = {
        monid: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email
      };
      const accessToken = jwt.sign(currentuser,
        process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h'
      });
      const expirationTime = 60*60;
      return {email: user.email, userId: user._id, token: accessToken, expiresIn: expirationTime};
    }catch(err) {
      throw err;
    }
  }

  async Register(name, phone,email, password) {
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
          const usaved =  newuser.save();
          return true
        } catch(err) {
          throw new Error(err);
        }
      } else {
        throw new Error('Requested User Not Found');
      }
    })
  }

  getUser = async function(id) {
    try {
      const user = await User.findById(id);
      if(!user) return new Error('cant find user ')
      return {username: user.name, phone: user.phone, email: user.email}
    }catch(err) {
      throw err
    }
  }

}

module.exports = {
  userService: new UserService()
}
