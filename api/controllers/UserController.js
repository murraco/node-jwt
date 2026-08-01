const User = require('../models/User');

// Fields a client is allowed to change on an existing user. Anything else in the body is
// ignored. Passing req.body straight to update() let a caller set their own password
// hash, id, or refresh_token -- a full account takeover primitive.
const UPDATABLE_FIELDS = ['username'];

function pick(source, fields) {
  return fields.reduce((acc, field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      acc[field] = source[field];
    }
    return acc;
  }, {});
}

function load(req, res, next, id) {
  const userId = Number(id);

  // :userId reaches the DB layer directly, so reject anything that is not a positive
  // integer before Sequelize tries to coerce it.
  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(400).json({ error: 'Invalid user id' });
  }

  return User.findByPk(userId).then((user) => {
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      req.dbUser = user;
      next();
    }
  }).catch((e) => {
    res.status(500).json({ error: e.message });
  });
}

// Any route that mutates a user must sit behind this. express-jwt 8 puts the verified
// payload on req.auth (it was req.user up to express-jwt 6), so reading req.user here
// would silently yield undefined and let the check pass for everyone.
function requireOwnership(req, res, next) {
  if (!req.auth || req.auth.id !== req.dbUser.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  return next();
}

function get(req, res) {
  return res.status(200).json(req.dbUser.toPublicJSON());
}

function create(req, res) {
  User.create({
    username: req.body.username,
    password: req.body.password,
  }).then((newUser) => {
    // The `attributes` option does nothing on create(), so the old code serialised the
    // whole row -- bcrypt hash and refresh_token included -- into the 201 response.
    res.status(201).json(newUser.toPublicJSON());
  }).catch((e) => {
    res.status(500).json({ error: e.message });
  });
}

function update(req, res) {
  req.dbUser.update(pick(req.body, UPDATABLE_FIELDS)).then(() => {
    res.sendStatus(201);
  }).catch((e) => {
    res.status(500).json({ error: e.message });
  });
}

function list(req, res) {
  const { offset = 0, limit = 50 } = req.query;

  User.findAll({
    offset: parseInt(offset, 10) || 0,
    limit: parseInt(limit, 10) || 50,
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
  load, requireOwnership, get, create, update, list, remove,
};
