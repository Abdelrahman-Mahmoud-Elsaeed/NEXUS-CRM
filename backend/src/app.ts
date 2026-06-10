import express, { Application } from "express";
import router from "./routes";
import cors from 'cors';
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app: Application = express();

app.use(cors({origin:"http://localhost:5173",credentials: true}));
app.use(cookieParser());
app.use(express.json());
const performanceFormat = ":method :url :status :response-time ms - :res[content-length]";

app.use(morgan(performanceFormat));

app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
  });
});

app.use("/v1/api",router)


export default app;