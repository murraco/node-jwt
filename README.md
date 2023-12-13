# Node JWT

![](https://img.shields.io/badge/node-success-brightgreen.svg)
![](https://img.shields.io/badge/test-success-brightgreen.svg)

# Stack

![](https://img.shields.io/badge/node_8-✓-blue.svg)
![](https://img.shields.io/badge/ES6-✓-blue.svg)
![](https://img.shields.io/badge/express-✓-blue.svg)
![](https://img.shields.io/badge/sequelize-✓-blue.svg)
![](https://img.shields.io/badge/mocha-✓-blue.svg)

***

<h3 align="center">Please help this repo with a ⭐ if you find it useful! :blush:</h3>

***

# File structure

```
node-jwt/
│
├── api/
│   ├── controllers/
│   │   ├── AuthController.js
│   │   └── UserController.js
│   │
│   └── models/
│       └── User.js
│
├── config/
│   ├── env/
│   │   ├── development.js
│   │   ├── index.js
│   │   ├── production.js
│   │   └── test.js
│   │
│   ├── routes/
│   │   ├── validation/
│   │   │   ├── auth.js
│   │   │   └── user.js
│   │   │
│   │   ├── auth.js
│   │   ├── index.js
│   │   └── user.js
│   │
│   ├── express.js
│   └── sequelize.js
│
├── test/
│   ├── auth.test.js
│   └── user.test.js
│   
├── .eslintrc                     * ESLint configuration file
├── .gitignore                    * Example git ignore file
├── index.js                      * Entry point of our Node's app
├── LICENSE                       * MIT License
├── package.json                  * Defines our JavaScript dependencies
├── package-lock.json             * Defines our exact JavaScript dependencies tree
└── README.md                     * This file
```

# Introduction (https://jwt.io)

I have a great introduction to JWT in one of my other repositories, click [here](https://github.com/murraco/spring-boot-jwt#introduction-httpsjwtio) to take a look!

## How to use this code?

1. Make sure you have the latest stable version of Node.js installed

```
$ sudo npm cache clean -f
$ sudo npm install -g n
$ sudo n stable
```
  
2. Configure your database and jsonwebtoken in `config/env`. E.g.:

```javascript
module.exports = {
  mysql: {
    host: 'localhost',
    port: 3306,
    database: 'jwt_dev',
    username: 'root',
    password: 'root',
  },
  jwt: {
    jwtSecret: '$eCrEt',
    jwtDuration: '2 hours',
  },
};
```

3. Fork this repository and clone it
  
```
$ git clone https://github.com/<your-user>/node-jwt
```
  
4. Navigate into the folder  

```
$ cd node-jwt
```
5. Install NPM dependencies

```
$ npm install
```
  
6. Make sure you have a MySQL DB up and running, if you don't, using docker is the easiest way

```
$ docker run -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -d mysql
```
Login into the container, update the root user and create databases

```
$ docker exec -it <CONTAINER ID> mysql -uroot -proot
$ ALTER USER root IDENTIFIED WITH mysql_native_password BY 'root';
$ CREATE DATABASE jwt;
$ CREATE DATABASE jwt_dev;
$ CREATE DATABASE jwt_test;
```
  
7. Run the project

```
$ node index.js
```
  
8. Or use `nodemon` for live-reload
  
```
$ npm start
```

> `npm start` will run `nodemon index.js`.
  
9. Navigate to `http://localhost:8000/api-status` in your browser to check you're seing the following response

```javascript
{ "status": "ok" }
```

> The port can be changed by the setting the environment variable `PORT`

10. If you want to execute the tests

```
$ npm test
```

> `npm test` will run `mocha`.

11. If you want to test it manually you can do it with the following commands

Register a new user:
```
curl -X POST 'http://localhost:8000/users?username=admin2&password=admin'
```

Sign in with the new user credentials:
```
curl -X POST 'http://localhost:8000/auth?username=admin&password=admin'
```

Copy the token and send a request to get all current users:
```
curl -X GET http://localhost:8000/users -H 'Authorization: Bearer <JWT_TOKEN>
```

12. And that's it, congrats! You should get a similar response to this one, meaning that you're now authenticated

```json
[
  {
    "id": 1,
    "username": "admin",
    "createdAt": "2020-07-21T21:42:01.000Z",
    "updatedAt": "2020-07-21T21:52:05.000Z"
  }
]
```

# Contribution

- Report issues
- Open pull request with improvements
- Spread the word
- Reach out to me directly at <mauriurraco@gmail.com>
