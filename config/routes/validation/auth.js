const Joi = require('joi');

module.exports = {

  authenticate: {
    body: {
      username: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    },
  },

  refreshJWT: {
    body: {
      username: Joi.string().alphanum().min(3).max(30).required(),
      refresh_token: Joi.string().required(),
    },
  },

};
