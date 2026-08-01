const Joi = require('joi');

const username = Joi.string().pattern(/^[\w .-]{3,30}$/).required();
const password = Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required();

module.exports = {

  create: {
    body: Joi.object({
      username,
      password,
    }),
  },

  // Only username is accepted. Joi rejects unknown keys by default, so a body carrying
  // password, id or refresh_token is a 400 here before it ever reaches the controller
  // whitelist -- the two checks are deliberately redundant.
  update: {
    body: Joi.object({
      username,
    }),
  },

};

// NOTE: there is no `load` schema. :userId is resolved by router.param, which Express runs
// *before* any route middleware, so an express-validation params schema could never fire in
// time. UserController.load validates the id itself instead.
