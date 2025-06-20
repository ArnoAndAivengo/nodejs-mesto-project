import { Router } from 'express';
import {
  getUser, getUsersAll, createUser, updateUserAvatar, updateUserInfo,
} from '../controllers/users';

const router = Router();

router.get('/', getUsersAll);
router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

export default router;
