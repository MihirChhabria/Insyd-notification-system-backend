import dotenv from 'dotenv';
import express from 'express';
import likeRoutes from './routes/likeRoutes.js';
import { connectRabbitMQ } from './services/mqService.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/like', likeRoutes);

// Start the server
async function startServer() {
    await connectRabbitMQ();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();