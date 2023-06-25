import express from 'express';
import { PrismaClient } from '@prisma/client';
import userRoutes from './user';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.use('/user', userRoutes);  // Add this line

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
