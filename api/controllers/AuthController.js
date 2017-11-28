const jwt = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');
const config = require('../../config/env');
const User = require('../models/User');

function authenticate(req, res, next) {
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user && user.comparePassword(req.body.password)) {
      req.dbUser = user;
      next();
    } else {
      res.status(401).json({ error: 'Wrong username or password' });
    }
  }).catch((e) => {
    res.status(500).json({ error: e.message });
  });
}

async function generateJWT(req, res, next) {
  if (req.dbUser) {
    const jwtPayload = { id: req.dbUser.id };
    const jwtSecret = config.jwt.jwtSecret;
    const jwtData = { expiresIn: config.jwt.jwtDuration };
    req.token = jwt.sign(jwtPayload, jwtSecret, jwtData);
    // Sets a new refresh_token every time the jwt is generated
    await req.dbUser.update({ refresh_token: uuidv1() }).catch((e) => {
      res.status(500).json({ error: e.message });
    });
  }
  next();
}

function refreshJWT(req, res, next) {
  User.findOne({
    where: {
      username: req.body.username,
      refresh_token: req.body.refresh_token,
    },
  }).then((user) => {
    req.dbUser = user;
    next();
  }).catch(() => {
    res.status(401).json({ error: 'Invalid username or refresh_token' });
  });
}

function returnJWT(req, res) {
  if (req.dbUser && req.token) {
    res.status(201).json({ token: req.token, refresh_token: req.dbUser.refresh_token });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = {
  authenticate, generateJWT, refreshJWT, returnJWT,
};
