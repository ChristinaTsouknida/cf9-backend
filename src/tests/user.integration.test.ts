import { TestServer } from "./testSetup";
import userRouter from '../routes/user.routes';
import User from '../models/user.model'
import { before } from "node:test";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

const server = new TestServer();
server.app.use('/users', userRouter);


describe('User API Tests', () => {
  let token: string;

  beforeAll(async() => {
    await server.start();
    const hash = await bcrypt.hash("123456", 10);
    let user = await User.create({
      username: "testUser",
      password: hash,
      email:"testUser@aueb.gr",
      roles:[]});
    // console.log("USER>>>>>", user);
    const payload = { username: user.username, email:user.email, roles: user.roles};
    // console.log("PAYLOAD>>>>", payload);
    // console.log("JWT_SECRET", JWT_SECRET);
    token = jwt.sign(payload, JWT_SECRET, {expiresIn:'1h'});
    // console.log("TOKEN>>>>", token);
  });

  afterAll(async() => {await server.stop()});

  test("GET /users -> returns all users", async() => {
    const res = await server.request.get('/users');
    console.log(res.status, res.body);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true)
  });


  test('POST /users -> creates a user', async() => {
    const res = await server.request.post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({username:"user1", password:"123456"});
      
      console.log("POST>>>>", res.status, res.body);
      expect(res.status).toBe(201);
      expect(res.body.status).toBe(true);
  })

})