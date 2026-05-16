const User = require('../models/User');

function load(req, res, next, id) {
  User.findById(id, { attributes: { exclude: ['password', 'refresh_token'] } }).then((user) => {
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else if (req.user && req.user.id !== user.id) {
      res.status(403).json({ error: 'Forbidden — you can only access your own account' });
    } else {
      req.dbUser = user;
      next();
    }
  }).catch((e) => {
    res.status(500).json({ error: e.message });
  });
}

function get(req, res) {
  return res.status(200).json(req.dbUser);
}

function create(req, res) {
  User.create({
    username: req.body.username,
    password: req.body.password,
  }, { attributes: { exclude: ['refresh_token'] } }).then((newUser) => {
    res.status(201).json(newUser);
  }).catch((e) => {
    res.status(500).json({ error: e.message });
  });
}

function update(req, res) {
  const allowedFields = ['username'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }
  req.dbUser.update(updates).then(() => {
    res.sendStatus(201);
  }).catch((e) => {
    res.status(500).json({ error: e.message });
  });
}

function list(req, res) {
  const { offset = 0, limit = 50 } = req.query;
  User.findAll({
    offset,
    limit,
    attributes: { exclude: ['password', 'refresh_token'] },
  }).then((users) => {
    res.status(200).json(users);
  }).catch((e) => {
    res.status(500).json({ error: e.message });
  });
}

async function remove(req, res) {
  await req.dbUser.destroy();
  res.sendStatus(204);
}

module.exports = {
  load, get, create, update, list, remove,
};
