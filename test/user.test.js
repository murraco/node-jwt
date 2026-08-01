process.env.NODE_ENV = 'test';

const request = require('supertest');
const { assert } = require('chai');
const jwt = require('jsonwebtoken');

const config = require('../config/env');
const app = require('../config/express');
const User = require('../api/models/User');

const tokenFor = (id) => jwt.sign({ id }, config.jwt.jwtSecret, {
  expiresIn: config.jwt.jwtDuration,
});

describe('User', () => {
  let vader;
  let alf;
  let vaderToken;
  let alfToken;

  before(async () => {
    await User.sync({ force: true });
    vader = await User.create({ username: 'Darth Vader', password: '1234' });
    alf = await User.create({ username: 'Alf', password: '1234' });
    vaderToken = tokenFor(vader.id);
    alfToken = tokenFor(alf.id);
  });

  describe('GET /users', () => {
    it('lists users for an authenticated caller', async () => {
      const res = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${vaderToken}`)
        .expect(200);

      assert.typeOf(res.body, 'array');
      assert.equal(res.body.length, 2);
    });

    it('rejects an unauthenticated caller with 401', async () => {
      await request(app).get('/users').expect(401);
    });

    // The old committed secret must be worthless now that it comes from the environment.
    it('rejects a token forged with the old hardcoded secret', async () => {
      const forged = jwt.sign({ id: vader.id }, '$eCrEt', { expiresIn: '2 hours' });

      await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${forged}`)
        .expect(401);
    });
  });

  describe('POST /users', () => {
    it('creates a user from the request body', async () => {
      const res = await request(app)
        .post('/users')
        .send({ username: 'Homer J. Simpson', password: '1234' })
        .expect(201);

      assert.equal(res.body.username, 'Homer J. Simpson');
    });

    it('never returns the password hash or refresh_token', async () => {
      const res = await request(app)
        .post('/users')
        .send({ username: 'Ned Flanders', password: '1234' })
        .expect(201);

      assert.notProperty(res.body, 'password');
      assert.notProperty(res.body, 'refresh_token');
    });

    it('rejects a username that violates the schema', async () => {
      await request(app)
        .post('/users')
        .send({ username: 'no', password: '1234' })
        .expect(400);
    });
  });

  describe('GET /users/:userId', () => {
    it('retrieves a single user', async () => {
      const res = await request(app)
        .get(`/users/${alf.id}`)
        .set('Authorization', `Bearer ${vaderToken}`)
        .expect(200);

      assert.equal(res.body.username, 'Alf');
      assert.notProperty(res.body, 'password');
    });

    it('rejects a non-numeric id with 400', async () => {
      await request(app)
        .get('/users/not-an-id')
        .set('Authorization', `Bearer ${vaderToken}`)
        .expect(400);
    });

    it('returns 404 for an unknown id', async () => {
      await request(app)
        .get('/users/99999')
        .set('Authorization', `Bearer ${vaderToken}`)
        .expect(404);
    });
  });

  describe('PUT /users/:userId', () => {
    it('lets a user update their own username', async () => {
      await request(app)
        .put(`/users/${alf.id}`)
        .set('Authorization', `Bearer ${alfToken}`)
        .send({ username: 'Alf The Alien' })
        .expect(201);

      await alf.reload();
      assert.equal(alf.username, 'Alf The Alien');
    });

    // IDOR: load() resolves any :userId, so without an ownership guard Vader's token
    // was enough to rewrite Alf's account.
    it("refuses to update another user's account with 403", async () => {
      await request(app)
        .put(`/users/${alf.id}`)
        .set('Authorization', `Bearer ${vaderToken}`)
        .send({ username: 'Pwned' })
        .expect(403);

      await alf.reload();
      assert.equal(alf.username, 'Alf The Alien');
    });

    // Mass assignment: req.dbUser.update(req.body) accepted any column at all.
    it('refuses a body carrying a password and leaves the password unchanged', async () => {
      await request(app)
        .put(`/users/${alf.id}`)
        .set('Authorization', `Bearer ${alfToken}`)
        .send({ username: 'Alf The Alien', password: 'evil99' })
        .expect(400);

      await request(app)
        .post('/auth')
        .send({ username: 'Alf The Alien', password: '1234' })
        .expect(201);
    });

    it('refuses a body carrying a refresh_token', async () => {
      await request(app)
        .put(`/users/${alf.id}`)
        .set('Authorization', `Bearer ${alfToken}`)
        .send({ username: 'Alf The Alien', refresh_token: 'attacker-chosen' })
        .expect(400);
    });
  });

  describe('DELETE /users/:userId', () => {
    it("refuses to delete another user's account with 403", async () => {
      await request(app)
        .delete(`/users/${alf.id}`)
        .set('Authorization', `Bearer ${vaderToken}`)
        .expect(403);

      assert.isNotNull(await User.findByPk(alf.id));
    });

    it('lets a user delete their own account', async () => {
      await request(app)
        .delete(`/users/${vader.id}`)
        .set('Authorization', `Bearer ${vaderToken}`)
        .expect(204);

      assert.isNull(await User.findByPk(vader.id));
    });
  });
});
