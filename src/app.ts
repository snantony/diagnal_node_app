import path from "path";

import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";

import routes from "./routes/routes";
import rootPath from "./utils/path";

const app = express();


app.use(helmet());
app.use(compression());

app.use(bodyParser.json());

app.use("/images", express.static(path.join(rootPath, "data", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/contents", routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "page not found" });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: error });
});

app.listen(process.env.PORT || 8080);
