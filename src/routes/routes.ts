import { Router } from "express";

import { fetchContents } from "../controller/controller";

const routes = Router();

routes.get("/:pageNo", fetchContents);

export default routes;
