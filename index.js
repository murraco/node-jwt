const app = require('./config/express');

const User = require('./api/models/User');

// { force: true } will drop the table if it already exists
User.sync();

const port = parseInt(process.env.PORT, 10) || 8000;

app.listen(port, () => {
  console.log(`The server is running at localhost: ${port}`);
});

module.exports = app;
