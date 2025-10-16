// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();
// Import routes
import expenseRoutes from './routes/expenseRoutes.js'

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Debug route to test server
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Expense routes
app.use('/api/expenses', expenseRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Start server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
