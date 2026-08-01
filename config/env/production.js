// Production reads every secret from the environment and refuses to boot without them.
// A missing value here is a deployment error, not something to paper over with a default:
// falling back to a committed secret is what lets anyone forge a valid token.
function required(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Refusing to start in production.`,
    );
  }

  return value;
}

module.exports = {
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    database: process.env.DB_NAME || 'jwt',
    username: required('DB_USER'),
    password: required('DB_PASSWORD'),
  },
  jwt: {
    jwtSecret: required('JWT_SECRET'),
    jwtDuration: process.env.JWT_DURATION || '2 hours',
  },
};
