module.exports = {
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
    database: process.env.MYSQL_DATABASE || 'jwt',
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    jwtDuration: process.env.JWT_DURATION || '2 hours',
  },
};
