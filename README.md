# Node ES6 JWT

![](https://img.shields.io/badge/node-success-brightgreen.svg)
![](https://img.shields.io/badge/test-success-brightgreen.svg)

# Stack

![](https://img.shields.io/badge/node_8-✓-blue.svg)
![](https://img.shields.io/badge/ES6-✓-blue.svg)
![](https://img.shields.io/badge/express-✓-blue.svg)
![](https://img.shields.io/badge/sequelize-✓-blue.svg)
![](https://img.shields.io/badge/mocha-✓-blue.svg)

# File structure

```
node-es6-jwt/
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
    }
  };
  ```

3. Fork this repository and clone it
  
  ```
  $ git clone https://github.com/<your-user>/node-es6-jwt
  ```
  
4. Navigate into the folder  

  ```
  $ cd node-es6-jwt
  ```
  
5. Install NPM dependencies

  ```
  $ npm install
  ```
  
6. Run the project

  ```
  $ node index.js
  ```
  
7. Or use `nodemon` for live-reload
  
  ```
  $ npm start
  ```
  
  > `npm start` will run `nodemon index.js`.
  
8. Navigate to `http://localhost:8000/api-status` in your browser to check you're seing the following response

  ```javascript
  { "status": "ok" }
  ```

  > The port can be changed by the setting the environment variable `PORT`

9. If you want to execute the tests

```
$ npm test
```

> `npm test` will run `mocha`.

# Contribution

- Report issues
- Open pull request with improvements
- Spread the word
- Reach out to me directly at <mauriurraco@gmail.com>
