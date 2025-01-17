import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

//routes
import authRoutes from './routes/auth.js';
import podcastsRoutes from './routes/podcast.js';
import userRoutes from './routes/user.js';

const app = express();
dotenv.config();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/** Middlewares */
app.use(express.json());
const corsConfig = {
    origin: "http://localhost:5173",
    credentials: true,
};
app.use(cors(corsConfig));


const port = process.env.PORT || 8700;

const connect = () => {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log('MongoDB connected');
    }).catch((err) => {
        console.log(err);
    });
};


app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/podcasts", podcastsRoutes)
app.use("/api/user", userRoutes)
// app.use("/api/project", projectRoutes)
// app.use("/api/team", teamRoutes)

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    })
})

app.listen(port, () => {
    console.log("Connected :",port)
    connect();
})
