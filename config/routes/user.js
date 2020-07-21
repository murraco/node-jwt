const express = require('express');
const jwt = require('express-jwt');

const config = require('../env');
const userCtrl = require('../../api/controllers/UserController');

const router = express.Router();
const secret = config.jwt.jwtSecret;
const algorithms = ['RS256'];

router
  .route('/')
  .get(jwt({ secret, algorithms }), userCtrl.list)
  .post(userCtrl.create);

router
  .route('/:userId')
  .get(jwt({ secret, algorithms }), userCtrl.get)
  .put(jwt({ secret, algorithms }), userCtrl.update)
  .delete(jwt({ secret, algorithms }), userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

module.exports = router;
