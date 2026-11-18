import express from 'express';
import authRouter from './module/auth/auth.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth',authRouter)

app.get('/test',(req,res)=>{
    return res.status(201).json({
        message:'Server is running'
    })
})


export default app;