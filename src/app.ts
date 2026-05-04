import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import { setupSwagger } from './swagger';
import cors from 'cors'


dotenv.config();

const app = express();

app.use(cors({
  origin:['http://localhost:4200', 'http://render..']  
}))

setupSwagger(app)
app.use(express.json());

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes);

export default app