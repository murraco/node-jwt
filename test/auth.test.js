process.env.NODE_ENV = 'test';

const request = require('supertest-as-promised');
const app = require('../config/express');
const User = require('../api/models/User');

describe('Auth', () => {

  let { token, refresh_token } = '';

  before(async () => {
    await User.sync({ force: true });
    await User.create({
      username: 'Alf',
      password: '1234',
    });
  });

  describe('POST /auth', () => {
    it('It should auth the user Alf', (done) => {
      request(app)
        .post('/auth')
        .send({
          username: 'Alf',
          password: '1234',
        })
        .expect(201)
        .then((res) => {
          token = res.body.token;
          refresh_token = res.body.refresh_token;
          done();
        });
    });
  });

  describe('POST /auth/refresh', () => {
    it('It should refresh the user Alf\'s token', (done) => {
      request(app)
        .post('/auth/refresh')
        .send({
          username: 'Alf',
          'refresh_token': refresh_token,
        })
        .expect(201)
        .then((res) => {
          token = res.body.token;
          done();
        });
    });
  });

});
