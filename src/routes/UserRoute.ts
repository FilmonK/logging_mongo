import express from 'express';
import controller from '../controllers/UserController';

const router = express.Router()

router.post('/create', controller.newUser)


export = router