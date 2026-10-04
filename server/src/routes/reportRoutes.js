import { Router } from 'express';
import {
  saveBatchReports,
  getStudentHistory,
  getReports,
  getPeriods,
} from '../controllers/reportController.js';

const router = Router();

router.post('/batch', saveBatchReports);
router.get('/history/:studentId', getStudentHistory);
router.get('/', getReports);
router.get('/periods', getPeriods);

export default router;
