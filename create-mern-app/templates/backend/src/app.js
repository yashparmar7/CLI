import dotenv from "dotenv";
dotenv.config();

import express from "express";
// #IF cors
import cors from "cors";
// #ENDIF
// #IF helmet
import helmet from "helmet";
// #ENDIF
// #IF morgan
import morgan from "morgan";
// #ENDIF
// #IF mongo
import { connectDB } from "./config/db.js";
// #ENDIF
// #IF jwt
import authRoutes from "./routes/authRoutes.js";
// #ENDIF
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Connect to database
// #IF mongo
connectDB();
// #ENDIF

// Middleware
// #IF helmet
app.use(helmet());
// #ENDIF
// #IF cors
app.use(cors());
// #ENDIF
// #IF morgan
app.use(morgan("combined"));
// #ENDIF
app.use(express.json());

// Routes
// #IF jwt
app.use("/api/auth", authRoutes);
// #ENDIF

// Error handler
app.use(errorHandler);

export default app;
