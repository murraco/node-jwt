const express = require('express');
const bodyParser = require('body-parser');
const { ValidationError } = require('express-validation');

const routes = require('./routes/index');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// body-parser 2.x leaves req.body as undefined for a request with no body, instead of
// defaulting it to {} like 1.x did. express-validation only checks req.body against a
// schema when it's truthy, so an undefined body skips validation entirely and reaches
// the controllers, which all assume req.body is an object.
app.use((req, res, next) => {
  if (req.body === undefined) {
    req.body = {};
  }
  next();
});

// Mount all routes on / path
app.use('/', routes);

// Without this, a rejected schema or a bad token falls through to Express' default
// handler and comes back as an HTML stack trace with a 500.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({ error: 'Validation failed', details: err.details });
  }

  // Thrown by express-jwt when the Authorization header is missing, malformed, or the
  // signature does not verify.
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid or missing token' });
  }

  return res.status(500).json({ error: err.message });
});

module.exports = app;
