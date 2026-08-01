// Development defaults are intentionally permissive so a fresh clone runs with no setup.
// Never rely on them outside development -- see production.js, which refuses to start
// unless the secrets are supplied through the environment.
module.exports = {
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    database: process.env.DB_NAME || 'jwt_dev',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET || 'insecure-development-only-secret',
    jwtDuration: process.env.JWT_DURATION || '2 hours',
  },
};
