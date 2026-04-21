import { TestServer } from "./testSetup";
import userRouter from '../routes/user.routes';
import User from '../models/user.model'
import { before } from "node:test";

const server = new TestServer();
server.app.use('/users', userRouter);

describe('User API Tests', () => {
  beforeAll(async() => {
    await server.start()
  });

  afterAll(async() => {await server.stop()});

  test("GET /users -> returns all users", async() => {
    
  })

})