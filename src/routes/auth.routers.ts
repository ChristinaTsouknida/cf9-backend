import { Router } from "express";
import * as authCtrl from '../controller/auth.controller'
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post('/login', authCtrl.login);

export default router;