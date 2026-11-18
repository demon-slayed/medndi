import 'dotenv/config'
import express from 'express'
import connectDB from './config/db.js';
import dotenv from 'dotenv'
import cors from "cors";
import cookieParser from "cookie-parser";
// import { registerController } from './controllers/userController.js';
import authRouter from './routes/userRoute.js';
import treatmentRouter from './routes/treatmentRoute.js';
import hospitalRouter from './routes/hospitalRoute.js';
import hotelRouter from './routes/hotelRoute.js';
import insuranceRouter from './routes/insuranceRoute.js';
import applicationRouter from './routes/applicationRoute.js';
import adminRouter from './routes/adminRoute.js';
import postTreatmentRouter from './routes/postTreatmentRoute.js';
import paymentRouter from './routes/paymentRoute.js';
import notificationRouter from './routes/notificationRoute.js';
import flightRouter from './routes/flightRoute.js';
import travelRouter from './routes/travelRoutes.js';
import postCareFormRouter from './routes/postCareFormRoute.js'
import geminiRouter from  './routes/geminiRoute.js'
import fs from 'fs';
import path from 'path';

const uploadsDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


const app = express();
app.use(cors({
    origin: [
      "http://localhost:5173", "http://localhost:4173", "https://arogini-frontend-z4pz.vercel.app", "https://arogini-frontend-7skl.vercel.app", "https://arogini-frontend-z4pz-git-viv-vivek-ranjans-projects-ece138e0.vercel.app",
      // Extra comma-separated origins, e.g. CORS_ORIGINS=https://medndi.example.com
      ...(process.env.CORS_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean),
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

const PORT = process.env.PORT || 8080;

//middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(uploadsDir));



// routing userRoute
app.use('/api/users', authRouter);
app.use('/api/treatments', treatmentRouter)
app.use('/api/hospitals', hospitalRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/insurance', insuranceRouter);
app.use('/api/application', applicationRouter);
app.use('/api/admin', adminRouter);
app.use('/api/post-treatment', postTreatmentRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/flight', flightRouter);
app.use('/api/travel', travelRouter);
app.use('/api/postcareform', postCareFormRouter);
app.use('/api/gemini', geminiRouter);


app.get('/', (req, res)=>{
    res.send('<h1>Hello jii</h1>')
})

app.listen(PORT, ()=>{
     console.log("Server Running on PORT:", PORT);
     connectDB()   
})
