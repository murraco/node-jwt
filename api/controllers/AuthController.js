const jwt = require('jsonwebtoken');
const { v1: uuidv1 } = require('uuid');

const config = require('../../config/env');
const User = require('../models/User');

// Credentials arrive in the request body, never the query string. Query strings are
// written to access logs, browser history and proxy logs in plaintext.
function authenticate(req, res, next) {
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user && user.comparePassword(req.body.password)) {
      console.log(`[audit] authentication success username=${req.body.username} ip=${req.ip}`);
      req.dbUser = user;
      next();
    } else {
      console.warn(`[audit] authentication failure username=${req.body.username} ip=${req.ip}`);
      res.status(401).json({ error: 'Wrong username or password' });
    }
  }).catch((e) => {
    res.status(500).json({ error: e.message });
  });
}

async function generateJWT(req, res, next) {
  if (!req.dbUser) {
    return next();
  }

  try {
    const jwtPayload = { id: req.dbUser.id };
    const { jwtSecret } = config.jwt;
    const jwtData = { expiresIn: config.jwt.jwtDuration };

    req.token = jwt.sign(jwtPayload, jwtSecret, jwtData);
    // Sets a new refresh_token every time the jwt is generated
    await req.dbUser.update({ refresh_token: uuidv1() });

    console.log(`[audit] jwt issued userId=${req.dbUser.id} ip=${req.ip}`);
    return next();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

function refreshJWT(req, res, next) {
  User.findOne({
    where: {
      username: req.body.username,
      refresh_token: req.body.refresh_token,
    },
  }).then((user) => {
    if (!user) {
      console.warn(`[audit] token refresh failure username=${req.body.username} ip=${req.ip}`);
      return res.status(401).json({ error: 'Invalid username or refresh_token' });
    }

    console.log(`[audit] token refresh success userId=${user.id} ip=${req.ip}`);
    req.dbUser = user;
    return next();
  }).catch((e) => {
    res.status(500).json({ error: e.message });
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
