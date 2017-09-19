const express   = require('express');
const router    = express.Router();
const User      = require('../models/users.js');
const bcrypt    = require('bcrypt');

router.get('/', (req, res) => {
  User.find( {}, (err, foundUsers) => {
    res.json(foundUsers)
    console.log(foundUsers);
  })
});

router.post('/login', (req, res) => {
  User.findOne( {username: req.body.username}, (error, user) => {
    console.log(user);
    if(user) {
      if(bcrypt.compareSync(req.body.password, user.password)) {
        req.session.username = req.body.username;
        req.sesion.loggedin = true;
        res.json(req.session.loggedin);
        console.log(req.body.username);
        console.log(req.body.display);
        console.log(req.body.password);
        console.log('logged in');
      } else {
        console.log('username or password are incorrect');
      }
    }
  });
});

router.post('/register', (req, res) => {
  const password = req.body.password;
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const userDatabase = {};
  userDatabase.username = req.body.username;
  userDatabase.display = req.body.display;
  userDatabase.password = passwordHash;
  User.create(userDatabase, (err, user) => {
    req.session.username = user.username;
    req.session.display = user.display;
    req.session.logged   = true;
    res.json(user)
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy((error) => {
      if(error) {
        console.log(error);
      } else {
        req.session = false;
        console.log('logged out');
        res.redirect('/');
      }
  });
});

module.exports = router;
