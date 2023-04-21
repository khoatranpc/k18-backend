import App from "./src/app";
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.SERVER_PORT || 5000;
App(Number(PORT));