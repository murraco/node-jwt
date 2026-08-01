# Node JWT

[![CI](https://github.com/murraco/node-jwt/actions/workflows/ci.yml/badge.svg)](https://github.com/murraco/node-jwt/actions/workflows/ci.yml)

A small JWT authentication service built with Express, Sequelize and MySQL.

# Stack

![](https://img.shields.io/badge/node_20+-✓-blue.svg)
![](https://img.shields.io/badge/express_4-✓-blue.svg)
![](https://img.shields.io/badge/sequelize_6-✓-blue.svg)
![](https://img.shields.io/badge/joi-✓-blue.svg)
![](https://img.shields.io/badge/mocha-✓-blue.svg)

## ⚠️ Breaking changes

If you are upgrading from an older clone, three things changed:

1. **Credentials moved from the query string to the request body.** `POST /auth` and
   `POST /users` used to read `?username=…&password=…`. Query strings are recorded in
   access logs, proxy logs and browser history, so passwords are now read from the JSON
   body only. A query-string login returns `400`.
2. **Configuration moved to environment variables.** `config/env/*.js` no longer contains
   a committed secret. Copy `.env.example` and supply your own. In production the app
   **throws on startup** if `JWT_SECRET`, `DB_USER` or `DB_PASSWORD` is missing.
3. **`PUT /users/:userId` only accepts `username`, and only from the account's owner.**
   It previously wrote the entire request body to the row, and any authenticated user
   could target any id.

If you have an existing deployment, treat the old `$eCrEt` signing key as compromised —
it was public in this repository's history. Rotating it invalidates all issued tokens.

# Quick start

```bash
git clone https://github.com/murraco/node-jwt && cd node-jwt
cp .env.example .env          # then fill in JWT_SECRET, DB_USER, DB_PASSWORD
npm ci
```

Start MySQL and create the databases:

```bash
docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql:8
docker exec -i $(docker ps -qf ancestor=mysql:8) mysql -uroot -proot <<'SQL'
CREATE DATABASE IF NOT EXISTS jwt;
CREATE DATABASE IF NOT EXISTS jwt_dev;
CREATE DATABASE IF NOT EXISTS jwt_test;
SQL
```

Run it:

```bash
npm start          # node index.js
npm run dev        # nodemon, live reload
npm test           # mocha
npm run lint       # eslint
```

Check it is up — `http://localhost:8000/api-status` should return `{ "status": "ok" }`.
Set `PORT` to use a different port.

# Endpoints

| Method | Path | Auth | Body |
|---|---|---|---|
| `GET` | `/api-status` | – | – |
| `POST` | `/users` | – | `username`, `password` |
| `GET` | `/users` | Bearer | – |
| `GET` | `/users/:userId` | Bearer | – |
| `PUT` | `/users/:userId` | Bearer, owner only | `username` |
| `DELETE` | `/users/:userId` | Bearer, owner only | – |
| `POST` | `/auth` | – | `username`, `password` |
| `POST` | `/auth/refresh` | – | `username`, `refresh_token` |

Register a user:

```bash
curl -X POST http://localhost:8000/users \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin1"}'
```

Sign in — returns a `token` and a `refresh_token`:

```bash
curl -X POST http://localhost:8000/auth \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin1"}'
```

Use the token:

```bash
curl http://localhost:8000/users -H 'Authorization: Bearer <JWT_TOKEN>'
```

```json
[
  {
    "id": 1,
    "username": "admin",
    "created_at": "2026-07-31T21:42:01.000Z",
    "updated_at": "2026-07-31T21:52:05.000Z"
  }
]
```

Refresh tokens rotate: every issued JWT replaces the stored `refresh_token`, so a given
`refresh_token` can be redeemed exactly once.

# Configuration

Every value is read from the environment — see `.env.example`.

| Variable | Default (dev/test) | Required in production |
|---|---|---|
| `JWT_SECRET` | insecure placeholder | **yes** |
| `JWT_DURATION` | `2 hours` | no |
| `DB_HOST` | `localhost` | no |
| `DB_PORT` | `3306` | no |
| `DB_NAME` | `jwt_dev` / `jwt_test` | no |
| `DB_USER` | `root` | **yes** |
| `DB_PASSWORD` | `root` | **yes** |
| `PORT` | `8000` | no |

Generate a signing key with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

# Introduction (https://jwt.io)

I have a great introduction to JWT in one of my other repositories, click [here](https://github.com/murraco/spring-boot-jwt#introduction-httpsjwtio) to take a look!

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
├── .env.example                  * Template for local configuration
├── .github/workflows/ci.yml      * Lint + tests on Node 20 and 22 against MySQL 8
├── .gitignore                    * Example git ignore file
├── eslint.config.js              * ESLint flat configuration file
├── index.js                      * Entry point of our Node's app
├── LICENSE                       * MIT License
├── package.json                  * Defines our JavaScript dependencies
├── package-lock.json             * Defines our exact JavaScript dependencies tree
└── README.md                     * This file
```

# Contribution

- Report issues
- Open pull request with improvements
- Spread the word
- Reach out to me directly at <mauriurraco@gmail.com>

# Buy me a coffee to show your support!

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/murraco)
