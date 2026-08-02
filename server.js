import express from "express"
import connectDb from "./config/Db.js"
import cors from 'cors'
import dotenv from 'dotenv';
import auth from './routes/auth.route.js'
import event from "./routes/event.route.js";
import registerEventsRoute from "./routes/registration.route.js";
import cookieParser from "cookie-parser";

dotenv.config()
const app = express();
app.use(cookieParser());
connectDb();
app.use(express.json())

app.use(cors({
     origin: [
         "http://localhost:5173",
         "http://localhost:5174",
         "https://event-management-frontend-t8ka.vercel.app"
     ],
    credentials: true,
}));


app.get("/",(req,res)=>{
    res.send("Event Management API Running...");
})

// auth
app.use('/api/auth', auth);
app.use('/api/events',event)
app.use("/api/registrations", registerEventsRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server running on this port ${PORT}`)
})