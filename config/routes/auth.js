const express = require('express');
const { validate } = require('express-validation');

const authCtrl = require('../../api/controllers/AuthController');
const authValidation = require('./validation/auth');

const router = express.Router();

router
  .route('/')
  .post(
    validate(authValidation.authenticate, { keyByField: true }),
    authCtrl.authenticate,
    authCtrl.generateJWT,
    authCtrl.returnJWT,
  );

router
  .route('/refresh')
  .post(
    validate(authValidation.refreshJWT, { keyByField: true }),
    authCtrl.refreshJWT,
    authCtrl.generateJWT,
    authCtrl.returnJWT,
  );

module.exports = router;
