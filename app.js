import express from "express";
import { DataBaseConnect } from "./db/index.js";

import dotenv from "dotenv";
dotenv.config();

import tronRoutes from "./routes/tron.js";

const app = express();
const { NODE_LOCAL_PORT: port } = process.env;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/tron", tronRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  DataBaseConnect();
});

export default app;