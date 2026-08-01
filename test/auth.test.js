process.env.NODE_ENV = 'test';

const request = require('supertest');
const { assert } = require('chai');

const app = require('../config/express');
const User = require('../api/models/User');

describe('Auth', () => {
  let refreshToken = '';

  before(async () => {
    await User.sync({ force: true });
    await User.create({
      username: 'Alf',
      password: '1234',
    });
  });

  describe('POST /auth', () => {
    it('authenticates a user from the request body', async () => {
      const res = await request(app)
        .post('/auth')
        .send({ username: 'Alf', password: '1234' })
        .expect(201);

      assert.isString(res.body.token);
      assert.isString(res.body.refresh_token);
      refreshToken = res.body.refresh_token;
    });

    it('rejects a wrong password with 401', async () => {
      await request(app)
        .post('/auth')
        .send({ username: 'Alf', password: 'wrong1' })
        .expect(401);
    });

    // Breaking change: credentials used to be read from req.query, which wrote the
    // password into every access log. A query-string login must now fail outright
    // rather than quietly keep working.
    it('no longer accepts credentials in the query string', async () => {
      await request(app)
        .post('/auth?username=Alf&password=1234')
        .expect(400);
    });

    it('rejects a body missing the password with 400', async () => {
      await request(app)
        .post('/auth')
        .send({ username: 'Alf' })
        .expect(400);
    });
  });

  describe('POST /auth/refresh', () => {
    it('exchanges a refresh_token for a new jwt', async () => {
      const res = await request(app)
        .post('/auth/refresh')
        .send({ username: 'Alf', refresh_token: refreshToken })
        .expect(201);

      assert.isString(res.body.token);
      assert.notEqual(res.body.refresh_token, refreshToken, 'refresh_token should rotate');
    });

    it('rejects a stale refresh_token with 401', async () => {
      await request(app)
        .post('/auth/refresh')
        .send({ username: 'Alf', refresh_token: refreshToken })
        .expect(401);
    });
  });
});
