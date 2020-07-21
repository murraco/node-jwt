module.exports = {
  mysql: {
    host: 'localhost',
    port: 3306,
    database: 'jwt_test',
    username: 'root',
    password: 'password',
  },
  jwt: {
    jwtSecret: '$eCrEt',
    jwtDuration: '2 hours',
  },
};
