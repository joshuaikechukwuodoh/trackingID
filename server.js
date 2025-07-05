import express from "express";
import authMiddleware from "./src/middlewares/authMiddleware.js";
import adminRoute from "./src/routes/adminRoute.js";
import trackingRoute from "./src/routes/trackingRoute.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import {generateToken} from "./src/utils/generateToken.js";

// Initialize app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
// Configure CORS
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: '*', // Allow all origins (adjust for production)
    credentials: true, // Allow cookies and credentials
    exposedHeaders: ['set-cookie'], // Expose set-cookie header to the client
}));

// Routes
app.use("/admin", adminRoute);
app.use("/tracking", trackingRoute);


// Protected routes
app.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: "This is a protected route" });
});

// connct to the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 

console.log('Generated token:', generateToken());



export default app;
