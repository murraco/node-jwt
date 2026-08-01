// Test defaults mirror development but target a throwaway database, since the suite
// runs User.sync({ force: true }) and will drop every table it touches.
module.exports = {
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    database: process.env.DB_NAME || 'jwt_test',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET || 'insecure-test-only-secret',
    jwtDuration: process.env.JWT_DURATION || '2 hours',
  },
};
