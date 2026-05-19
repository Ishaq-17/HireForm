import express from 'express';
import {
  submitResponse,
  getFormSubmissions,
  getSubmissionDetail,
  updateSubmissionStatus,
} from '../controllers/submissionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:formId', submitResponse);
router.get('/form/:formId', authMiddleware, getFormSubmissions);
router.get('/:id', authMiddleware, getSubmissionDetail);
router.put('/:id/status', authMiddleware, updateSubmissionStatus);

export default router;
