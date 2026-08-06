const express = require('express');
const { expressjwt } = require('express-jwt');
const { validate } = require('express-validation');

const config = require('../env');
const userCtrl = require('../../api/controllers/UserController');
const userValidation = require('./validation/user');

const router = express.Router();
const secret = config.jwt.jwtSecret;
const algorithms = ['HS256'];

// express-jwt 8 is a named export and stores the verified payload on req.auth.
const requireJWT = expressjwt({ secret, algorithms });

router
  .route('/')
  .get(requireJWT, userCtrl.list)
  .post(validate(userValidation.create, { keyByField: true }), userCtrl.create);

router
  .route('/:userId')
  .get(requireJWT, userCtrl.requireOwnership, userCtrl.get)
  .put(
    requireJWT,
    validate(userValidation.update, { keyByField: true }),
    userCtrl.requireOwnership,
    userCtrl.update,
  )
  .delete(requireJWT, userCtrl.requireOwnership, userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

module.exports = router;
