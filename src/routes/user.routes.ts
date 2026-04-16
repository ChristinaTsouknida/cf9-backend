import { Router } from 'express';
import * as userCtrl from '../controller/user.controller';

const router = Router();

router.get('/', userCtrl.getAll);
router.get('/email/:email', userCtrl.getOneByEmail);
router.post('/', authenticate, userCtrl.create);
router.put('/:username', userCtrl.update);


export default router;