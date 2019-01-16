const bcrypt = require('bcryptjs');
//const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model.js');
require('env2')('config.env');

const index = (req, res) => {
  res.render('auth');
};


const register = (req, res) => {
  const { name, username, password } = req.body;
  bcrypt.hash(password, 10)
    .then(hashedPassword => new User({
      name,
      username,
      password: hashedPassword,
    })).then(user => new Promise((resolve, reject) => {
      user.save((err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user.id);
        }
      });
    }))
      .then((id) => {
          return new Promise((resolve, reject) => {
              const SECRET = process.env.SECRET;
              jwt.sign(id, SECRET, (signErr, token) => {
                  if(signErr) reject(signErr);
                  else resolve(token);
              });
          });
      })
    .then((token) => {
        res.cookie('id', token, {maxAge: 360000});
        res.redirect('/');
    })
    .catch((err) => {
        console.log(err);
        res.send(err);
    });
};

module.exports = { register, index };
