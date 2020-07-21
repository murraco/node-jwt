module.exports = {
  mysql: {
    host: 'localhost',
    port: 3306,
    database: 'jwt_test',
    username: 'root',
    password: 'root',
  },
  jwt: {
    jwtSecret: '$eCrEt',
    jwtDuration: '2 hours',
  },
};
