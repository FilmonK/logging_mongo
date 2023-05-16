import express from 'express';
import controller from '../controllers/LogController'

const router = express.Router()

router.get('/alllogs', controller.getAllLogs)


export = router

