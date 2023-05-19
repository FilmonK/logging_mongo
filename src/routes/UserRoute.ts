import express from 'express';
import controller from '../controllers/UserController';

const router = express.Router()

router.post('/create', controller.newUser)
router.post('/login', controller.loginUser)
router.post('/token', controller.assignRefreshToken)
router.post('/token', controller.logOutUser)


export = router