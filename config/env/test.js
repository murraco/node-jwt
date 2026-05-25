module.exports = {
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
    database: process.env.MYSQL_DATABASE || 'jwt_test',
    username: process.env.MYSQL_USER || 'jwt_test_user',
    password: process.env.MYSQL_PASSWORD || 'jwt_test_password',
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET || 'test-jwt-secret-do-not-use-in-production',
    jwtDuration: process.env.JWT_DURATION || '2 hours',
  },
};
