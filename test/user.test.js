process.env.NODE_ENV = 'test';

const request = require('supertest-as-promised');
const assert = require('chai').assert;
const jwt = require('jsonwebtoken');

const config = require('../config/env');
const app = require('../config/express');
const User = require('../api/models/User');

describe('User', () => {

	let token = '';

	before(async () => {
		await User.sync({ force: true });
		await User.create({
			username: 'Darth Vader',
			password: '1234',
		});
		await User.create({
			username: 'Alf',
			password: '1234',
		});
		token = await jwt.sign({ id: 1 }, config.jwt.jwtSecret, { expiresIn: config.jwt.jwtDuration });
	});

	describe('GET /users', () => {
		it('It should GET all the users', (done) => {
			request(app)
				.get('/users')
				.set('Authorization', `Bearer ${token}`)
				.expect(200)
				.then((res) => {
					assert.typeOf(res.body, 'array');
					assert.equal(res.body.length, 2);
					done();
				});
		});
	});

	describe('POST /users', () => {
		it('It should create a new user', (done) => {
			request(app)
				.post('/users')
				.send({
					username: 'Homer J. Simpson',
					password: '1234',
				})
				.expect(201)
				.then((res) => {
					assert.equal(res.body.username, 'Homer J. Simpson');
					done();
				});
		})
	});

	describe('GET /users/:userId', () => {
		it('It should retrieve the user with id 1', (done) => {
			request(app)
				.get('/users/3')
				.set('Authorization', `Bearer ${token}`)
				.expect(200)
				.then((res) => {
					assert.equal(res.body.username, 'Homer J. Simpson');
					done();
				});
		});
	});

	describe('PUT /users/:userId', () => {
		it('It should update user "Darth Vader" to "Obi Wan"', (done) => {
			request(app)
				.put('/users/2')
				.set('Authorization', `Bearer ${token}`)
				.send({
					username: 'Homer J. Simpson',
				})
				.expect(201, done());
		});
	});

	describe('DELETE /users/:userId', () => {
		it('It should delete user with id 3', (done) => {
			request(app)
				.delete('/users/3')
				.set('Authorization', `Bearer ${token}`)
				.expect(204, done());
		});
	});

});
