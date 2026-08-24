const Joi = require('joi');

// express-validation 4 requires real Joi schema objects. The bare object literals these
// used to be were never valid schemas -- and nothing imported this file at all, so no
// request has ever actually been validated.
//
// The username pattern is deliberately wider than alphanum(): the project's own examples
// and tests use names like "Darth Vader" and "Homer J. Simpson", which alphanum() rejects.
const username = Joi.string().pattern(/^[\w .-]{3,30}$/).required();
const password = Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required();

module.exports = {

  authenticate: {
    body: Joi.object({
      username,
      password,
    }).required(),
  },

  refreshJWT: {
    body: Joi.object({
      username,
      refresh_token: Joi.string().guid({ version: 'uuidv1' }).required(),
    }).required(),
  },

};
